import React from 'react';
import {
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Grid, TextField, Typography
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
            <DialogTitle>Agregar al carrito</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{mt: 0.5, mb: 2}}>
                    <Grid item xs={8}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Producto"
                            value={selectedProductData.name}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Precio"
                            value={selectedProductData.price}
                            onChange={(e) => onSelectedProductChange({
                                ...selectedProductData,
                                price: e.target.value
                            })}
                            slotProps={{
                                htmlInput: {
                                    step: '0.1',
                                    min: '0'
                                }
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <QuantityInput
                            value={selectedProductData.quantity}
                            onChange={(value) => onSelectedProductChange({quantity: value})}
                            unitMeasure={selectedProductData.unitMeasure}
                            productId={selectedProductData.id}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Total"
                            value={formatCurrency(selectedProductData.total)}
                            disabled
                        />
                    </Grid>
                </Grid>
                {errors.cart && (
                    <Typography color="error" variant="caption" sx={{mt: 1, display: 'block'}}>
                        {errors.cart}
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined">
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    color="primary"
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
