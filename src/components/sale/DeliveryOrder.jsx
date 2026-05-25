import React from 'react';
import {
    Box, Card, CardContent, Grid, TextField, Typography
} from '@mui/material';
import {LocalShipping} from '@mui/icons-material';

export const DeliveryOrder = ({selectedCustomer}) => {
    const deliveryAddress = selectedCustomer?.address || '';
    const contactPhone = selectedCustomer?.phone || '';

    return (
        <Card sx={{flexShrink: 0, border: '1px solid rgba(230, 126, 34, 0.15)'}}>
            <Box sx={{
                background: 'linear-gradient(135deg, #e65100 0%, #fb8c00 100%)',
                px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', gap: 1
            }}>
                <LocalShipping sx={{color: 'white', fontSize: 22}}/>
                <Typography variant="h6" sx={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>
                    Datos para el Pedido
                </Typography>
            </Box>
            <CardContent sx={{pb: 2}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} size={{xs: 12}}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Dirección de Entrega"
                            value={deliveryAddress}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} size={{xs: 12}}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Teléfono de Contacto"
                            value={contactPhone}
                            disabled
                        />
                    </Grid>
                    {/*<Grid item xs={12} sm={6} size={{xs: 12}}>*/}
                    {/*    <TextField*/}
                    {/*        fullWidth*/}
                    {/*        size="small"*/}
                    {/*        label="Costo de Entrega"*/}
                    {/*        type="number"*/}
                    {/*        value={deliveryCost}*/}
                    {/*        onChange={(e) => onDeliveryCostChange(parseFloat(e.target.value) || 0)}*/}
                    {/*        slotProps={{*/}
                    {/*            htmlInput: {*/}
                    {/*                step: '0.1',*/}
                    {/*                min: '0'*/}
                    {/*            }*/}
                    {/*        }}*/}
                    {/*    />*/}
                    {/*</Grid>*/}
                </Grid>
            </CardContent>
        </Card>
    );
};
