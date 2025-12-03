import React from 'react';
import {
    Card, CardContent, Divider,
    Grid, TextField, Typography
} from '@mui/material';

export const SaleInfo = ({
                             user,
                             customers,
                             formData,
                             selectedCustomer,
                             paymentMethodId,
                             notes,
                             errors,
                             onInputChange,
                             onPaymentMethodChange,
                             onNotesChange
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
                    </Grid>

                    {selectedCustomer && (
                        <Grid item xs={12}>
                            <Divider/>
                            <Typography variant="body2" sx={{mt: 1}}>
                                {(selectedCustomer.customDiscount > 0) && (
                                    <>
                                        <strong>Descuento:</strong> {selectedCustomer.customDiscount}
                                    </>
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
        </>
    );
};
