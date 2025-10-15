import {useCallback, useEffect, useState} from 'react';
import {useSale} from './useSale';
import {useCustomer} from '../customer/useCustomer';
import {useProduct} from '../product/useProduct';
import {useAuth} from '../../auth/hooks/useAuth';

export const useSaleForm = (saleSelected) => {
    const {handleSaveSale, initialSaleForm} = useSale();
    const {customers, handleGetCustomers} = useCustomer();
    const {products, handleGetProducts} = useProduct();
    const {user, employeeId} = useAuth();

    const isEditMode = saleSelected && saleSelected.id !== 0;

    // Estados del formulario
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialSaleForm);
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

    // Cargar clientes y productos al iniciar
    useEffect(() => {
        handleGetCustomers();
        handleGetProducts();
    }, []);

    // Cargar datos de venta en modo edición
    useEffect(() => {
        if (saleSelected && saleSelected.id !== 0) {
            setFormData({
                id: saleSelected.id || 0,
                customerId: saleSelected.customerId || null,
                employeeId: saleSelected.employeeId || null,
                saleDate: saleSelected.saleDate || new Date().toISOString(),
                total: saleSelected.total || 0,
            });
            setSaleDetails(saleSelected.saleDetails || []);
        }
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
        setErrors({});

        // Restablecer el primer cliente como seleccionado
        if (customers.length > 0) {
            setFormData(prev => ({
                ...prev,
                customerId: customers[0].id
            }));
        }
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
                subtotal: subtotal,
                discountAmount: discountAmount,
                total: formData.total,
                paid: paid,
                notes: notes || '',
                saleDetails: saleDetails.map(detail => ({
                    productId: detail.productId,
                    quantity: detail.quantity,
                    unitPrice: detail.unitPrice,
                    subtotal: detail.subtotal,
                    discount: detail.discount,
                    total: detail.total
                }))
            };

            const success = await handleSaveSale(saleData);

            if (success) {
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

        // Setters
        setProductSearch,
        setSelectedProductData: updateSelectedProductData,
        setPaymentMethodId,
        setPaid,
        setNotes,

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
