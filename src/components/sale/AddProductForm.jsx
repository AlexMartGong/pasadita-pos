import React from 'react';
import {
    Button,
    Card, CardContent,
    Grid, TextField, Typography
} from '@mui/material';
import {Add} from '@mui/icons-material';

export const AddProductForm = ({
    selectedProductData,
    errors,
    onSelectedProductChange,
    onAddToCart,
    formatCurrency
}) => {
    return (
        <Card sx={{flexShrink: 0}}>
            <CardContent sx={{pb: 2}}>
                <Typography variant="h6" gutterBottom>
                    Agregar Producto
                </Typography>
                <Grid container spacing={2} sx={{mb: 2}}>
                    <Grid item xs={6} sm={3}>
                        <TextField
                            fullWidth
                            size="small"
                            label="ID"
                            value={selectedProductData.id}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6} sm={9}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Nombre"
                            value={selectedProductData.name}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            size="small"
                            type="number"
                            label="Cantidad"
                            value={selectedProductData.quantity}
                            onChange={(e) => onSelectedProductChange({
                                ...selectedProductData,
                                quantity: e.target.value
                            })}
                            inputProps={{step: '0.1', min: '0'}}
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
                            inputProps={{step: '0.1', min: '0'}}
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
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        startIcon={<Add/>}
                        onClick={onAddToCart}
                        disabled={!selectedProductData.id}
                    >
                        Agregar
                    </Button>
                    {errors.cart && (
                        <Typography color="error" variant="caption"
                                    sx={{mt: 1, display: 'block'}}>
                            {errors.cart}
                        </Typography>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};
