import React, {useEffect, useRef} from 'react';
import {
    Box, Button, Divider,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Paper, Stack, Typography
} from '@mui/material';
import {Add} from '@mui/icons-material';
import {QuantityInput} from './QuantityInput';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

export const AddProductForm = ({
                                   open,
                                   onClose,
                                   selectedProductData,
                                   errors,
                                   onSelectedProductChange,
                                   onAddToCart,
                                   formatCurrency
                               }) => {
    const quantityInputRef = useRef(null);

    // Al abrir el diálogo: enfoca y preselecciona la cantidad para que el
    // cajero pueda teclear el nuevo valor directamente (sin borrar el actual).
    // El retardo aguarda la animación de entrada del Dialog.
    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => {
            const input = quantityInputRef.current;
            if (input) {
                input.focus();
                input.select();
            }
        }, 120);
        return () => clearTimeout(timer);
    }, [open]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={saleFormStyles.dialogTitle}>
                <Add/>
                Agregar al carrito
            </DialogTitle>

            <DialogContent sx={saleFormStyles.dialogContent}>
                <Stack spacing={2.5}>
                    <Paper variant="outlined" sx={saleFormStyles.productSummary}>
                        <Typography variant="h6" sx={{fontWeight: 700, lineHeight: 1.2}}>
                            {selectedProductData.name}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{...saleFormStyles.amount, color: 'text.secondary', mt: 0.5, whiteSpace: 'normal'}}
                        >
                            Precio unitario: {formatCurrency(selectedProductData.price)}
                            {selectedProductData.unitMeasure ? ` / ${selectedProductData.unitMeasure.toLowerCase()}` : ''}
                        </Typography>
                        {selectedProductData.discount > 0 && (
                            <Typography variant="caption" sx={saleFormStyles.productSummaryDiscount}>
                                Desc. unitario: −{formatCurrency(selectedProductData.discount)}
                                {' '}(precio normal {formatCurrency(selectedProductData.originalPrice)})
                            </Typography>
                        )}
                    </Paper>

                    <QuantityInput
                        value={selectedProductData.quantity}
                        onChange={(value) => onSelectedProductChange({quantity: value})}
                        unitMeasure={selectedProductData.unitMeasure}
                        productId={selectedProductData.id}
                        inputRef={quantityInputRef}
                    />

                    <Divider/>

                    <Box sx={saleFormStyles.totalHighlight}>
                        <Typography variant="overline" sx={{color: 'text.secondary', letterSpacing: 1}}>
                            Total
                        </Typography>
                        <Typography variant="h3" sx={saleFormStyles.totalHighlightAmount}>
                            {formatCurrency(selectedProductData.total)}
                        </Typography>
                    </Box>

                    {errors.cart && (
                        <Typography variant="caption" sx={{display: 'block', color: 'error.main'}}>
                            {errors.cart}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={saleFormStyles.dialogActions}>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="inherit"
                    sx={{...saleFormStyles.touchButton, px: 3}}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<Add/>}
                    onClick={onAddToCart}
                    disabled={!selectedProductData.id}
                    sx={{...saleFormStyles.touchButton, px: 3, fontWeight: 700}}
                >
                    Agregar al carrito
                </Button>
            </DialogActions>
        </Dialog>
    );
};
