import React, {useRef} from 'react';
import {Box, Card, CardContent, Grid, TextField, Typography} from '@mui/material';
import {Inventory2} from '@mui/icons-material';
import {ProductCard} from './ProductCard';
import {saleFormStyles} from '../../styles/js/SaleFormStyles';

// Catálogo de productos en formato de tarjetas (reemplaza la tabla anterior).
// Mantiene el mismo contrato de props y la misma cadena de selección que disparaba
// la tabla: al elegir un producto se limpia la búsqueda y se vuelve a enfocar el input.
export const ProductCatalog = ({
                                   products,
                                   productSearch,
                                   onProductSearchChange,
                                   onSelectProduct,
                                   formatCurrency
                               }) => {
    const searchInputRef = useRef(null);

    const filteredProducts = products.filter(p =>
        p.active &&
        (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.id.toString().includes(productSearch))
    );

    const handleSelect = (product) => {
        onSelectProduct(product);
        onProductSearchChange('');
        searchInputRef.current?.focus();
    };

    return (
        <Card sx={{...saleFormStyles.leftPanel, border: '1px solid rgba(25, 118, 210, 0.15)'}}>
            <Box sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                px: 2, py: 1.5,
                display: 'flex', alignItems: 'center', gap: 1
            }}>
                <Inventory2 sx={{color: 'white', fontSize: 22}}/>
                <Typography variant="h6" sx={{color: 'white', fontWeight: 600, fontSize: '1rem'}}>
                    Catálogo de Productos
                </Typography>
            </Box>

            <CardContent sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0, pb: 1}}>
                <TextField
                    fullWidth
                    size="small"
                    label="Buscar producto"
                    value={productSearch}
                    onChange={(e) => onProductSearchChange(e.target.value)}
                    inputRef={searchInputRef}
                    autoFocus
                    sx={{mb: 2}}
                />

                <Box sx={saleFormStyles.catalogGridScroll}>
                    {filteredProducts.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{py: 4, textAlign: 'center'}}>
                            {productSearch
                                ? 'No se encontraron productos con ese criterio de búsqueda'
                                : 'No hay productos disponibles'}
                        </Typography>
                    ) : (
                        <Grid container spacing={1.5}>
                            {filteredProducts.map((product) => (
                                <Grid key={product.id} size={{xs: 6, sm: 4, md: 3, lg: 2.4}}>
                                    <ProductCard
                                        product={product}
                                        onSelect={handleSelect}
                                        formatCurrency={formatCurrency}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};
