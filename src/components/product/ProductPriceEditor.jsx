import {useEffect, useState} from 'react';
import {Box, Grid, Pagination, TextField, Typography} from '@mui/material';
import {PriceChange, Search as SearchIcon} from '@mui/icons-material';
import {useQuickPrices} from '../../hooks/product/useQuickPrices.js';
import {ProductPriceCard} from './ProductPriceCard.jsx';
import {quickPricesStyles} from '../../styles/js/QuickPricesStyles.js';

const ITEMS_PER_PAGE = 24;

export const ProductPriceEditor = () => {
    const {
        handleGetProducts,
        searchText,
        setSearchText,
        debouncedSearch,
        filteredProducts,
        handleSavePrice,
    } = useQuickPrices();

    const [page, setPage] = useState(1);

    useEffect(() => {
        handleGetProducts();
    }, []);

    // Reinicia la paginación cuando cambia el término de búsqueda (ya debounced).
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch]);

    const pageCount = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const pageProducts = filteredProducts.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    return (
        <Box sx={quickPricesStyles.page}>
            <Box sx={quickPricesStyles.header}>
                <Box sx={quickPricesStyles.headerIconWrap}>
                    <PriceChange/>
                </Box>
                <Box>
                    <Typography variant="h5" sx={{fontWeight: 700}}>
                        Precios Rápidos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {filteredProducts.length} producto{filteredProducts.length === 1 ? '' : 's'}
                    </Typography>
                </Box>
            </Box>

            <Box sx={quickPricesStyles.searchBox}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Buscar por nombre o ID"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon sx={{mr: 1, color: 'text.secondary'}}/>,
                        },
                    }}
                />
            </Box>

            {filteredProducts.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={quickPricesStyles.empty}>
                    {searchText
                        ? 'No se encontraron productos con ese criterio de búsqueda.'
                        : 'No hay productos disponibles.'}
                </Typography>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {pageProducts.map((product) => (
                            <Grid key={product.id} size={{xs: 12, sm: 6, md: 4, lg: 3}}>
                                <ProductPriceCard product={product} onSave={handleSavePrice}/>
                            </Grid>
                        ))}
                    </Grid>

                    {pageCount > 1 && (
                        <Box sx={quickPricesStyles.pagination}>
                            <Pagination
                                count={pageCount}
                                page={page}
                                onChange={(_, value) => setPage(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};
