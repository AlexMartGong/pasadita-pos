import React, {useEffect, useState} from 'react';
import {useSale} from '../../hooks/sale/useSale';
import {useCustomer} from '../../hooks/customer/useCustomer';
import {useProduct} from '../../hooks/product/useProduct';
import {formStyles} from '../../styles/js/FormStyles';
import {Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import {Add, Delete} from '@mui/icons-material';
import {useSelector} from "react-redux";

export const SaleForm = ({saleSelected}) => {
    const {handleSaveSale, handleCancel, initialSaleForm} = useSale();
    const {customers, handleGetCustomers} = useCustomer();
    const {products, handleGetProducts} = useProduct();
    const {user} = useSelector(state => state.auth);
    const isEditMode = saleSelected && saleSelected.id !== 0;
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(initialSaleForm);
    const [saleDetails, setSaleDetails] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

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

    const calculateTotal = (details) => {
        return details.reduce((sum, detail) => sum + (detail.price * detail.quantity), 0);
    };

    const handleAddProduct = () => {
        if (!selectedProduct) {
            setErrors({...errors, product: 'Debe seleccionar un producto'});
            return;
        }

        if (quantity <= 0) {
            setErrors({...errors, quantity: 'La cantidad debe ser mayor a 0'});
            return;
        }

        const product = products.find(p => p.id === parseInt(selectedProduct));
        if (!product) return;

        const existingDetail = saleDetails.find(d => d.productId === product.id);

        let newDetails;
        if (existingDetail) {
            newDetails = saleDetails.map(d =>
                d.productId === product.id
                    ? {...d, quantity: d.quantity + quantity}
                    : d
            );
        } else {
            newDetails = [...saleDetails, {
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: quantity
            }];
        }

        setSaleDetails(newDetails);
        setFormData({...formData, total: calculateTotal(newDetails)});
        setSelectedProduct('');
        setQuantity(1);
        setErrors({...errors, product: '', quantity: ''});
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const saleData = {
                id: saleSelected?.id || 0,
                customerId: parseInt(formData.customerId),
                employeeId: formData.employeeId,
                saleDate: new Date().toISOString(),
                total: formData.total,
                saleDetails: saleDetails.map(detail => ({
                    productId: detail.productId,
                    quantity: detail.quantity,
                    price: detail.price
                }))
            };

            const success = await handleSaveSale(saleData);

            if (success) {
                setFormData(initialSaleForm);
                setSaleDetails([]);
                setErrors({});
                handleCancel();
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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-12 col-lg-10">
                    <div className="card shadow">
                        <div className="card-header" style={formStyles.cardHeader}>
                            <h5 className="card-title mb-4 fw-bold">
                                {isEditMode ? 'Editar Venta' : 'Registrar Nueva Venta'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="customerId" className="form-label">
                                            Cliente <span className="text-danger">*</span>
                                        </label>
                                        <select
                                            className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
                                            id="customerId"
                                            value={formData.customerId || ''}
                                            onChange={handleInputChange('customerId')}
                                            required
                                        >
                                            <option value="">Seleccione un cliente</option>
                                            {customers.map((customer) => (
                                                <option key={customer.id} value={customer.id}>
                                                    {customer.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.customerId && (
                                            <div className="invalid-feedback">
                                                {errors.customerId}
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="employeeName" className="form-label">
                                            Empleado
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="employeeName"
                                            value={user || ''}
                                            disabled
                                        />
                                    </div>

                                    <div className="col-12">
                                        <hr className="my-4"/>
                                        <h6 className="fw-bold mb-3">Productos</h6>

                                        <div className="row g-3 mb-3">
                                            <div className="col-md-6">
                                                <label htmlFor="product" className="form-label">
                                                    Producto
                                                </label>
                                                <select
                                                    className={`form-select ${errors.product ? 'is-invalid' : ''}`}
                                                    id="product"
                                                    value={selectedProduct}
                                                    onChange={(e) => setSelectedProduct(e.target.value)}
                                                >
                                                    <option value="">Seleccione un producto</option>
                                                    {products.filter(p => p.active).map((product) => (
                                                        <option key={product.id} value={product.id}>
                                                            {product.name} - {formatCurrency(product.price)}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.product && (
                                                    <div className="invalid-feedback">
                                                        {errors.product}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label htmlFor="quantity" className="form-label">
                                                    Cantidad
                                                </label>
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                                    id="quantity"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                                    min="1"
                                                />
                                                {errors.quantity && (
                                                    <div className="invalid-feedback">
                                                        {errors.quantity}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-2 d-flex align-items-end">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    startIcon={<Add/>}
                                                    onClick={handleAddProduct}
                                                >
                                                    Agregar
                                                </Button>
                                            </div>
                                        </div>

                                        {errors.saleDetails && (
                                            <div className="alert alert-danger">
                                                {errors.saleDetails}
                                            </div>
                                        )}

                                        <TableContainer component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Producto</TableCell>
                                                        <TableCell align="right">Precio</TableCell>
                                                        <TableCell align="right">Cantidad</TableCell>
                                                        <TableCell align="right">Subtotal</TableCell>
                                                        <TableCell align="center">Acciones</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {saleDetails.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} align="center">
                                                                No hay productos agregados
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        saleDetails.map((detail) => (
                                                            <TableRow key={detail.productId}>
                                                                <TableCell>{detail.productName}</TableCell>
                                                                <TableCell align="right">{formatCurrency(detail.price)}</TableCell>
                                                                <TableCell align="right">{detail.quantity}</TableCell>
                                                                <TableCell align="right">
                                                                    {formatCurrency(detail.price * detail.quantity)}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <IconButton
                                                                        color="error"
                                                                        size="small"
                                                                        onClick={() => handleRemoveProduct(detail.productId)}
                                                                    >
                                                                        <Delete/>
                                                                    </IconButton>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                    {saleDetails.length > 0 && (
                                                        <TableRow>
                                                            <TableCell colSpan={3} align="right">
                                                                <strong>Total:</strong>
                                                            </TableCell>
                                                            <TableCell align="right">
                                                                <strong>{formatCurrency(formData.total)}</strong>
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </div>

                                    <div className="col-12">
                                        <div className="d-flex gap-2 justify-content-end mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                            >
                                                <i className="fas fa-save me-2"></i>
                                                {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
