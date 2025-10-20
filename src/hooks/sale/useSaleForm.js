import {useCallback, useEffect, useState} from 'react';
import {useSale} from './useSale';
import {useCustomer} from '../customer/useCustomer';
import {useProduct} from '../product/useProduct';
import {useUser} from '../user/useUser';
import {useAuth} from '../../auth/hooks/useAuth';
import {deliveryOrderService} from '../../services/deliveryOrderService';
import {getSaleDetailsById} from '../../services/saleService';
import {toast} from 'react-toastify';

export const useSaleForm = (saleSelected) => {
    const {handleSaveSale, initialSaleForm} = useSale();
    const {customers, handleGetCustomers} = useCustomer();
    const {products, handleGetProducts} = useProduct();
    const {users, getAllUsers} = useUser();
    const {user, employeeId, role} = useAuth();

    const isEditMode = saleSelected && saleSelected.id !== 0;

    // Estados del formulario
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialSaleForm);
    const [deliveryOrderId, setDeliveryOrderId] = useState(null);
    const [saleDetails, setSaleDetails] = useState([]);
    const [productSearch, setProductSearch] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState(1);
    const [paid, setPaid] = useState(true);
    const [notes, setNotes] = useState('');
    const [selectedProductData, setSelectedProductData] = useState({
        id: '',
        name: '',
        quantity: '',
        price: '',
        total: 0
    });

    // Estados para delivery order
    const [deliveryEmployeeId, setDeliveryEmployeeId] = useState(null);
    const [deliveryCost, setDeliveryCost] = useState(0);

    // Verificar si el usuario tiene el rol ROLE_PEDIDOS o ROLE_ADMIN (para visualizar el componente)
    const hasDeliveryRole = role && (role.includes('ROLE_PEDIDOS') || role.includes('ROLE_ADMIN'));

    // Verificar si el usuario puede guardar delivery orders (solo ROLE_PEDIDOS)
    const canSaveDeliveryOrder = role && role.includes('ROLE_PEDIDOS');

    // Cargar clientes, productos y empleados al iniciar
    useEffect(() => {
        handleGetCustomers();
        handleGetProducts();
        if (hasDeliveryRole) {
            getAllUsers();
        }
    }, [hasDeliveryRole]);

    // Cargar datos de venta en modo edición
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

                // Cargar detalles de la venta desde la API
                try {
                    const response = await getSaleDetailsById(saleSelected.id);
                    if (response && response.data) {
                        // Transformar los datos de la API al formato del carrito
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
                        const deliveryOrders = await deliveryOrderService.getAllDeliveryOrders();
                        const existingDeliveryOrder = deliveryOrders.find(
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
    }, [saleSelected]);

    // Seleccionar el primer cliente por defecto
    useEffect(() => {
        if (customers.length > 0 && !formData.customerId && !isEditMode) {
            setFormData(prev => ({
                ...prev,
                customerId: customers[0].id
            }));
        }
    }, [customers, formData.customerId, isEditMode]);

    // Calcular total de detalles de venta
    const calculateTotal = (details) => {
        return details.reduce((sum, detail) => sum + detail.total, 0);
    };

    // Obtener descuento del cliente
    const getCustomerDiscount = useCallback(() => {
        if (!formData.customerId) return 0;
        const customer = customers.find(c => c.id === parseInt(formData.customerId));
        return customer?.customerType?.discountPercentage || customer?.customDiscount || 0;
    }, [customers, formData.customerId]);

    // Recalcular carrito cuando cambia el cliente seleccionado
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

    // Setter mejorado para selectedProductData que calcula el total automáticamente
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

    // Manejar selección de producto desde la tabla
    const handleSelectProduct = (product) => {
        const discountAmount = getCustomerDiscount();
        const discountedPrice = product.price - discountAmount;

        setSelectedProductData({
            id: product.id,
            name: product.name,
            quantity: product.unitMeasure === 'kg' ? '' : '1',
            price: discountedPrice,
            originalPrice: product.price,
            discount: discountAmount,
            total: product.unitMeasure === 'kg' ? 0 : discountedPrice
        });
    };

    // Agregar producto al carrito
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

        // Limpiar formulario de producto
        setSelectedProductData({
            id: '',
            name: '',
            quantity: '',
            price: '',
            total: 0
        });
        setErrors({...errors, cart: ''});
    };

    // Remover producto del carrito
    const handleRemoveProduct = (productId) => {
        const newDetails = saleDetails.filter(d => d.productId !== productId);
        setSaleDetails(newDetails);
        setFormData({...formData, total: calculateTotal(newDetails)});
    };

    // Validar formulario
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

    // Manejar cambios en inputs
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

    // Limpiar formulario y preparar para nueva venta
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
        setErrors({});

        // Restablecer el primer cliente como seleccionado
        if (customers.length > 0) {
            setFormData(prev => ({
                ...prev,
                customerId: customers[0].id
            }));
        }
    };

    // Formatear número a 2 decimales
    const formatToTwoDecimals = (value) => {
        return Math.round((value || 0) * 100) / 100;
    };

    // Manejar envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Calcular subtotal y descuento total
            const subtotal = saleDetails.reduce((sum, detail) => sum + detail.subtotal, 0);
            const discountAmount = saleDetails.reduce((sum, detail) => sum + detail.discount, 0);

            const saleData = {
                id: saleSelected?.id || 0,
                employeeId: employeeId,
                customerId: parseInt(formData.customerId),
                paymentMethodId: paymentMethodId,
                subtotal: formatToTwoDecimals(subtotal),
                discountAmount: formatToTwoDecimals(discountAmount),
                total: formatToTwoDecimals(formData.total),
                paid: paid,
                notes: notes || '',
                saleDetails: saleDetails.map(detail => ({
                    productId: detail.productId,
                    quantity: formatToTwoDecimals(detail.quantity),
                    unitPrice: formatToTwoDecimals(detail.unitPrice),
                    subtotal: formatToTwoDecimals(detail.subtotal),
                    discount: formatToTwoDecimals(detail.discount),
                    total: formatToTwoDecimals(detail.total)
                }))
            };

            const savedSale = await handleSaveSale(saleData);

            if (savedSale) {
                if (hasDeliveryRole && saleData.employeeId) {
                    try {
                        const customer = customers.find(c => c.id === parseInt(formData.customerId));
                        const deliveryOrderData = {
                            saleId: savedSale.id,
                            deliveryEmployeeId: savedSale.employeeId,
                            deliveryAddress: customer?.address || '',
                            contactPhone: customer?.phone || '',
                            deliveryCost: deliveryCost || 0
                        };

                        if (isEditMode) {
                            await deliveryOrderService.updateDeliveryOrder(deliveryOrderId, deliveryOrderData);
                        } else {
                            await deliveryOrderService.saveDeliveryOrder(deliveryOrderData);
                        }
                    } catch (deliveryError) {
                        console.error('Error saving delivery order:', deliveryError);
                        toast.error('La venta se guardó pero hubo un error al crear el pedido de entrega.');
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

    // Formatear moneda
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    // Obtener cliente seleccionado
    const selectedCustomer = customers.find(c => c.id === parseInt(formData.customerId));

    return {
        // Estados
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

        // Estados de delivery order
        deliveryEmployeeId,
        deliveryCost,

        // Setters
        setProductSearch,
        setSelectedProductData: updateSelectedProductData,
        setPaymentMethodId,
        setPaid,
        setNotes,
        setDeliveryEmployeeId,
        setDeliveryCost,

        // Funciones
        handleSelectProduct,
        handleAddToCart,
        handleRemoveProduct,
        handleInputChange,
        handleLocalCancel,
        handleSubmit,
        formatCurrency
    };
};
