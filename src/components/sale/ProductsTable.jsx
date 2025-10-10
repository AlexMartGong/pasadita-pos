import React from 'react';
import {
    Card, CardContent, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Typography
} from '@mui/material';
import {Add} from '@mui/icons-material';

export const ProductsTable = ({
    products,
    productSearch,
    onProductSearchChange,
    onSelectProduct,
    formatCurrency
}) => {
    const filteredProducts = products.filter(p =>
        p.active &&
        (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.id.toString().includes(productSearch))
    );

    return (
        <Card sx={{height: '100%', display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', pb: 1}}>
                <Typography variant="h6" gutterBottom>
                    Lista de Productos
                </Typography>
                <TextField
                    fullWidth
                    size="small"
                    label="Buscar producto"
                    value={productSearch}
                    onChange={(e) => onProductSearchChange(e.target.value)}
                    sx={{mb: 2}}
                />
                <TableContainer sx={{flexGrow: 1, overflow: 'auto'}}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Producto</TableCell>
                                <TableCell align="right">Precio</TableCell>
                                <TableCell align="center">Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow key={product.id} hover>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => onSelectProduct(product)}
                                        >
                                            <Add/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};
