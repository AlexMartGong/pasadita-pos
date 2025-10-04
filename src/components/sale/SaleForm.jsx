import React, {useEffect, useState} from 'react';
import {useSale} from '../../hooks/sale/useSale';
import {useCustomer} from '../../hooks/customer/useCustomer';
import {useProduct} from '../../hooks/product/useProduct';
import {
    Box, Button, Card, CardContent, Grid, IconButton, Paper,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Typography, Divider
} from '@mui/material';
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
    const [productSearch, setProductSearch] = useState('');
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

    const calculateTotal = (details) => {
        return details.reduce((sum, detail) => sum + (detail.price * detail.quantity), 0);
    };

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
        setSelectedProductData({
            id: product.id,
            name: product.name,
            quantity: product.unitMeasure === 'kg' ? '' : '1',
            price: product.price,
            total: product.unitMeasure === 'kg' ? 0 : product.price
        });
    };

    // Agregar producto al carrito
    const handleAddToCart = () => {
        if (!selectedProductData.id || !selectedProductData.quantity || selectedProductData.quantity <= 0) {
            setErrors({...errors, cart: 'Complete todos los campos del producto'});
            return;
        }

        const existingDetail = saleDetails.find(d => d.productId === selectedProductData.id);

        let newDetails;
        if (existingDetail) {
            newDetails = saleDetails.map(d =>
                d.productId === selectedProductData.id
                    ? {...d, quantity: parseFloat(d.quantity) + parseFloat(selectedProductData.quantity)}
                    : d
            );
        } else {
            newDetails = [...saleDetails, {
                productId: selectedProductData.id,
                productName: selectedProductData.name,
                price: parseFloat(selectedProductData.price),
                quantity: parseFloat(selectedProductData.quantity)
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

    // Filtrar productos por búsqueda
    const filteredProducts = products.filter(p =>
        p.active &&
        (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.id.toString().includes(productSearch))
    );

    // Obtener información del cliente seleccionado
    const selectedCustomer = customers.find(c => c.id === parseInt(formData.customerId));

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
        <Box sx={{flexGrow: 1, p: 2, height: 'calc(100vh - 100px)'}}>
            <form onSubmit={handleSubmit} noValidate style={{height: '100%'}}>
                <Grid container spacing={2} sx={{height: '100%'}}>
                    {/* Columna Izquierda - Lista de Productos */}
                    <Grid item xs={12} md={6} sx={{height: '100%'}}>
                        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 1}}>
                                <Typography variant="h6" gutterBottom>
                                    Lista de Productos
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Buscar producto"
                                    value={productSearch}
                                    onChange={(e) => setProductSearch(e.target.value)}
                                    sx={{mb: 2}}
                                />
                                <TableContainer sx={{flexGrow: 1, overflow: 'auto'}}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Producto</TableCell>
                                                <TableCell align="right">Precio</TableCell>
                                                <TableCell align="center">Acción</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {filteredProducts.map((product) => (
                                                <TableRow key={product.id} hover>
                                                    <TableCell>{product.id}</TableCell>
                                                    <TableCell>{product.name}</TableCell>
                                                    <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleSelectProduct(product)}
                                                        >
                                                            <Add/>
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Columna Derecha */}
                    <Grid item xs={12} md={6} sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, height: '100%'}}>
                            {/* Panel Superior - Info Venta */}
                            <Card>
                                <CardContent sx={{pb: 2}}>
                                    <Typography variant="h6" gutterBottom>
                                        Información de Venta
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Cajero"
                                                value={user || ''}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <select
                                                className={`form-select ${errors.customerId ? 'is-invalid' : ''}`}
                                                value={formData.customerId || ''}
                                                onChange={handleInputChange('customerId')}
                                            >
                                                <option value="">Seleccione un cliente</option>
                                                {customers.map((customer) => (
                                                    <option key={customer.id} value={customer.id}>
                                                        {customer.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.customerId && (
                                                <div className="text-danger small">
                                                    {errors.customerId}
                                                </div>
                                            )}
                                        </Grid>
                                        {selectedCustomer && (
                                            <Grid item xs={12}>
                                                <Divider/>
                                                <Typography variant="body2" sx={{mt: 1}}>
                                                    <strong>Cliente:</strong> {selectedCustomer.name} (ID: {selectedCustomer.id})
                                                    {(selectedCustomer.customerType?.discountPercentage || selectedCustomer.customDiscount) && (
                                                        <> | <strong>Descuento:</strong> {selectedCustomer.customerType?.discountPercentage || selectedCustomer.customDiscount}%</>
                                                    )}
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Panel Central - Agregar Producto */}
                            <Card>
                                <CardContent sx={{pb: 2}}>
                                    <Typography variant="h6" gutterBottom>
                                        Agregar Producto
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6} sm={3}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="ID"
                                                value={selectedProductData.id}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={6} sm={9}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Nombre"
                                                value={selectedProductData.name}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                label="Cantidad"
                                                value={selectedProductData.quantity}
                                                onChange={(e) => setSelectedProductData({
                                                    ...selectedProductData,
                                                    quantity: e.target.value
                                                })}
                                                inputProps={{step: '0.01', min: '0'}}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="number"
                                                label="Precio"
                                                value={selectedProductData.price}
                                                onChange={(e) => setSelectedProductData({
                                                    ...selectedProductData,
                                                    price: e.target.value
                                                })}
                                                inputProps={{step: '0.01', min: '0'}}
                                            />
                                        </Grid>
                                        <Grid item xs={4}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Total"
                                                value={formatCurrency(selectedProductData.total)}
                                                disabled
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                startIcon={<Add/>}
                                                onClick={handleAddToCart}
                                                disabled={!selectedProductData.id}
                                            >
                                                Agregar
                                            </Button>
                                            {errors.cart && (
                                                <Typography color="error" variant="caption" sx={{mt: 1, display: 'block'}}>
                                                    {errors.cart}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>

                            {/* Panel Inferior - Carrito */}
                            <Card sx={{flexGrow: 1, display: 'flex', flexDirection: 'column'}}>
                                <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 2}}>
                                    <Typography variant="h6" gutterBottom>
                                        Carrito de Compras
                                    </Typography>
                                    <TableContainer sx={{flexGrow: 1, overflow: 'auto', mb: 2}}>
                                        <Table size="small" stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Producto</TableCell>
                                                    <TableCell align="right">Cantidad</TableCell>
                                                    <TableCell align="right">Total</TableCell>
                                                    <TableCell align="center">Acción</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {saleDetails.length === 0 ? (
                                                    <TableRow>
                                                        <TableCell colSpan={4} align="center">
                                                            No hay productos en el carrito
                                                        </TableCell>
                                                    </TableRow>
                                                ) : (
                                                    saleDetails.map((detail) => (
                                                        <TableRow key={detail.productId}>
                                                            <TableCell>{detail.productName}</TableCell>
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
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                    <Box>
                                        {saleDetails.length > 0 && (
                                            <Box sx={{mb: 2, textAlign: 'right'}}>
                                                <Typography variant="h6">
                                                    Total: {formatCurrency(formData.total)}
                                                </Typography>
                                            </Box>
                                        )}
                                        {errors.saleDetails && (
                                            <Typography color="error" variant="body2" sx={{mb: 2}}>
                                                {errors.saleDetails}
                                            </Typography>
                                        )}
                                        <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                                            <Button
                                                variant="outlined"
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={isSubmitting}
                                            >
                                                {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar Venta')}
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
};
