import {useProduct} from "./useProduct.js";
import {useState, useMemo} from "react";
import {toast} from "react-toastify";

export const useProductTableSimple = () => {
    const {products, handleGetProducts, handleUpdatePriceProduct, handleCancel} = useProduct();
    const [editingProducts, setEditingProducts] = useState(new Set());
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [priceChanges, setPriceChanges] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [nameFilter, setNameFilter] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const filteredProducts = useMemo(() => {
        if (!nameFilter.trim()) {
            return products;
        }
        return products.filter(product =>
            product.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
    }, [products, nameFilter]);

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

    const hasUnsavedChanges = useMemo(() => {
        return Object.keys(priceChanges).some(productId => {
            const product = products.find(p => p.id === parseInt(productId));
            return product && priceChanges[productId] !== product.price;
        });
    }, [priceChanges, products]);

    const modifiedProductsCount = useMemo(() => {
        return Object.keys(priceChanges).filter(productId => {
            const product = products.find(p => p.id === parseInt(productId));
            return product && priceChanges[productId] !== product.price && priceChanges[productId] > 0;
        }).length;
    }, [priceChanges, products]);

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
            const clearedChanges = {...priceChanges};
            modifiedProducts.forEach(productId => {
                delete clearedChanges[productId];
            });
            setPriceChanges(clearedChanges);
            setEditingProducts(new Set());
        }
    };

    return {
        handleBackClick,
        handleAutoSaveChanges,
        handleSelectAll,
        handleSelectProduct,
        handlePriceChange,
        handleSaveSinglePrice,
        handleCancelEdit,
        handleEditPrice,
        handleCancelBack,
        handleConfirmBack,
        handleGetProducts,
        nameFilter,
        setNameFilter,
        selectedProducts,
        hasUnsavedChanges,
        modifiedProductsCount,
        shouldShowSaveButton,
        isLoading,
        filteredProducts,
        editingProducts,
        priceChanges,
        showConfirmDialog,
    }

}