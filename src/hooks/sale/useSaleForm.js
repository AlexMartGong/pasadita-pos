import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSale} from './useSale';
import {useCustomer} from '../customer/useCustomer';
import {useProduct} from '../product/useProduct';
import {useUser} from '../user/useUser';
import {useCustomerFiscalData} from '../customerFiscalData/useCustomerFiscalData';
import {useInvoice} from '../invoice/useInvoice';
import {useAuth} from '../../auth/hooks/useAuth';
import {deliveryOrderService} from '../../services/deliveryOrderService';
import {getSaleDetailsById} from '../../services/saleService';
import {toast} from 'react-toastify';
import {formatCurrency, toNumber} from '../../utils/formatters';
import {clearActiveDraft, setActiveDraft} from '../../stores/slices/sale/saleSlice';
import {getCachedStationId} from '../../services/agentService';

export const useSaleForm = (saleSelected) => {
    const dispatch = useDispatch();
    const {handleSaveSale, initialSaleForm} = useSale();
    const {customers, handleGetCustomers} = useCustomer();
    const {products, handleGetProducts} = useProduct();
    const {users, getAllUsers} = useUser();
    const {handleGetAllFiscalData} = useCustomerFiscalData();
    const {handleTimbrarInvoice, handleSendInvoiceEmail} = useInvoice();
    const {user, employeeId, role} = useAuth();
    const {activeDraft} = useSelector(state => state.sale);
    const customerFiscalDataList = useSelector(
        (state) => state.customerFiscalData.customerFiscalDataList
    );

    const isEditMode = saleSelected && saleSelected.id !== 0;

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(() => !isEditMode ? activeDraft.formData : initialSaleForm);
    const [setDeliveryOrderId] = useState(null);
    const [saleDetails, setSaleDetails] = useState(() => !isEditMode ? activeDraft.saleDetails : []);
    const [productSearch, setProductSearch] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState(() => !isEditMode ? activeDraft.paymentMethodId : 1);
    const [paid, setPaid] = useState(() => !isEditMode ? activeDraft.paid : true);
    const [notes, setNotes] = useState(() => !isEditMode ? activeDraft.notes : '');
    const [selectedProductData, setSelectedProductData] = useState({
        id: '',
        name: '',
        quantity: '',
        price: '',
        total: 0,
        unitMeasure: ''
    });

    const [deliveryEmployeeId, setDeliveryEmployeeId] = useState(() => !isEditMode ? activeDraft.deliveryEmployeeId : null);
    const [deliveryCost, setDeliveryCost] = useState(() => !isEditMode ? activeDraft.deliveryCost : 0);
    const [amountTendered, setAmountTendered] = useState(() => !isEditMode ? (activeDraft.amountTendered ?? '') : '');

    const [operationType, setOperationType] = useState(() => !isEditMode ? activeDraft.operationType : 'venta'); // 'venta' o 'pedido'

    const [requiresInvoice, setRequiresInvoice] = useState(false);
    const [selectedFiscalId, setSelectedFiscalId] = useState(null);

    const hasDeliveryRole = role && (role.includes('ROLE_PEDIDOS') || role.includes('ROLE_ADMIN'));

    const canSaveDeliveryOrder = role && (
        role.includes('ROLE_PEDIDOS') ||
        (role.includes('ROLE_ADMIN') && operationType === 'pedido')
    );

    const isAdmin = role && role.includes('ROLE_ADMIN');

    const changeDue = amountTendered !== '' && !isNaN(parseFloat(amountTendered))
        ? parseFloat(amountTendered) - formData.total
        : null;

    useEffect(() => {
        if (!isEditMode) {
            dispatch(setActiveDraft({
                saleDetails,
                formData,
                paymentMethodId,
                paid,
                notes,
                operationType,
                deliveryEmployeeId,
                deliveryCost,
                amountTendered,
            }));
        }
    }, [saleDetails, formData, paymentMethodId, paid, notes, operationType, deliveryEmployeeId, deliveryCost, amountTendered, isEditMode, dispatch]);

    useEffect(() => {
        handleGetCustomers();
        handleGetProducts();
        handleGetAllFiscalData();
        if (hasDeliveryRole) {
            getAllUsers();
        }
    }, [hasDeliveryRole]);

    useEffect(() => {
        const loadSaleData = async () => {
            if (saleSelected && saleSelected.id !== 0) {
                setFormData({
                    id: saleSelected.id || 0,
                    customerId: saleSelected.customerId || null,
                    employeeId: saleSelected.employeeId || null,
                    total: saleSelected.total || 0,
                });
                setPaymentMethodId(saleSelected.paymentMethodId || 1);
                setPaid(saleSelected.paid !== undefined ? saleSelected.paid : true);
                setNotes(saleSelected.notes || '');
                setAmountTendered(saleSelected.amountTendered ?? '');

                try {
                    const response = await getSaleDetailsById(saleSelected.id);
                    if (response && response.data) {
                        const cartDetails = response.data.map(detail => ({
                            productId: detail.productId,
                            productName: detail.productName,
                            quantity: formatToThreeDecimals(detail.quantity),
                            unitPrice: formatToTwoDecimals(detail.unitPrice),
                            subtotal: formatToTwoDecimals(detail.subtotal),
                            discount: formatToTwoDecimals(detail.discount),
                            total: formatToTwoDecimals(detail.total)
                        }));
                        setSaleDetails(cartDetails);
                    }
                } catch (error) {
                    console.error('Error loading sale details:', error);
                    toast.error('Error al cargar los detalles de la venta');
                    setSaleDetails([]);
                }
                if (hasDeliveryRole) {
                    try {
                        const result = await deliveryOrderService.getAllDeliveryOrders();
                        const existingDeliveryOrder = result.orders.find(
                            order => order.saleId === saleSelected.id
                        );

                        if (existingDeliveryOrder) {
                            setDeliveryOrderId(existingDeliveryOrder.id);
                            setDeliveryEmployeeId(existingDeliveryOrder.deliveryEmployeeId);
                            setDeliveryCost(existingDeliveryOrder.deliveryCost);
                        }
                    } catch (error) {
                        console.error('Error loading delivery order:', error);
                    }
                }
            }
        };

        loadSaleData();
    }, [hasDeliveryRole, saleSelected, setDeliveryOrderId]);

    useEffect(() => {
        if (customers.length > 0 && !formData.customerId && !isEditMode) {
            setFormData(prev => ({
                ...prev,
                customerId: customers[0].id
            }));
        }
    }, [customers, formData.customerId, isEditMode]);

    const calculateTotal = (details) => {
        return formatToTwoDecimals(details.reduce((sum, detail) => sum + toNumber(detail.total), 0));
    };

    const getCustomerDiscount = useCallback(() => {
        if (!formData.customerId) return 0;
        const customer = customers.find(c => c.id === parseInt(formData.customerId));
        return customer?.customerType?.discountPercentage || customer?.customDiscount || 0;
    }, [customers, formData.customerId]);

    useEffect(() => {
        if (formData.customerId) {
            setSaleDetails(prevDetails => {
                if (prevDetails.length === 0) return prevDetails;

                const discountAmount = getCustomerDiscount();

                const updatedDetails = prevDetails.map(detail => {
                    const quantity = toNumber(detail.quantity);
                    const unitPrice = toNumber(detail.unitPrice);
                    const subtotal = formatToTwoDecimals(quantity * unitPrice);
                    const discountTotal = formatToTwoDecimals(quantity * discountAmount);
                    const total = formatToTwoDecimals(subtotal - discountTotal);

                    return {
                        ...detail,
                        subtotal: subtotal,
                        discount: discountTotal,
                        total: total
                    };
                });

                setFormData(prev => ({...prev, total: calculateTotal(updatedDetails)}));
                return updatedDetails;
            });
        }
    }, [formData.customerId, getCustomerDiscount]);

    const updateSelectedProductData = useCallback((updates) => {
        setSelectedProductData(prev => {
            const updated = typeof updates === 'function' ? updates(prev) : {...prev, ...updates};
            const qty = toNumber(updated.quantity);
            const price = toNumber(updated.price);
            return {
                ...updated,
                total: qty * price
            };
        });
    }, []);

    const handleSelectProduct = useCallback((product) => {
        const discountAmount = getCustomerDiscount();
        const discountedPrice = product.price - discountAmount;
        const isKilogram = product.unitMeasure === 'KILOGRAMO';

        setSelectedProductData({
            id: product.id,
            name: product.name,
            quantity: isKilogram ? '' : '1',
            price: discountedPrice,
            originalPrice: product.price,
            discount: discountAmount,
            total: isKilogram ? 0 : discountedPrice,
            unitMeasure: product.unitMeasure || ''
        });
    }, [getCustomerDiscount]);

    const handleAddToCart = () => {
        if (!selectedProductData.id || !selectedProductData.quantity || selectedProductData.quantity <= 0) {
            setErrors({...errors, cart: 'Complete todos los campos del producto'});
            return;
        }

        const quantity = toNumber(selectedProductData.quantity);
        const unitPrice = toNumber(selectedProductData.originalPrice);
        const discountPerUnit = toNumber(selectedProductData.discount);
        const subtotal = formatToTwoDecimals(quantity * unitPrice);
        const discountAmount = formatToTwoDecimals(quantity * discountPerUnit);
        const total = formatToTwoDecimals(subtotal - discountAmount);

        const existingDetail = saleDetails.find(d => d.productId === selectedProductData.id);

        let newDetails;
        if (existingDetail) {
            const newQuantity = toNumber(existingDetail.quantity) + quantity;
            const newSubtotal = formatToTwoDecimals(newQuantity * unitPrice);
            const newDiscountAmount = formatToTwoDecimals(newQuantity * discountPerUnit);
            const newTotal = formatToTwoDecimals(newSubtotal - newDiscountAmount);

            newDetails = saleDetails.map(d =>
                d.productId === selectedProductData.id
                    ? {
                        ...d,
                        quantity: newQuantity,
                        subtotal: newSubtotal,
                        discount: newDiscountAmount,
                        total: newTotal
                    }
                    : d
            );
        } else {
            newDetails = [...saleDetails, {
                productId: selectedProductData.id,
                productName: selectedProductData.name,
                unitPrice: unitPrice,
                quantity: quantity,
                subtotal: subtotal,
                discount: discountAmount,
                total: total
            }];
        }

        setSaleDetails(newDetails);
        setFormData({...formData, total: calculateTotal(newDetails)});

        setSelectedProductData({
            id: '',
            name: '',
            quantity: '',
            price: '',
            total: 0
        });
        setErrors({...errors, cart: ''});
    };

    const handleRemoveProduct = (productId) => {
        const newDetails = saleDetails.filter(d => d.productId !== productId);
        setSaleDetails(newDetails);
        setFormData({...formData, total: calculateTotal(newDetails)});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.customerId) {
            newErrors.customerId = 'El cliente es obligatorio';
        }

        if (saleDetails.length === 0) {
            newErrors.saleDetails = 'Debe agregar al menos un producto';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleLocalCancel = () => {
        setFormData(initialSaleForm);
        setSaleDetails([]);
        setPaymentMethodId(1);
        setPaid(true);
        setNotes('');
        setProductSearch('');
        setSelectedProductData({
            id: '',
            name: '',
            quantity: '',
            price: '',
            total: 0
        });
        setDeliveryEmployeeId(null);
        setDeliveryCost(0);
        setAmountTendered('');
        setOperationType('venta');
        setRequiresInvoice(false);
        setSelectedFiscalId(null);
        setErrors({});
        dispatch(clearActiveDraft());

        if (customers.length > 0) {
            setFormData(prev => ({
                ...prev,
                customerId: customers[0].id
            }));
        }
    };


    const formatToTwoDecimals = (value) => {
        const n = toNumber(value);
        return Number(Math.round(n + "e2") + "e-2");
    };

    const formatToThreeDecimals = (value) => {
        const n = toNumber(value);
        return Number(Math.round(n + "e3") + "e-3");
    };

    const handleSubmit = async (amountTenderedValue) => {
        setIsSubmitting(true);

        try {
            setAmountTendered(String(amountTenderedValue));

            const subtotal = saleDetails.reduce((sum, detail) => sum + toNumber(detail.subtotal), 0);
            const discountAmount = saleDetails.reduce((sum, detail) => sum + toNumber(detail.discount), 0);
            const customer = customers.find(c => c.id === parseInt(formData.customerId));

            const saleData = {
                id: saleSelected?.id || 0,
                employeeId: employeeId,
                customerId: parseInt(formData.customerId),
                paymentMethodId: paymentMethodId,
                subtotal: formatToTwoDecimals(subtotal),
                discountAmount: formatToTwoDecimals(discountAmount),
                total: formatToTwoDecimals(formData.total),
                amountTendered: formatToTwoDecimals(amountTenderedValue),
                paid: paid,
                notes: notes || '',
                stationId: getCachedStationId(),
                saleDetails: saleDetails.map(detail => ({
                    productId: detail.productId,
                    quantity: formatToThreeDecimals(detail.quantity),
                    unitPrice: formatToTwoDecimals(detail.unitPrice),
                    subtotal: formatToTwoDecimals(detail.subtotal),
                    discount: formatToTwoDecimals(detail.discount),
                    total: formatToTwoDecimals(detail.total)
                })),
                deliveryOrder: canSaveDeliveryOrder ? {
                    deliveryEmployeeId: employeeId,
                    deliveryAddress: customer?.address || '',
                    contactPhone: customer?.phone || '',
                    deliveryCost: deliveryCost || 0
                } : null
            };

            const result = await handleSaveSale(saleData);
            if (result) {
                if (requiresInvoice && selectedFiscalId) {
                    const invoiceResult = await handleTimbrarInvoice({
                        saleId: result.id,
                        fiscalId: selectedFiscalId,
                    });
                    if (invoiceResult) {
                        const fiscalData = customerFiscalDataList.find(
                            f => f.fiscalId === selectedFiscalId
                        );
                        if (fiscalData?.emailFacturacion) {
                            handleSendInvoiceEmail(result.id, fiscalData.emailFacturacion)
                                .catch(() => {});
                        }
                    }
                }
                handleLocalCancel();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedCustomer = customers.find(c => c.id === parseInt(formData.customerId));

    return {
        user,
        customers,
        products,
        employees: users,
        formData,
        saleDetails,
        productSearch,
        paymentMethodId,
        paid,
        notes,
        selectedProductData,
        errors,
        isSubmitting,
        isEditMode,
        selectedCustomer,
        hasDeliveryRole,
        canSaveDeliveryOrder,
        isAdmin,
        operationType,
        deliveryEmployeeId,
        deliveryCost,
        amountTendered,
        changeDue,
        requiresInvoice,
        selectedFiscalId,
        customerFiscalDataList,
        setRequiresInvoice,
        setSelectedFiscalId,
        setProductSearch,
        setSelectedProductData: updateSelectedProductData,
        setPaymentMethodId,
        setPaid,
        setNotes,
        setDeliveryEmployeeId,
        setDeliveryCost,
        setAmountTendered,
        setOperationType,
        handleSelectProduct,
        handleAddToCart,
        handleRemoveProduct,
        handleInputChange,
        handleLocalCancel,
        handleSubmit,
        validateForm,
        formatCurrency
    };
};
