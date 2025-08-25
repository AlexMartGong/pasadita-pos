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
    IconButton
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

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{mb: 2}}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon/>}
                    onClick={handleBackClick}
                    sx={{mb: 1}}
                >
                    Regresar a Productos
                </Button>
            </Box>

            <Typography variant="h6" sx={{mb: 2}}>
                Modificación de Precios
            </Typography>

            <Box sx={{mb: 2}}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Buscar por nombre"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <SearchIcon/>
                        ),
                    }}
                    sx={{width: 300}}
                />
            </Box>

            <Box sx={{mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center'}}>
                <Typography variant="body2">
                    {selectedProducts.size} productos seleccionados
                </Typography>

                {hasUnsavedChanges && (
                    <Typography variant="body2" color="warning.main">
                        {modifiedProductsCount} cambios sin guardar
                    </Typography>
                )}

                {shouldShowSaveButton && (
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={handleAutoSaveChanges}
                        disabled={isLoading}
                        sx={{ml: 'auto'}}
                    >
                        Guardar Todos los Cambios ({modifiedProductsCount})
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="price modification table">
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
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
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
                                            inputProps={{step: "0.01", min: "0"}}
                                            sx={{width: 100}}
                                        />
                                    ) : (
                                        `$${(priceChanges[product.id] || product.price).toFixed(2)}`
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {editingProducts.has(product.id) ? (
                                        <Box sx={{display: 'flex', gap: 1}}>
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
            <ConfirmDialog showConfirmDialog={showConfirmDialog} handleCancelBack={handleCancelBack}
                           handleConfirmBack={handleConfirmBack} modifiedProductsCount={modifiedProductsCount}/>
        </Box>
    );
}