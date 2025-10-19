import React from 'react';
import {
    Card, CardContent, Grid, TextField, Typography
} from '@mui/material';

export const DeliveryOrder = ({selectedCustomer, deliveryCost, onDeliveryCostChange}) => {
    const deliveryAddress = selectedCustomer?.address || '';
    const contactPhone = selectedCustomer?.phone || '';

    return (
        <Card sx={{flexShrink: 0}}>
            <CardContent sx={{pb: 2}}>
                <Typography variant="h6" gutterBottom>
                    Datos para el Pedido
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Dirección de Entrega"
                            value={deliveryAddress}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Teléfono de Contacto"
                            value={contactPhone}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Costo de Entrega"
                            type="number"
                            value={deliveryCost}
                            onChange={(e) => onDeliveryCostChange(parseFloat(e.target.value) || 0)}
                            inputProps={{min: 0, step: "0.01"}}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
