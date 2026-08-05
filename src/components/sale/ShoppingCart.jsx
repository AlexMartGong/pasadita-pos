import React, {useState} from 'react';
import {
    Box, Button, Card, IconButton,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography
} from '@mui/material';
import {Delete, PointOfSale, ShoppingCartOutlined} from '@mui/icons-material';
import {PaymentModal} from './PaymentModal';
import {formatQuantity, toNumber} from '../../utils/formatters';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

export const ShoppingCart = ({
                                 saleDetails,
                                 formData,
                                 isEditMode,
                                 isSubmitting,
                                 errors,
                                 amountTendered,
                                 onAmountTenderedChange,
                                 onRemoveProduct,
                                 onCancel,
                                 onValidate,
                                 onSaveSale,
                                 formatCurrency,
                                 paymentMethodId,
                                 requiresInvoice,
                                 onRequiresInvoiceChange,
                                 selectedFiscalId,
                                 onSelectedFiscalIdChange,
                                 fiscalList,
                             }) => {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);

    const handleCancelClick = () => {
        if (saleDetails.length > 0) {
            setConfirmOpen(true);
        } else {
            onCancel();
        }
    };

    const handleConfirmCancel = () => {
        setConfirmOpen(false);
        onCancel();
    };

    const subtotal = saleDetails.reduce((sum, d) => sum + toNumber(d.subtotal), 0);
    const totalDiscount = saleDetails.reduce((sum, d) => sum + toNumber(d.discount), 0);

    return (
        <Card sx={saleFormStyles.cartCard}>
            <Box sx={{
                background: 'linear-gradient(135deg, #283593 0%, #5c6bc0 100%)',
                px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', gap: 1,
                flexShrink: 0
            }}>
                <ShoppingCartOutlined sx={{color: 'white', fontSize: 22}}/>
                <Typography variant="h6" sx={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>
                    Ticket Actual
                </Typography>
            </Box>

            {/* Lista del carrito: scroll interno */}
            <Box sx={saleFormStyles.cartScroll}>
                <TableContainer>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow sx={{'& .MuiTableCell-head': {backgroundColor: '#e8eaf6', color: '#283593', fontWeight: 600}}}>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Cant.</TableCell>
                                <TableCell align="right">P. Unit.</TableCell>
                                <TableCell align="right">Desc.</TableCell>
                                <TableCell align="right">Total</TableCell>
                                <TableCell align="center">Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {saleDetails.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography variant="body2" color="text.secondary" sx={{py: 2}}>
                                            Haz clic en un producto del catálogo para agregar
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                saleDetails.map((detail) => (
                                    <TableRow key={detail.productId}>
                                        <TableCell>{detail.productName}</TableCell>
                                        <TableCell align="right">{formatQuantity(detail.quantity)}</TableCell>
                                        <TableCell align="right">{formatCurrency(detail.unitPrice)}</TableCell>
                                        <TableCell align="right">{formatCurrency(detail.discount)}</TableCell>
                                        <TableCell align="right">{formatCurrency(detail.total)}</TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => onRemoveProduct(detail.productId)}
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
            </Box>

            {/* Footer pinneado: totales + acciones (siempre visibles) */}
            <Box sx={saleFormStyles.ticketFooter}>
                {saleDetails.length > 0 && (
                    <Box sx={saleFormStyles.totalsBox}>
                        <Typography variant="body2" sx={{color: 'text.secondary'}}>
                            Subtotal: {formatCurrency(subtotal)}
                        </Typography>
                        <Typography variant="body2" color="error">
                            Descuento: -{formatCurrency(totalDiscount)}
                        </Typography>
                        <Typography variant="h6" sx={{color: '#283593', fontWeight: 700}}>
                            Total: {formatCurrency(formData.total)}
                        </Typography>
                    </Box>
                )}

                {errors.saleDetails && (
                    <Typography color="error" variant="body2" sx={{mb: 1}}>
                        {errors.saleDetails}
                    </Typography>
                )}
                {errors.customerId && (
                    <Typography color="error" variant="body2" sx={{mb: 1}}>
                        {errors.customerId}
                    </Typography>
                )}

                <Box sx={{display: 'flex', gap: 1.5}}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        onClick={handleCancelClick}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<PointOfSale/>}
                        disabled={isSubmitting}
                        onClick={() => {
                            if (onValidate()) {
                                setPaymentOpen(true);
                            }
                        }}
                    >
                        {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Cobrar Venta')}
                    </Button>
                </Box>
            </Box>

            <PaymentModal
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                total={formData.total}
                amountTendered={amountTendered}
                onAmountTenderedChange={onAmountTenderedChange}
                onSaveSale={(amount) => {
                    setPaymentOpen(false);
                    onSaveSale(amount);
                }}
                isSubmitting={isSubmitting}
                isEditMode={isEditMode}
                formatCurrency={formatCurrency}
                paymentMethodId={paymentMethodId}
                requiresInvoice={requiresInvoice}
                onRequiresInvoiceChange={onRequiresInvoiceChange}
                selectedFiscalId={selectedFiscalId}
                onSelectedFiscalIdChange={onSelectedFiscalIdChange}
                fiscalList={fiscalList}
            />

            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>¿Cancelar la venta?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Se perderán todos los productos del carrito. ¿Deseas continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Volver</Button>
                    <Button onClick={handleConfirmCancel} color="error" variant="contained">
                        Cancelar venta
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};
