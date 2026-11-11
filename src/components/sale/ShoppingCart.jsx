import React, {useState} from 'react';
import {
    Box, Button, IconButton,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography
} from '@mui/material';
import {Delete, PointOfSale, ShoppingCartOutlined} from '@mui/icons-material';
import {PaymentModal} from './PaymentModal';
import {formatQuantity, toNumber} from '../../utils/formatters';
import {saleFormStyles, unitLabel} from '../../styles/js/SaleFormStyles';

// Unidades por producto (`{[productId]: unitMeasure}`): los detalles del carrito no la traen.
const NO_PRODUCT_UNITS = {};

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
                                 saveBlocked = false,
                                 productUnits = NO_PRODUCT_UNITS,
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
    const itemCount = saleDetails.length;

    return (
        <Box component="section" aria-label="Ticket actual" sx={saleFormStyles.cartSection}>
            <Box sx={saleFormStyles.cartHeader}>
                <Typography component="h2" sx={saleFormStyles.sectionLabel}>
                    Ticket actual
                </Typography>
                <Typography variant="caption" sx={saleFormStyles.cartCount}>
                    {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
                </Typography>
            </Box>

            {/* Lista del carrito: scroll interno con encabezado pegajoso */}
            <TableContainer sx={saleFormStyles.cartScroll}>
                <Table stickyHeader sx={saleFormStyles.cartTable}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Producto</TableCell>
                            <TableCell align="right" sx={saleFormStyles.cartQuantityColumn}>Cant.</TableCell>
                            <TableCell align="right" sx={saleFormStyles.cartTotalColumn}>Total</TableCell>
                            <TableCell align="center" sx={saleFormStyles.cartActionColumn}>Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {saleDetails.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Box sx={saleFormStyles.cartEmpty}>
                                        <ShoppingCartOutlined/>
                                        <Typography variant="body2">
                                            Toca un producto del catálogo para agregarlo
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            saleDetails.map((detail) => (
                                <TableRow key={detail.productId}>
                                    <TableCell>
                                        <Typography variant="body2" sx={saleFormStyles.cartProductName}>
                                            {detail.productName}
                                        </Typography>
                                        <Box sx={saleFormStyles.cartProductMeta}>
                                            <span>
                                                {formatCurrency(detail.unitPrice)} / {unitLabel(productUnits[detail.productId])}
                                            </span>
                                            {toNumber(detail.discount) > 0 && (
                                                <Box component="span" sx={saleFormStyles.discountTag}>
                                                    Desc. −{formatCurrency(detail.discount)}
                                                </Box>
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right" sx={saleFormStyles.cartQuantity}>
                                        {formatQuantity(detail.quantity)}
                                    </TableCell>
                                    <TableCell align="right" sx={saleFormStyles.cartLineTotal}>
                                        {formatCurrency(detail.total)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="error"
                                            size="medium"
                                            aria-label={`Eliminar ${detail.productName}`}
                                            onClick={() => onRemoveProduct(detail.productId)}
                                            sx={saleFormStyles.deleteButton}
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

            {/* Footer pinneado: totales + acciones (siempre visibles) */}
            <Box sx={saleFormStyles.ticketFooter}>
                {saleDetails.length > 0 && (
                    <Box sx={saleFormStyles.totalsBox}>
                        {/* El desglose solo aporta cuando hay descuento; sin él se muestra el total directo. */}
                        {totalDiscount > 0 && (
                            <>
                                <Box sx={saleFormStyles.totalsRow}>
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </Box>
                                <Box sx={{...saleFormStyles.totalsRow, ...saleFormStyles.totalsRowDiscount}}>
                                    <span>Descuento</span>
                                    <span>−{formatCurrency(totalDiscount)}</span>
                                </Box>
                            </>
                        )}
                        <Box sx={saleFormStyles.totalRow}>
                            <Typography component="span" sx={saleFormStyles.totalLabel}>
                                Total
                            </Typography>
                            <Typography component="span" sx={saleFormStyles.totalAmount}>
                                {formatCurrency(formData.total)}
                            </Typography>
                        </Box>
                    </Box>
                )}

                {errors.saleDetails && (
                    <Typography variant="body2" sx={saleFormStyles.cartError}>
                        {errors.saleDetails}
                    </Typography>
                )}
                {errors.customerId && (
                    <Typography variant="body2" sx={saleFormStyles.cartError}>
                        {errors.customerId}
                    </Typography>
                )}

                <Box sx={saleFormStyles.cartActions}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleCancelClick}
                        disabled={isSubmitting}
                        sx={{...saleFormStyles.touchButton, ...saleFormStyles.cartCancelButton}}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<PointOfSale/>}
                        disabled={isSubmitting || saveBlocked}
                        sx={{...saleFormStyles.touchButton, ...saleFormStyles.primaryAction}}
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
                <DialogActions sx={saleFormStyles.dialogActions}>
                    <Button onClick={() => setConfirmOpen(false)} sx={saleFormStyles.touchButton}>
                        Volver
                    </Button>
                    <Button
                        onClick={handleConfirmCancel}
                        color="error"
                        variant="contained"
                        sx={saleFormStyles.touchButton}
                    >
                        Cancelar venta
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
