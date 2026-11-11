import React, {useState} from 'react';
import {Link as RouterLink} from 'react-router-dom';
import {Alert, Box, Button, Collapse, IconButton, LinearProgress, Typography} from '@mui/material';
import {ExpandLess, ExpandMore, LocalShipping, Phone, Place} from '@mui/icons-material';
import {CustomerCreditChip} from '../customerAccount/CustomerCreditChip.jsx';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

// Crédito del cliente para pedidos a domicilio nuevos (6.2). Público en general no maneja crédito.
const CreditStatus = ({customerId, credit, creditLoading, creditReached, creditBlocked, creditWarning, isAdmin}) => {
    if (creditLoading && !credit) {
        return (
            <Box sx={saleFormStyles.deliveryCredit}>
                <LinearProgress color="warning" aria-label="Consultando crédito del cliente"/>
            </Box>
        );
    }
    if (!credit) return null;

    const showsChip = credit.debt > 0 || credit.creditLimit > 0;
    const showsAlert = creditBlocked || (creditReached && isAdmin) || creditWarning;
    if (!showsChip && !showsAlert) return null;

    return (
        <Box sx={saleFormStyles.deliveryCredit}>
            {showsChip && (
                <Box sx={saleFormStyles.creditRow}>
                    <CustomerCreditChip debt={credit.debt} creditLimit={credit.creditLimit}/>
                    <Button
                        component={RouterLink}
                        to={`/customers/${customerId}/account`}
                        size="small"
                        color="success"
                        sx={saleFormStyles.accountLink}
                    >
                        Ver cuenta
                    </Button>
                </Box>
            )}
            {creditBlocked && (
                <Alert severity="error" sx={saleFormStyles.compactAlert}>
                    Este cliente ya alcanzó su límite de crédito. Requiere autorización del administrador.
                </Alert>
            )}
            {creditReached && isAdmin && (
                <Alert severity="warning" sx={saleFormStyles.compactAlert}>
                    Este cliente ya alcanzó su límite de crédito. Al guardar el pedido lo autorizas como administrador.
                </Alert>
            )}
            {creditWarning && (
                <Alert severity="warning" sx={saleFormStyles.compactAlert}>
                    Si no paga este pedido, rebasará su límite.
                </Alert>
            )}
        </Box>
    );
};

// Datos del pedido a domicilio dentro del panel de ticket. La dirección y el teléfono (solo
// lectura, vienen del cliente) se pueden colapsar; el crédito del cliente queda siempre visible.
export const DeliveryOrder = ({
                                  selectedCustomer,
                                  credit,
                                  creditLoading,
                                  creditReached,
                                  creditBlocked,
                                  creditWarning,
                                  isAdmin,
                              }) => {
    const [detailsOpen, setDetailsOpen] = useState(true);

    const deliveryAddress = selectedCustomer?.address || '';
    const contactPhone = selectedCustomer?.phone || '';

    return (
        <Box component="section" aria-label="Datos para el pedido" sx={saleFormStyles.deliverySection}>
            <Box sx={saleFormStyles.deliveryHeader}>
                <LocalShipping sx={saleFormStyles.deliveryIcon}/>
                <Typography component="h2" sx={saleFormStyles.deliveryTitle}>
                    Entrega a domicilio
                    <Box component="span" sx={saleFormStyles.deliverySubtitle}>
                        Se creará pedido de entrega
                    </Box>
                </Typography>
                <IconButton
                    onClick={() => setDetailsOpen((open) => !open)}
                    aria-expanded={detailsOpen}
                    aria-controls="delivery-order-details"
                    aria-label={detailsOpen ? 'Ocultar datos de entrega' : 'Mostrar datos de entrega'}
                    sx={saleFormStyles.sectionToggle}
                >
                    {detailsOpen ? <ExpandLess/> : <ExpandMore/>}
                </IconButton>
            </Box>

            <Collapse in={detailsOpen} id="delivery-order-details">
                <Box sx={saleFormStyles.deliveryDetails}>
                    <Box sx={saleFormStyles.deliveryDetail}>
                        <Place titleAccess="Dirección de entrega"/>
                        <Typography
                            variant="body2"
                            sx={deliveryAddress ? undefined : saleFormStyles.deliveryDetailEmpty}
                        >
                            {deliveryAddress || 'Sin dirección registrada'}
                        </Typography>
                    </Box>
                    <Box sx={{...saleFormStyles.deliveryDetail, ...saleFormStyles.deliveryDetailPhone}}>
                        <Phone titleAccess="Teléfono de contacto"/>
                        <Typography
                            variant="body2"
                            sx={contactPhone ? undefined : saleFormStyles.deliveryDetailEmpty}
                        >
                            {contactPhone || 'Sin teléfono'}
                        </Typography>
                    </Box>
                    {/*<TextField*/}
                    {/*    fullWidth*/}
                    {/*    size="small"*/}
                    {/*    label="Costo de Entrega"*/}
                    {/*    type="number"*/}
                    {/*    value={deliveryCost}*/}
                    {/*    onChange={(e) => onDeliveryCostChange(parseFloat(e.target.value) || 0)}*/}
                    {/*    slotProps={{*/}
                    {/*        htmlInput: {*/}
                    {/*            step: '0.1',*/}
                    {/*            min: '0'*/}
                    {/*        }*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Box>
            </Collapse>

            {selectedCustomer && !selectedCustomer.walkIn && (
                <CreditStatus
                    customerId={selectedCustomer.id}
                    credit={credit}
                    creditLoading={creditLoading}
                    creditReached={creditReached}
                    creditBlocked={creditBlocked}
                    creditWarning={creditWarning}
                    isAdmin={isAdmin}
                />
            )}
        </Box>
    );
};
