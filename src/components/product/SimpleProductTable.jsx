import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Checkbox,
    Typography,
    IconButton,
    Card,
    CardContent,
    useMediaQuery,
    useTheme
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    ArrowBack as ArrowBackIcon,
    Search as SearchIcon
} from "@mui/icons-material";
import {useEffect} from "react";
import {useProductTableSimple} from "../../hooks/product/useProductTableSimple.js";
import {ConfirmDialog} from "./ConfirmDialog.jsx";


export const SimpleProductTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        handleGetProducts,
        handleBackClick,
        nameFilter,
        setNameFilter,
        selectedProducts,
        hasUnsavedChanges,
        modifiedProductsCount,
        shouldShowSaveButton,
        handleAutoSaveChanges,
        isLoading,
        filteredProducts,
        handleSelectAll,
        handleSelectProduct,
        editingProducts,
        priceChanges,
        handlePriceChange,
        handleSaveSinglePrice,
        handleCancelEdit,
        handleEditPrice,
        showConfirmDialog,
        handleCancelBack,
        handleConfirmBack
    } = useProductTableSimple();

    useEffect(() => {
        handleGetProducts();
    }, []);

    // Mobile card view for each product
    const renderMobileCard = (product) => (
        <Card key={product.id} sx={{ mb: 2, boxShadow: 2 }}>
            <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                            checked={selectedProducts.has(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                            size="small"
                        />
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {product.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: {product.id}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        {editingProducts.has(product.id) ? (
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleSaveSinglePrice(product.id)}
                                >
                                    <SaveIcon fontSize="small"/>
                                </IconButton>
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleCancelEdit(product.id)}
                                >
                                    <CancelIcon fontSize="small"/>
                                </IconButton>
                            </Box>
                        ) : (
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditPrice(product.id)}
                            >
                                <EditIcon fontSize="small"/>
                            </IconButton>
                        )}
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, px: 1 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Precio Actual
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                            ${product.price.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">
                            Nuevo Precio
                        </Typography>
                        {editingProducts.has(product.id) ? (
                            <TextField
                                type="number"
                                size="small"
                                value={priceChanges[product.id] || ''}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                inputMode="decimal"
                                slotProps={{
                                    htmlInput: { min: 0, style: { textAlign: 'right' } }
                                }}
                                sx={{ width: 100 }}
                                autoFocus
                            />
                        ) : (
                            <Typography variant="body1" fontWeight="medium" color="primary.main">
                                ${(priceChanges[product.id] || product.price).toFixed(2)}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Box sx={{
            width: '100%',
            px: { xs: 1, sm: 2, md: 0 },
            pt: { xs: 2, md: 0 }
        }}>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBackClick}
                    sx={{ mb: 1 }}
                    size={isMobile ? "small" : "medium"}
                >
                    {isMobile ? "Regresar" : "Regresar a Productos"}
                </Button>
            </Box>

            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ mb: 2, fontWeight: 'bold' }}>
                Modificación de Precios
            </Typography>

            <Box sx={{ mb: 2 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar por nombre"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    slotProps={{
                        input: {
                            startAdornment: <SearchIcon/>
                        }
                    }}
                    sx={{ width: { xs: '100%', sm: 300 } }}
                    fullWidth={isMobile}
                />
            </Box>

            <Box sx={{
                mb: 2,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' }
            }}>
                <Box sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    width: { xs: '100%', sm: 'auto' },
                    justifyContent: { xs: 'space-between', sm: 'flex-start' }
                }}>
                    <Typography variant="body2">
                        {selectedProducts.size} productos seleccionados
                    </Typography>

                    {hasUnsavedChanges && (
                        <Typography variant="body2" color="warning.main">
                            {modifiedProductsCount} cambios sin guardar
                        </Typography>
                    )}
                </Box>

                {shouldShowSaveButton && (
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={handleAutoSaveChanges}
                        disabled={isLoading}
                        sx={{ ml: { xs: 0, sm: 'auto' }, width: { xs: '100%', sm: 'auto' } }}
                        fullWidth={isMobile}
                    >
                        Guardar Todos ({modifiedProductsCount})
                    </Button>
                )}
            </Box>

            {/* Mobile: Card Layout */}
            {isMobile ? (
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
                        <Checkbox
                            indeterminate={selectedProducts.size > 0 && selectedProducts.size < filteredProducts.length}
                            checked={filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length}
                            onChange={handleSelectAll}
                            size="small"
                        />
                        <Typography variant="body2" color="text.secondary">
                            Seleccionar todos
                        </Typography>
                    </Box>
                    {filteredProducts.map(renderMobileCard)}
                </Box>
            ) : (
                /* Desktop: Table Layout */
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="price modification table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selectedProducts.size > 0 && selectedProducts.size < filteredProducts.length}
                                        checked={filteredProducts.length > 0 && selectedProducts.size === filteredProducts.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell align="right">Precio Actual</TableCell>
                                <TableCell align="right">Nuevo Precio</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredProducts.map((product) => (
                                <TableRow
                                    key={product.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={selectedProducts.has(product.id)}
                                            onChange={() => handleSelectProduct(product.id)}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {product.id}
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell align="right">
                                        ${product.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell align="right">
                                        {editingProducts.has(product.id) ? (
                                            <TextField
                                                type="number"
                                                size="small"
                                                value={priceChanges[product.id] || ''}
                                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                                inputMode="decimal"
                                                slotProps={{
                                                    htmlInput: { min: 0 }
                                                }}
                                                sx={{ width: 100 }}
                                            />
                                        ) : (
                                            `$${(priceChanges[product.id] || product.price).toFixed(2)}`
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        {editingProducts.has(product.id) ? (
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleSaveSinglePrice(product.id)}
                                                >
                                                    <SaveIcon/>
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleCancelEdit(product.id)}
                                                >
                                                    <CancelIcon/>
                                                </IconButton>
                                            </Box>
                                        ) : (
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEditPrice(product.id)}
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ConfirmDialog showConfirmDialog={showConfirmDialog} handleCancelBack={handleCancelBack}
                           handleConfirmBack={handleConfirmBack} modifiedProductsCount={modifiedProductsCount}/>
        </Box>
    );
}