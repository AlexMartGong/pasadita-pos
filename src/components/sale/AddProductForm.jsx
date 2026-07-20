import React from 'react';
import {
    Box, Button, Divider,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Paper, Stack, Typography
} from '@mui/material';
import {Add} from '@mui/icons-material';
import {QuantityInput} from './QuantityInput';

export const AddProductForm = ({
                                   open,
                                   onClose,
                                   selectedProductData,
                                   errors,
                                   onSelectedProductChange,
                                   onAddToCart,
                                   formatCurrency
                               }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                color: 'white', fontWeight: 600
            }}>
                Agregar al carrito
            </DialogTitle>

            <DialogContent sx={{pt: 3, pb: 2, mt: 3}}>
                <Stack spacing={3}>
                    <Paper
                        variant="outlined"
                        sx={{p: 2, borderRadius: 2,bgcolor: '#f8fafc'}}
                    >
                        <Typography variant="h6" sx={{fontWeight: 700, lineHeight: 1.2}}>
                            {selectedProductData.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{mt: 0.5}}>
                            Precio unitario: {formatCurrency(selectedProductData.price)}
                            {selectedProductData.unitMeasure ? ` / ${selectedProductData.unitMeasure.toLowerCase()}` : ''}
                        </Typography>
                        {selectedProductData.discount > 0 && (
                            <Typography variant="caption" color="error" sx={{display: 'block', mt: 0.5}}>
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
                    />

                    <Divider/>

                    <Box sx={{
                        textAlign: 'center',
                        py: 2,
                        borderRadius: 2,
                        bgcolor: '#e8f5e9',
                        border: '1px solid',
                        borderColor: 'success.light'
                    }}>
                        <Typography variant="overline" color="text.secondary" sx={{letterSpacing: 1}}>
                            Total
                        </Typography>
                        <Typography variant="h3" sx={{fontWeight: 700, color: 'success.main', lineHeight: 1.1}}>
                            {formatCurrency(selectedProductData.total)}
                        </Typography>
                    </Box>

                    {errors.cart && (
                        <Typography color="error" variant="caption" sx={{display: 'block'}}>
                            {errors.cart}
                        </Typography>
                    )}
                </Stack>
            </DialogContent>

            <DialogActions sx={{px: 3, pb: 2, gap: 1}}>
                <Button onClick={onClose} variant="outlined" size="large">
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<Add/>}
                    onClick={onAddToCart}
                    disabled={!selectedProductData.id}
                >
                    Agregar al carrito
                </Button>
            </DialogActions>
        </Dialog>
    );
};
