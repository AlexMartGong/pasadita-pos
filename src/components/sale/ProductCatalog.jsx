import React, {useCallback, useEffect, useState} from 'react';
import {
    Box, Chip, Grid, IconButton, InputAdornment, Pagination, Paper, TextField, Typography
} from '@mui/material';
import {Close, Search} from '@mui/icons-material';
import {ProductCard} from './ProductCard';
import {CATEGORY_OPTIONS, categoryColor, saleFormStyles} from '../../styles/js/SaleFormStyles';

const ITEMS_PER_PAGE = 24;
const ALL_CATEGORIES = 'ALL';

export const ProductCatalog = ({
                                   products,
                                   productSearch,
                                   onProductSearchChange,
                                   onSelectProduct,
                                   formatCurrency,
                                   searchInputRef
                               }) => {
    const [page, setPage] = useState(1);
    // Filtro rápido por categoría: estado puramente visual, local al catálogo.
    const [category, setCategory] = useState(ALL_CATEGORIES);

    const filteredProducts = products.filter(p =>
        p.active &&
        (category === ALL_CATEGORIES || p.category === category) &&
        (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.id.toString().includes(productSearch))
    );

    // Vuelve a la primera página al cambiar el texto de búsqueda o la categoría.
    useEffect(() => {
        setPage(1);
    }, [productSearch, category]);

    const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const pageProducts = filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleSelect = useCallback((product) => {
        onSelectProduct(product);
        onProductSearchChange('');
        searchInputRef?.current?.focus();
    }, [onSelectProduct, onProductSearchChange, searchInputRef]);

    const handleClearSearch = () => {
        onProductSearchChange('');
        searchInputRef?.current?.focus();
    };

    const isFiltering = Boolean(productSearch) || category !== ALL_CATEGORIES;
    const productCount = filteredProducts.length;

    return (
        <Paper
            component="section"
            variant="outlined"
            aria-label="Catálogo de productos"
            sx={saleFormStyles.leftPanel}
        >
            <Box sx={saleFormStyles.catalogToolbar}>
                <TextField
                    label="Buscar producto"
                    placeholder="Nombre o código"
                    color="success"
                    value={productSearch}
                    onChange={(e) => onProductSearchChange(e.target.value)}
                    inputRef={searchInputRef}
                    autoFocus
                    sx={saleFormStyles.searchInput}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            ),
                            endAdornment: productSearch ? (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="Limpiar búsqueda"
                                        onClick={handleClearSearch}
                                        sx={saleFormStyles.fieldIconButton}
                                    >
                                        <Close/>
                                    </IconButton>
                                </InputAdornment>
                            ) : null,
                        },
                    }}
                />

                <Box role="group" aria-label="Filtrar por categoría" sx={saleFormStyles.categoryChips}>
                    <Chip
                        label="Todos"
                        variant="outlined"
                        onClick={() => setCategory(ALL_CATEGORIES)}
                        aria-pressed={category === ALL_CATEGORIES}
                        sx={saleFormStyles.categoryChip(category === ALL_CATEGORIES)}
                    />
                    {CATEGORY_OPTIONS.map((option) => {
                        const selected = category === option.value;
                        return (
                            <Chip
                                key={option.value}
                                label={option.label}
                                variant="outlined"
                                icon={
                                    <Box
                                        component="span"
                                        sx={{
                                            ...saleFormStyles.categoryChipDot(selected),
                                            backgroundColor: categoryColor(option.value),
                                        }}
                                    />
                                }
                                onClick={() => setCategory(option.value)}
                                aria-pressed={selected}
                                sx={saleFormStyles.categoryChip(selected)}
                            />
                        );
                    })}
                </Box>
            </Box>

            <Box sx={saleFormStyles.catalogGridScroll}>
                {productCount === 0 ? (
                    <Typography variant="body2" sx={saleFormStyles.catalogEmpty}>
                        {isFiltering
                            ? 'No se encontraron productos con ese criterio de búsqueda'
                            : 'No hay productos disponibles'}
                    </Typography>
                ) : (
                    <Grid container spacing={1.5}>
                        {pageProducts.map((product) => (
                            <Grid key={product.id} size={{xs: 6, sm: 4, md: 3, lg: 3, xl: 2}}>
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

            <Box sx={saleFormStyles.catalogFooter}>
                <Typography variant="body2" sx={saleFormStyles.catalogCount}>
                    {productCount} {productCount === 1 ? 'producto' : 'productos'}
                </Typography>
                {pageCount > 1 && (
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        sx={saleFormStyles.paginationTouch}
                    />
                )}
            </Box>
        </Paper>
    );
};
