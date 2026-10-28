import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {
    Alert, Box, Button, Card, CardContent, Grid, LinearProgress, TextField, Typography
} from '@mui/material';
import {LocalShipping} from '@mui/icons-material';
import {CustomerCreditChip} from '../customerAccount/CustomerCreditChip.jsx';

// Crédito del cliente para pedidos a domicilio nuevos (6.2). Público en general no maneja crédito.
const CreditStatus = ({customerId, credit, creditLoading, creditReached, creditBlocked, creditWarning, isAdmin}) => {
    if (creditLoading && !credit) {
        return <LinearProgress aria-label="Consultando crédito del cliente"/>;
    }
    if (!credit) return null;

    const showsChip = credit.debt > 0 || credit.creditLimit > 0;

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
            {showsChip && (
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap'}}>
                    <CustomerCreditChip debt={credit.debt} creditLimit={credit.creditLimit}/>
                    <Button component={RouterLink} to={`/customers/${customerId}/account`} size="small"
                            sx={{textTransform: 'none', fontWeight: 600}}>
                        Ver cuenta
                    </Button>
                </Box>
            )}
            {creditBlocked && (
                <Alert severity="error">
                    Este cliente ya alcanzó su límite de crédito. Requiere autorización del administrador.
                </Alert>
            )}
            {creditReached && isAdmin && (
                <Alert severity="warning">
                    Este cliente ya alcanzó su límite de crédito. Al guardar el pedido lo autorizas como administrador.
                </Alert>
            )}
            {creditWarning && (
                <Alert severity="warning">Si no paga este pedido, rebasará su límite.</Alert>
            )}
        </Box>
    );
};

export const DeliveryOrder = ({
                                  selectedCustomer,
                                  credit,
                                  creditLoading,
                                  creditReached,
                                  creditBlocked,
                                  creditWarning,
                                  isAdmin,
                              }) => {
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
                    <Grid size={{xs: 12}}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Dirección de Entrega"
                            value={deliveryAddress}
                            disabled
                        />
                    </Grid>
                    <Grid size={{xs: 12}}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Teléfono de Contacto"
                            value={contactPhone}
                            disabled
                        />
                    </Grid>
                    {/*<Grid size={{xs: 12}}>*/}
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
                    {selectedCustomer && !selectedCustomer.walkIn && (
                        <Grid size={{xs: 12}}>
                            <CreditStatus
                                customerId={selectedCustomer.id}
                                credit={credit}
                                creditLoading={creditLoading}
                                creditReached={creditReached}
                                creditBlocked={creditBlocked}
                                creditWarning={creditWarning}
                                isAdmin={isAdmin}
                            />
                        </Grid>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};
