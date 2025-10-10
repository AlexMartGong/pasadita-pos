import React, {useCallback, useEffect, useState} from 'react';
import {useSale} from '../../hooks/sale/useSale';
import {useCustomer} from '../../hooks/customer/useCustomer';
import {useProduct} from '../../hooks/product/useProduct';
import {Box, Grid} from '@mui/material';
import {useAuth} from "../../auth/hooks/useAuth";
import {ProductsTable} from './ProductsTable';
import {SaleInfo} from './SaleInfo';
import {AddProductForm} from './AddProductForm';
import {ShoppingCart} from './ShoppingCart';
import '../../styles/css/SaleForm.css';

export const SaleForm = ({saleSelected}) => {
    const {handleSaveSale, initialSaleForm} = useSale();
    const {customers, handleGetCustomers} = useCustomer();
    const {products, handleGetProducts} = useProduct();
    const {user, employeeId} = useAuth();
    const isEditMode = saleSelected && saleSelected.id !== 0;
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

    useEffect(() => {
        handleGetCustomers();
        handleGetProducts();
    }, []);

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

    // Seleccionar el primer cliente por defecto cuando se cargan los clientes
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

    // Calcular descuento del cliente (valor fijo, no porcentaje)
    const getCustomerDiscount = useCallback(() => {
        if (!formData.customerId) return 0;
        const customer = customers.find(c => c.id === parseInt(formData.customerId));
        return customer?.customerType?.discountPercentage || customer?.customDiscount || 0;
    }, [customers, formData.customerId]);

    // Recalcular carrito cuando cambia el cliente seleccionado
    useEffect(() => {
        if (saleDetails.length > 0 && formData.customerId) {
            const discountAmount = getCustomerDiscount();

            const updatedDetails = saleDetails.map(detail => {
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

            setSaleDetails(updatedDetails);
            setFormData(prev => ({...prev, total: calculateTotal(updatedDetails)}));
        }
    }, [saleDetails, getCustomerDiscount, formData.customerId]);

    // Calcular total del producto seleccionado
    useEffect(() => {
        const qty = parseFloat(selectedProductData.quantity) || 0;
        const price = parseFloat(selectedProductData.price) || 0;
        setSelectedProductData(prev => ({
            ...prev,
            total: qty * price
        }));
    }, [selectedProductData.quantity, selectedProductData.price]);

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
        const discountPerUnit = selectedProductData.discount; // descuento fijo por unidad
        const subtotal = quantity * unitPrice;
        const discountAmount = quantity * discountPerUnit; // descuento total = cantidad × descuento por unidad
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

    // Obtener información del cliente seleccionado
    const selectedCustomer = customers.find(c => c.id === parseInt(formData.customerId));

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    return (
        <Box sx={{flexGrow: 1, p: 2, height: 'calc(100vh - 100px)'}} className="sale-form-container">
            <form onSubmit={handleSubmit} noValidate style={{height: '100%'}}>
                <Grid container spacing={2} sx={{height: '100%', flexWrap: 'nowrap !important'}}>
                    {/* Columna Izquierda - Lista de Productos */}
                    <Grid item xs={6}
                          sx={{height: '100%', minWidth: '400px', flex: '1 1 50%', maxWidth: '50% !important'}}>
                        <ProductsTable
                            products={products}
                            productSearch={productSearch}
                            onProductSearchChange={setProductSearch}
                            onSelectProduct={handleSelectProduct}
                            formatCurrency={formatCurrency}
                        />
                    </Grid>

                    {/* Columna Derecha */}
                    <Grid item xs={6} sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '400px',
                        flex: '1 1 50%',
                        maxWidth: '50% !important',
                        overflow: 'hidden'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            height: '100%',
                            overflow: 'auto',
                            minHeight: 0
                        }}>
                            <SaleInfo
                                user={user}
                                customers={customers}
                                formData={formData}
                                selectedCustomer={selectedCustomer}
                                paymentMethodId={paymentMethodId}
                                paid={paid}
                                notes={notes}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onPaymentMethodChange={setPaymentMethodId}
                                onPaidChange={setPaid}
                                onNotesChange={setNotes}
                            />

                            <AddProductForm
                                selectedProductData={selectedProductData}
                                errors={errors}
                                onSelectedProductChange={setSelectedProductData}
                                onAddToCart={handleAddToCart}
                                formatCurrency={formatCurrency}
                            />

                            <ShoppingCart
                                saleDetails={saleDetails}
                                formData={formData}
                                isEditMode={isEditMode}
                                isSubmitting={isSubmitting}
                                errors={errors}
                                onRemoveProduct={handleRemoveProduct}
                                onCancel={handleLocalCancel}
                                formatCurrency={formatCurrency}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};
