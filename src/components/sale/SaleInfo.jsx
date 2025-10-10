import React from 'react';
import {
    Button,
    Card, CardContent, Divider,
    Grid, TextField, Typography
} from '@mui/material';
import {Add} from '@mui/icons-material';

export const SaleInfo = ({
    user,
    customers,
    formData,
    selectedCustomer,
    paymentMethodId,
    paid,
    notes,
    selectedProductData,
    errors,
    onInputChange,
    onPaymentMethodChange,
    onPaidChange,
    onNotesChange,
    onSelectedProductChange,
    onAddToCart,
    formatCurrency
}) => {
    return (
        <>
            {/* Panel Superior - Info Venta */}
            <Card sx={{flexShrink: 0}}>
                <CardContent sx={{pb: 2}}>
                    <Typography variant="h6" gutterBottom>
                        Información de Venta
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid sm={6}>
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
                                onChange={onInputChange('customerId')}
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
                        <Grid item xs={12} sm={6}>
                            <select
                                className="form-select"
                                value={paymentMethodId}
                                onChange={(e) => onPaymentMethodChange(parseInt(e.target.value))}
                            >
                                <option value={1}>Efectivo</option>
                                <option value={2}>Tarjeta</option>
                                <option value={3}>Transferencia</option>
                            </select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <select
                                className="form-select"
                                value={paid}
                                onChange={(e) => onPaidChange(e.target.value === 'true')}
                            >
                                <option value={true}>Pagado</option>
                                <option value={false}>Pendiente</option>
                            </select>
                        </Grid>
                    </Grid>

                    {selectedCustomer && (
                        <Grid item xs={12}>
                            <Divider/>
                            <Typography variant="body2" sx={{mt: 1}}>
                                {(selectedCustomer.customerType?.discountPercentage || selectedCustomer.customDiscount) && (
                                    <>
                                        <strong>Descuento:</strong> {selectedCustomer.customerType?.discountPercentage || selectedCustomer.customDiscount}</>
                                )}
                            </Typography>
                        </Grid>
                    )}

                    <Grid item xs={12} sx={{mt: 2}}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Notas (opcional)"
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            multiline
                            rows={2}
                        />
                    </Grid>
                </CardContent>
            </Card>

            {/* Panel Central - Agregar Producto */}
            <Card sx={{flexShrink: 0}}>
                <CardContent sx={{pb: 2}}>
                    <Typography variant="h6" gutterBottom>
                        Agregar Producto
                    </Typography>
                    <Grid container spacing={2} sx={{mb: 2}}>
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
                                onChange={(e) => onSelectedProductChange({
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
                                onChange={(e) => onSelectedProductChange({
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
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            startIcon={<Add/>}
                            onClick={onAddToCart}
                            disabled={!selectedProductData.id}
                        >
                            Agregar
                        </Button>
                        {errors.cart && (
                            <Typography color="error" variant="caption"
                                        sx={{mt: 1, display: 'block'}}>
                                {errors.cart}
                            </Typography>
                        )}
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};
