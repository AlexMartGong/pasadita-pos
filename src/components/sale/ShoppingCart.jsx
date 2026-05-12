import React, {useState} from 'react';
import {
    Box, Button, Card, CardContent,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    IconButton, Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography
} from '@mui/material';
import {Delete, ShoppingCartOutlined} from '@mui/icons-material';
import {PaymentModal} from './PaymentModal';

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

    return (
        <Card sx={{flexShrink: 0, border: '1px solid rgba(48, 63, 159, 0.15)'}}>
            <Box sx={{
                background: 'linear-gradient(135deg, #283593 0%, #5c6bc0 100%)',
                px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', gap: 1
            }}>
                <ShoppingCartOutlined sx={{color: 'white', fontSize: 22}}/>
                <Typography variant="h6" sx={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>
                    Carrito de Compras
                </Typography>
            </Box>
            <CardContent sx={{pb: 2}}>
                <TableContainer sx={{
                    overflow: 'auto',
                    mb: 2,
                    maxHeight: '250px'
                }}>
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
                                        <Typography variant="body2" color="text.secondary" sx={{py: 1}}>
                                            Haz clic en "+" en la tabla de productos para agregar
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                saleDetails.map((detail) => (
                                    <TableRow key={detail.productId}>
                                        <TableCell>{detail.productName}</TableCell>
                                        <TableCell align="right">{detail.quantity}</TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(detail.unitPrice)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(detail.discount)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {formatCurrency(detail.total)}
                                        </TableCell>
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
                <Box>
                    {saleDetails.length > 0 && (
                        <Box sx={{mb: 2, textAlign: 'right', backgroundColor: '#f5f5f5', borderRadius: 1, p: 1.5}}>
                            <Typography variant="body2" sx={{color: 'text.secondary'}}>
                                Subtotal: {formatCurrency(saleDetails.reduce((sum, d) => sum + d.subtotal, 0))}
                            </Typography>
                            <Typography variant="body2" color="error">
                                Descuento:
                                -{formatCurrency(saleDetails.reduce((sum, d) => sum + d.discount, 0))}
                            </Typography>
                            <Typography variant="h6" sx={{color: '#283593', fontWeight: 700}}>
                                Total: {formatCurrency(formData.total)}
                            </Typography>
                        </Box>
                    )}
                    {errors.saleDetails && (
                        <Typography color="error" variant="body2" sx={{mb: 2}}>
                            {errors.saleDetails}
                        </Typography>
                    )}
                    {errors.customerId && (
                        <Typography color="error" variant="body2" sx={{mb: 2}}>
                            {errors.customerId}
                        </Typography>
                    )}
                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                        <Button
                            variant="outlined"
                            onClick={handleCancelClick}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                            onClick={() => {
                                if (onValidate()) {
                                    setPaymentOpen(true);
                                }
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar Venta')}
                        </Button>
                    </Box>
                </Box>
            </CardContent>

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
