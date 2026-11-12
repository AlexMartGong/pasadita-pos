import {useEffect, useRef, useState} from 'react';
import {
    Box, Chip, Grid, IconButton, InputAdornment, Pagination, Paper, TextField, Typography
} from '@mui/material';
import {Close, Search} from '@mui/icons-material';
import {ALL_CATEGORIES, useQuickPrices} from '../../hooks/product/useQuickPrices.js';
import {ProductPriceCard} from './ProductPriceCard.jsx';
import {CATEGORY_OPTIONS, categoryColor, saleFormStyles} from '../../styles/js/SaleFormStyles.js';
import {quickPricesStyles} from '../../styles/js/QuickPricesStyles.js';

const ITEMS_PER_PAGE = 24;

export const ProductPriceEditor = () => {
    const {
        handleGetProducts,
        searchText,
        setSearchText,
        debouncedSearch,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        handleSavePrice,
    } = useQuickPrices();

    const [page, setPage] = useState(1);
    const searchInputRef = useRef(null);

    useEffect(() => {
        handleGetProducts();
    }, []);

    // Vuelve a la primera página al cambiar la búsqueda (ya debounced) o la categoría.
    // Ajuste de estado durante el render, sin efecto.
    const filterKey = `${selectedCategory}|${debouncedSearch}`;
    const [appliedFilterKey, setAppliedFilterKey] = useState(filterKey);
    if (appliedFilterKey !== filterKey) {
        setAppliedFilterKey(filterKey);
        setPage(1);
    }

    const productCount = filteredProducts.length;
    const pageCount = Math.ceil(productCount / ITEMS_PER_PAGE);
    const pageProducts = filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    const handleClearSearch = () => {
        setSearchText('');
        searchInputRef.current?.focus();
    };

    const isFiltering = Boolean(searchText) || selectedCategory !== ALL_CATEGORIES;

    return (
        <Box sx={quickPricesStyles.page}>
            <Paper
                component="section"
                variant="outlined"
                aria-label="Precios rápidos"
                sx={saleFormStyles.leftPanel}
            >
                <Box sx={saleFormStyles.catalogToolbar}>
                    <TextField
                        label="Buscar por nombre o ID"
                        color="success"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        inputRef={searchInputRef}
                        sx={saleFormStyles.searchInput}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search/>
                                    </InputAdornment>
                                ),
                                endAdornment: searchText ? (
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

                    <Box role="group" aria-label="Filtrar por categoría" sx={quickPricesStyles.categoryChips}>
                        <Chip
                            label="Todos"
                            variant="outlined"
                            onClick={() => setSelectedCategory(ALL_CATEGORIES)}
                            aria-pressed={selectedCategory === ALL_CATEGORIES}
                            sx={saleFormStyles.categoryChip(selectedCategory === ALL_CATEGORIES)}
                        />
                        {CATEGORY_OPTIONS.map((option) => {
                            const selected = selectedCategory === option.value;
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
                                    onClick={() => setSelectedCategory(option.value)}
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
                                <Grid key={product.id} size={{xs: 12, sm: 6, md: 3, lg: 2, xl: 2}}>
                                    <ProductPriceCard product={product} onSave={handleSavePrice}/>
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
        </Box>
    );
};
