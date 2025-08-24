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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from "@mui/material";
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    ArrowBack as ArrowBackIcon,
    Search as SearchIcon
} from "@mui/icons-material";
import {useState, useEffect, useMemo} from "react";
import {useProduct} from "../../hooks/product/useProduct.js";
import {toast} from "react-toastify";

export const SimpleProductTable = () => {
    const {products, handleGetProducts, handleUpdatePriceProduct, handleCancel} = useProduct();
    const [editingProducts, setEditingProducts] = useState(new Set());
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [priceChanges, setPriceChanges] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Filter products by name
    const filteredProducts = useMemo(() => {
        if (!nameFilter.trim()) {
            return products;
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
    }, [products, nameFilter]);

    useEffect(() => {
        handleGetProducts();
    }, []);

    const handleSelectProduct = (productId) => {
        const newSelected = new Set(selectedProducts);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedProducts(newSelected);
    };

    const handleSelectAll = () => {
        if (selectedProducts.size === filteredProducts.length) {
            setSelectedProducts(new Set());
        } else {
            setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const handleEditPrice = (productId) => {
        const newEditing = new Set(editingProducts);
        newEditing.add(productId);
        setEditingProducts(newEditing);

        // Initialize price change with current price
        const product = products.find(p => p.id === productId);
        setPriceChanges(prev => ({
            ...prev,
            [productId]: product.price
        }));
    };

    const handleCancelEdit = (productId) => {
        const newEditing = new Set(editingProducts);
        newEditing.delete(productId);
        setEditingProducts(newEditing);

        // Remove price change
        const newPriceChanges = {...priceChanges};
        delete newPriceChanges[productId];
        setPriceChanges(newPriceChanges);
    };

    const handlePriceChange = (productId, newPrice) => {
        setPriceChanges(prev => ({
            ...prev,
            [productId]: parseFloat(newPrice) || 0
        }));
    };

    const handleSaveSinglePrice = async (productId) => {
        const newPrice = priceChanges[productId];

        if (newPrice <= 0) {
            toast.error('El precio debe ser mayor a 0');
            return;
        }

        const success = await handleUpdatePriceProduct(productId, newPrice);
        if (success) {
            handleCancelEdit(productId);
        }
    };

    const handleBulkPriceUpdate = async () => {
        if (selectedProducts.size === 0) {
            toast.error('Selecciona al menos un producto');
            return;
        }

        setIsLoading(true);
        let successCount = 0;

        for (const productId of selectedProducts) {
            const newPrice = priceChanges[productId];

            if (newPrice && newPrice > 0) {
                const success = await handleUpdatePriceProduct(productId, newPrice);
                if (success) {
                    successCount++;
                }
            }
        }

        setIsLoading(false);

        if (successCount > 0) {
            toast.success(`${successCount} precios actualizados exitosamente`);
            setSelectedProducts(new Set());
            setEditingProducts(new Set());
            setPriceChanges({});
        }
    };

    const applyBulkPriceChange = (percentage) => {
        const newPriceChanges = {...priceChanges};

        selectedProducts.forEach(productId => {
            const product = products.find(p => p.id === productId);
            const newPrice = product.price * (1 + percentage / 100);
            newPriceChanges[productId] = Math.round(newPrice * 100) / 100; // Round to 2 decimals
        });

        setPriceChanges(newPriceChanges);
        setEditingProducts(new Set(selectedProducts));
    };

    // Check if there are unsaved changes
    const hasUnsavedChanges = useMemo(() => {
        return Object.keys(priceChanges).some(productId => {
            const product = products.find(p => p.id === parseInt(productId));
            return product && priceChanges[productId] !== product.price;
        });
    }, [priceChanges, products]);

    // Count modified products
    const modifiedProductsCount = useMemo(() => {
        return Object.keys(priceChanges).filter(productId => {
            const product = products.find(p => p.id === parseInt(productId));
            return product && priceChanges[productId] !== product.price && priceChanges[productId] > 0;
        }).length;
    }, [priceChanges, products]);

    // Auto-enable save button when more than 2 modifications
    const shouldShowSaveButton = modifiedProductsCount >= 2;

    const handleBackClick = () => {
        if (hasUnsavedChanges) {
            setShowConfirmDialog(true);
        } else {
            handleCancel();
        }
    };

    const handleConfirmBack = () => {
        setShowConfirmDialog(false);
        handleCancel();
    };

    const handleCancelBack = () => {
        setShowConfirmDialog(false);
    };

    const handleAutoSaveChanges = async () => {
        const modifiedProducts = Object.keys(priceChanges).filter(productId => {
            const product = products.find(p => p.id === parseInt(productId));
            return product && priceChanges[productId] !== product.price && priceChanges[productId] > 0;
        });

        if (modifiedProducts.length === 0) {
            toast.error('No hay cambios válidos para guardar');
            return;
        }

        setIsLoading(true);
        let successCount = 0;

        for (const productId of modifiedProducts) {
            const newPrice = priceChanges[productId];
            const success = await handleUpdatePriceProduct(parseInt(productId), newPrice);
            if (success) {
                successCount++;
            }
        }

        setIsLoading(false);

        if (successCount > 0) {
            toast.success(`${successCount} precios actualizados exitosamente`);
            // Clear the changes after successful save
            const clearedChanges = {...priceChanges};
            modifiedProducts.forEach(productId => {
                delete clearedChanges[productId];
            });
            setPriceChanges(clearedChanges);
            setEditingProducts(new Set());
        }
    };

    return (
        <Box sx={{width: '100%'}}>
            {/* Back button */}
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

            {/* Search bar */}
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

            {/* Bulk actions */}
            <Box sx={{mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center'}}>
                <Typography variant="body2">
                    {selectedProducts.size} productos seleccionados
                </Typography>

                {hasUnsavedChanges && (
                    <Typography variant="body2" color="warning.main">
                        {modifiedProductsCount} cambios sin guardar
                    </Typography>
                )}

                {selectedProducts.size > 0 && (
                    <>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => applyBulkPriceChange(10)}
                        >
                            +10%
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => applyBulkPriceChange(-10)}
                        >
                            -10%
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={() => applyBulkPriceChange(20)}
                        >
                            +20%
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleBulkPriceUpdate}
                            disabled={isLoading}
                        >
                            Guardar Cambios
                        </Button>
                    </>
                )}

                {/* Auto-save button when 2+ modifications */}
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

            {/* Confirmation Dialog */}
            <Dialog
                open={showConfirmDialog}
                onClose={handleCancelBack}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title">
                    Cambios sin guardar
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-dialog-description">
                        Tienes {modifiedProductsCount} cambios sin guardar. ¿Estás seguro de que quieres salir sin
                        guardar los cambios?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelBack} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmBack} color="error" autoFocus>
                        Salir sin guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}