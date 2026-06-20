import React from 'react';
import {
    Box, Card, CardContent, Chip, Divider,
    FormControl, FormHelperText, Grid, IconButton, InputLabel,
    MenuItem, Select, TextField, Tooltip, Typography
} from '@mui/material';
import {Person, PointOfSale, ReceiptLong} from '@mui/icons-material';

const PAYMENT_METHODS = [
    {value: 1, label: 'Efectivo'},
    {value: 2, label: 'Transferencia'},
    {value: 3, label: 'Tarjeta de Crédito'},
    {value: 4, label: 'Tarjeta de Débito'},
];

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
                             onNotesChange,
                             canOpenDrawer,
                             onOpenDrawer
                         }) => {
    return (
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
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <Chip
                        icon={<Person fontSize="small"/>}
                        label={user || ''}
                        size="small"
                        sx={{backgroundColor: 'rgba(255,255,255,0.9)', fontWeight: 500}}
                    />
                    {canOpenDrawer && (
                        <Tooltip title="Abrir Caja">
                            <IconButton
                                onClick={onOpenDrawer}
                                aria-label="Abrir caja"
                                size="small"
                                sx={{
                                    width: 44,
                                    height: 44,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    color: '#2e7d32',
                                    '&:hover': {backgroundColor: '#ffffff'}
                                }}
                            >
                                <PointOfSale fontSize="small"/>
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
            <CardContent sx={{pb: 2}}>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12}}>
                        <FormControl fullWidth size="small" error={Boolean(errors.customerId)}>
                            <InputLabel id="customer-select-label">Cliente</InputLabel>
                            <Select
                                labelId="customer-select-label"
                                id="customer-select"
                                variant="outlined"
                                label="Cliente"
                                value={formData.customerId || ''}
                                onChange={onInputChange('customerId')}
                            >
                                <MenuItem value="">
                                    <em>Seleccione un cliente</em>
                                </MenuItem>
                                {customers.map((customer) => (
                                    <MenuItem key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.customerId && (
                                <FormHelperText>{errors.customerId}</FormHelperText>
                            )}
                        </FormControl>
                    </Grid>

                    <Grid size={{xs: 12}}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="payment-method-label">Método de pago</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                id="payment-method-select"
                                variant="outlined"
                                label="Método de pago"
                                value={paymentMethodId}
                                onChange={(e) => onPaymentMethodChange(parseInt(e.target.value))}
                            >
                                {PAYMENT_METHODS.map((method) => (
                                    <MenuItem key={method.value} value={method.value}>
                                        {method.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {selectedCustomer && selectedCustomer.customDiscount > 0 && (
                    <Box sx={{mt: 1.5}}>
                        <Divider/>
                        <Typography variant="body2" sx={{mt: 1}}>
                            <strong>Descuento:</strong> {selectedCustomer.customDiscount}
                        </Typography>
                    </Box>
                )}

                <Box sx={{mt: 2}}>
                    <TextField
                        fullWidth
                        size="small"
                        label="Notas (opcional)"
                        value={notes}
                        onChange={(e) => onNotesChange(e.target.value)}
                        multiline
                        rows={2}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};
