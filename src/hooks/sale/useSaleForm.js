import {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSale} from './useSale';
import {useCustomer} from '../customer/useCustomer';
import {useProduct} from '../product/useProduct';
import {useUser} from '../user/useUser';
import {useCustomerFiscalData} from '../customerFiscalData/useCustomerFiscalData';
import {useInvoice} from '../invoice/useInvoice';
import {useAuth} from '../../auth/hooks/useAuth';
import {useApiErrorHandler} from '../useApiErrorHandler';
import {deliveryOrderService} from '../../services/deliveryOrderService';
import {getSaleDetailsById, getTicketBySaleId, openDrawer} from '../../services/saleService';
import {toast} from 'react-toastify';
import {formatCurrency, toNumber} from '../../utils/formatters';
import {clearActiveDraft, setActiveDraft} from '../../stores/slices/sale/saleSlice';
import {getCachedStationId} from '../../services/agentService';

const NO_DISCOUNT_PRICE_MIN = 1;
const NO_DISCOUNT_PRICE_MAX = 10;

const formatToTwoDecimals = (value) => {
    const n = toNumber(value);
    return Number(Math.round(n + "e2") + "e-2");
};

const formatToThreeDecimals = (value) => {
    const n = toNumber(value);
    return Number(Math.round(n + "e3") + "e-3");
};

// Espeja SaleServiceImpl.resolveApplicableUnitDiscount del backend:
// productos con precio en [1, 10] no admiten descuento; en el resto el
// descuento por unidad se topa al precio para que el neto nunca sea negativo.
const resolveApplicableUnitDiscount = (unitPrice, requestedUnitDiscount) => {
    const price = toNumber(unitPrice);
    const requested = Math.max(toNumber(requestedUnitDiscount), 0);
    if (price >= NO_DISCOUNT_PRICE_MIN && price <= NO_DISCOUNT_PRICE_MAX) return 0;
    return Math.min(requested, price);
};

// Matemática por renglón, idéntica a la del backend (redondeo HALF_UP por detalle).
// `discount` en el renglón es el total del renglón (unitDiscount × qty);
// `unitDiscount` es el valor por unidad que viaja al backend.
const computeLineAmounts = (unitPrice, quantity, requestedUnitDiscount) => {
    const price = toNumber(unitPrice);
    const qty = toNumber(quantity);
    const unitDiscount = resolveApplicableUnitDiscount(price, requestedUnitDiscount);
    const subtotal = formatToTwoDecimals(price * qty);
    const discount = formatToTwoDecimals(unitDiscount * qty);
    const total = formatToTwoDecimals((price - unitDiscount) * qty);
    return {unitDiscount, subtotal, discount, total};
};

// Total global estricto: Σ subtotal − Σ descuento (no Σ line.total), igual que
// el header del backend — evita desfases de un centavo con cantidades de 3 decimales.
const calculateTotal = (details) => {
    const subtotal = details.reduce((sum, d) => sum + toNumber(d.subtotal), 0);
    const discount = details.reduce((sum, d) => sum + toNumber(d.discount), 0);
    return formatToTwoDecimals(subtotal - discount);
};

export const useSaleForm = (saleSelected) => {
    const dispatch = useDispatch();
    const {handleSaveSale, initialSaleForm} = useSale();
    const {customers, handleGetCustomers} = useCustomer();
    const {products, handleGetProducts} = useProduct();
    const {users, getAllUsers} = useUser();
    const {handleGetAllFiscalData} = useCustomerFiscalData();
    const {handleTimbrarInvoice, handleSendInvoiceEmail} = useInvoice();
    const {user, employeeId, role} = useAuth();
    const {handleApiError} = useApiErrorHandler();
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
    const [postSaleData, setPostSaleData] = useState({
        isOpen: false,
        saleId: null,
        total: 0,
        amountTendered: 0,
        changeDue: 0,
    });

    const hasDeliveryRole = role && (role.includes('ROLE_PEDIDOS') || role.includes('ROLE_ADMIN'));

    const canSaveDeliveryOrder = role && (
        role.includes('ROLE_PEDIDOS') ||
        (role.includes('ROLE_ADMIN') && operationType === 'pedido')
    );

    const isAdmin = role && role.includes('ROLE_ADMIN');

    // Solo ADMIN y CAJERO pueden abrir la gaveta (backend rechaza PEDIDOS con 403).
    const canOpenDrawer = role && (role.includes('ROLE_ADMIN') || role.includes('ROLE_CAJERO'));

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
                        // El backend responde `discount` como total del renglón:
                        // se deriva el valor por unidad y se re-aplica la regla.
                        const cartDetails = response.data.map(detail => {
                            const quantity = formatToThreeDecimals(detail.quantity);
                            const unitPrice = formatToTwoDecimals(detail.unitPrice);
                            const requestedUnit = quantity > 0
                                ? toNumber(detail.discount) / quantity
                                : 0;
                            return {
                                productId: detail.productId,
                                productName: detail.productName,
                                quantity,
                                unitPrice,
                                ...computeLineAmounts(unitPrice, quantity, requestedUnit)
                            };
                        });
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

    const getCustomerDiscount = useCallback(() => {
        if (!formData.customerId) return 0;
        const customer = customers.find(c => c.id === parseInt(formData.customerId));
        return customer?.customerType?.discountPercentage || customer?.customDiscount || 0;
    }, [customers, formData.customerId]);

    useEffect(() => {
        if (formData.customerId) {
            setSaleDetails(prevDetails => {
                if (prevDetails.length === 0) return prevDetails;

                const requested = getCustomerDiscount();

                const updatedDetails = prevDetails.map(detail => ({
                    ...detail,
                    ...computeLineAmounts(detail.unitPrice, detail.quantity, requested)
                }));

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
        const unitDiscount = resolveApplicableUnitDiscount(product.price, getCustomerDiscount());
        const discountedPrice = formatToTwoDecimals(product.price - unitDiscount);
        const isKilogram = product.unitMeasure === 'KILOGRAMO';

        setSelectedProductData({
            id: product.id,
            name: product.name,
            quantity: isKilogram ? '' : '1',
            price: discountedPrice,
            originalPrice: product.price,
            discount: unitDiscount,
            total: isKilogram ? 0 : discountedPrice,
            unitMeasure: product.unitMeasure || ''
        });
    }, [getCustomerDiscount]);

    const handleAddToCart = useCallback(() => {
        if (!selectedProductData.id || !selectedProductData.quantity || selectedProductData.quantity <= 0) {
            setErrors(prev => ({...prev, cart: 'Complete todos los campos del producto'}));
            return;
        }

        const quantity = toNumber(selectedProductData.quantity);
        const requested = getCustomerDiscount();

        setSaleDetails(prevDetails => {
            const existingDetail = prevDetails.find(d => d.productId === selectedProductData.id);

            let newDetails;
            if (existingDetail) {
                const newQuantity = toNumber(existingDetail.quantity) + quantity;
                newDetails = prevDetails.map(d =>
                    d.productId === selectedProductData.id
                        ? {
                            ...d,
                            quantity: newQuantity,
                            ...computeLineAmounts(d.unitPrice, newQuantity, requested)
                        }
                        : d
                );
            } else {
                const unitPrice = toNumber(selectedProductData.originalPrice);
                newDetails = [...prevDetails, {
                    productId: selectedProductData.id,
                    productName: selectedProductData.name,
                    unitPrice: unitPrice,
                    quantity: quantity,
                    ...computeLineAmounts(unitPrice, quantity, requested)
                }];
            }

            setFormData(prev => ({...prev, total: calculateTotal(newDetails)}));
            return newDetails;
        });

        setSelectedProductData({
            id: '',
            name: '',
            quantity: '',
            price: '',
            total: 0
        });
        setErrors(prev => ({...prev, cart: ''}));
    }, [selectedProductData, getCustomerDiscount]);

    const handleRemoveProduct = useCallback((productId) => {
        setSaleDetails(prevDetails => {
            const newDetails = prevDetails.filter(d => d.productId !== productId);
            setFormData(prev => ({...prev, total: calculateTotal(newDetails)}));
            return newDetails;
        });
    }, []);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.customerId) {
            newErrors.customerId = 'El cliente es obligatorio';
        }

        if (saleDetails.length === 0) {
            newErrors.saleDetails = 'Debe agregar al menos un producto';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.customerId, saleDetails.length]);

    const handleInputChange = useCallback((field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        setErrors(prev => (prev[field] ? {...prev, [field]: ''} : prev));
    }, []);

    const handleLocalCancel = useCallback(() => {
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
    }, [customers, initialSaleForm, dispatch]);


    const handleSubmit = useCallback(async (amountTenderedValue) => {
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
                printTicket: false,
                stationId: getCachedStationId(),
                saleDetails: saleDetails.map(detail => ({
                    productId: detail.productId,
                    quantity: formatToThreeDecimals(detail.quantity),
                    unitPrice: formatToTwoDecimals(detail.unitPrice),
                    subtotal: formatToTwoDecimals(detail.subtotal),
                    // Nuevo contrato: `discount` viaja POR UNIDAD (el backend lo
                    // multiplica por quantity). Fallback para renglones de drafts viejos.
                    discount: formatToTwoDecimals(
                        detail.unitDiscount ??
                        (toNumber(detail.quantity) > 0
                            ? toNumber(detail.discount) / toNumber(detail.quantity)
                            : 0)
                    ),
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
                const total = formatToTwoDecimals(formData.total);
                const tendered = formatToTwoDecimals(amountTenderedValue);
                setPostSaleData({
                    isOpen: true,
                    saleId: result.id,
                    total,
                    amountTendered: tendered,
                    changeDue: formatToTwoDecimals(tendered - total),
                });
                // La limpieza se difiere a handleClosePostSaleModal para mantener
                // el ticket visible detrás del modal de resumen post-venta.
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [
        saleDetails,
        formData.customerId,
        formData.total,
        customers,
        saleSelected,
        employeeId,
        paymentMethodId,
        paid,
        notes,
        deliveryCost,
        canSaveDeliveryOrder,
        requiresInvoice,
        selectedFiscalId,
        customerFiscalDataList,
        handleSaveSale,
        handleTimbrarInvoice,
        handleSendInvoiceEmail
    ]);

    const handleClosePostSaleModal = useCallback(() => {
        setPostSaleData(prev => ({...prev, isOpen: false}));
        handleLocalCancel(); // limpia carrito/form y deja la caja lista
    }, [handleLocalCancel]);

    const handlePrintPostSaleTicket = useCallback(() => {
        if (postSaleData.saleId) {
            // GET con stationId → el backend imprime por WebSocket (fire-and-forget)
            getTicketBySaleId(postSaleData.saleId, getCachedStationId()).catch(() => {});
        }
        handleClosePostSaleModal();
    }, [postSaleData.saleId, handleClosePostSaleModal]);

    const handleOpenDrawer = useCallback(async () => {
        try {
            await openDrawer(getCachedStationId());
            toast.success('Comando enviado');
        } catch (error) {
            handleApiError(error);
        }
    }, [handleApiError]);

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
        postSaleData,
        canOpenDrawer,
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
        handleClosePostSaleModal,
        handlePrintPostSaleTicket,
        handleOpenDrawer,
        validateForm,
        formatCurrency
    };
};
