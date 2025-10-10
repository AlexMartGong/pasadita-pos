import React from 'react';
import {
    Box, Button, Card, CardContent, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Typography
} from '@mui/material';
import {Delete} from '@mui/icons-material';

export const ShoppingCart = ({
    saleDetails,
    formData,
    isEditMode,
    isSubmitting,
    errors,
    onRemoveProduct,
    onCancel,
    formatCurrency
}) => {
    return (
        <Card sx={{flexShrink: 0}}>
            <CardContent sx={{pb: 2}}>
                <Typography variant="h6" gutterBottom>
                    Carrito de Compras
                </Typography>
                <TableContainer sx={{
                    overflow: 'auto',
                    mb: 2,
                    maxHeight: '250px'
                }}>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
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
                                        No hay productos en el carrito
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
                        <Box sx={{mb: 2, textAlign: 'right'}}>
                            <Typography variant="body2">
                                Subtotal: {formatCurrency(saleDetails.reduce((sum, d) => sum + d.subtotal, 0))}
                            </Typography>
                            <Typography variant="body2" color="error">
                                Descuento:
                                -{formatCurrency(saleDetails.reduce((sum, d) => sum + d.discount, 0))}
                            </Typography>
                            <Typography variant="h6">
                                Total: {formatCurrency(formData.total)}
                            </Typography>
                        </Box>
                    )}
                    {errors.saleDetails && (
                        <Typography color="error" variant="body2" sx={{mb: 2}}>
                            {errors.saleDetails}
                        </Typography>
                    )}
                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
                        <Button
                            variant="outlined"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar' : 'Guardar Venta')}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
