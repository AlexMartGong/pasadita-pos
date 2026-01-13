import React, {useState, useEffect} from 'react';
import {
    Card, CardContent, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, TextField, Typography, TablePagination
} from '@mui/material';
import {Add} from '@mui/icons-material';

export const ProductsTable = ({
                                  products,
                                  productSearch,
                                  onProductSearchChange,
                                  onSelectProduct,
                                  formatCurrency
                              }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Resetear página cuando cambia la búsqueda
    useEffect(() => {
        setPage(0);
    }, [productSearch]);

    const filteredProducts = products.filter(p =>
        p.active &&
        (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.id.toString().includes(productSearch))
    );

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calcular productos paginados
    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
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
                                <TableCell align="center">Medida</TableCell>
                                <TableCell align="center">Acción</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedProducts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography variant="body2" color="text.secondary" sx={{py: 3}}>
                                            {productSearch
                                                ? 'No se encontraron productos con ese criterio de búsqueda'
                                                : 'No hay productos disponibles'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedProducts.map((product) => (
                                    <TableRow key={product.id} hover>
                                        <TableCell>{product.id}</TableCell>
                                        <TableCell>{product.name}</TableCell>
                                        <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                                        <TableCell align="center">{product.unitMeasure}</TableCell>
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
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={filteredProducts.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({from, to, count}) =>
                        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                />
            </CardContent>
        </Card>
    );
};
