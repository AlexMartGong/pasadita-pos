import React from 'react';
import {
    Box, Card, CardContent, Chip, Divider,
    Grid, TextField, Typography
} from '@mui/material';
import {Person, ReceiptLong} from '@mui/icons-material';

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
            <Card sx={{flexShrink: 0, border: '1px solid rgba(46, 125, 50, 0.15)'}}>
                <Box sx={{
                    background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                    px: 2, py: 1.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                        <ReceiptLong sx={{color: 'white', fontSize: 22}}/>
                        <Typography variant="h6" sx={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>
                            Información de Venta
                        </Typography>
                    </Box>
                    <Chip
                        icon={<Person fontSize="small"/>}
                        label={user || ''}
                        size="small"
                        sx={{backgroundColor: 'rgba(255,255,255,0.9)', fontWeight: 500}}
                    />
                </Box>
                <CardContent sx={{pb: 2}}>
                    <Grid container spacing={2}>
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
                                <option value={2}>Transferencia</option>
                                <option value={3}>Tarjeta de Crédito</option>
                                <option value={4}>Tarjeta de Débito</option>
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
