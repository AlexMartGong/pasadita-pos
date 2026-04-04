import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSale} from './useSale';
import {useCustomer} from '../customer/useCustomer';
import {useProduct} from '../product/useProduct';
import {useUser} from '../user/useUser';
import {useAuth} from '../../auth/hooks/useAuth';
import {deliveryOrderService} from '../../services/deliveryOrderService';
import {getSaleDetailsById} from '../../services/saleService';
import {toast} from 'react-toastify';
import {formatCurrency} from '../../utils/formatters';
import {clearActiveDraft, setActiveDraft} from '../../stores/slices/sale/saleSlice';
import {getCachedStationId} from '../../services/agentService';

export const useSaleForm = (saleSelected) => {
    const dispatch = useDispatch();
    const {handleSaveSale, initialSaleForm} = useSale();
    const {customers, handleGetCustomers} = useCustomer();
    const {products, handleGetProducts} = useProduct();
    const {users, getAllUsers} = useUser();
    const {user, employeeId, role} = useAuth();
    const {activeDraft} = useSelector(state => state.sale);

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
                            quantity: detail.quantity,
                            unitPrice: detail.unitPrice,
                            subtotal: detail.subtotal,
                            discount: detail.discount,
                            total: detail.total
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
        return details.reduce((sum, detail) => sum + detail.total, 0);
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
                    const quantity = detail.quantity;
                    const unitPrice = detail.unitPrice;
                    const subtotal = quantity * unitPrice;
                    const discountTotal = quantity * discountAmount;
                    const total = subtotal - discountTotal;

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
            const qty = parseFloat(updated.quantity) || 0;
            const price = parseFloat(updated.price) || 0;
            return {
                ...updated,
                total: qty * price
            };
        });
    }, []);

    const handleSelectProduct = (product) => {
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
    };

    const handleAddToCart = () => {
        if (!selectedProductData.id || !selectedProductData.quantity || selectedProductData.quantity <= 0) {
            setErrors({...errors, cart: 'Complete todos los campos del producto'});
            return;
        }

        const quantity = parseFloat(selectedProductData.quantity);
        const unitPrice = parseFloat(selectedProductData.originalPrice);
        const discountPerUnit = selectedProductData.discount;
        const subtotal = quantity * unitPrice;
        const discountAmount = quantity * discountPerUnit;
        const total = subtotal - discountAmount;

        const existingDetail = saleDetails.find(d => d.productId === selectedProductData.id);

        let newDetails;
        if (existingDetail) {
            const newQuantity = parseFloat(existingDetail.quantity) + quantity;
            const newSubtotal = newQuantity * unitPrice;
            const newDiscountAmount = newQuantity * discountPerUnit;
            const newTotal = newSubtotal - newDiscountAmount;

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
        return Number(Math.round((value || 0) + "e2") + "e-2");
    };

    const formatToThreeDecimals = (value) => {
        return Number(Math.round((value || 0) + "e3") + "e-3");
    };

    const handleSubmit = async (amountTenderedValue) => {
        setIsSubmitting(true);

        try {
            setAmountTendered(String(amountTenderedValue));

            const subtotal = saleDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
            const discountAmount = saleDetails.reduce((sum, detail) => sum + detail.discount, 0);
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
