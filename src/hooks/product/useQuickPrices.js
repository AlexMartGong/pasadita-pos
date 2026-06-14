import {useCallback, useEffect, useMemo, useState} from "react";
import {toast} from "react-toastify";
import {useProduct} from "./useProduct.js";

// Debounce local (mismo patrón que el useDebounce privado de useProductTable.jsx).
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

/**
 * Hook de la vista "Precios Rápidos".
 * Reusa la capa de datos existente de useProduct (servicio + slice + useApiErrorHandler):
 * no añade API/Service/Slice nuevos. Expone buscador con debounce de 300ms,
 * la lista filtrada y un guardado por tarjeta validado.
 */
export const useQuickPrices = () => {
    const {products, handleGetProducts, handleUpdatePriceProduct} = useProduct();
    const [searchText, setSearchText] = useState("");
    const debouncedSearch = useDebounce(searchText, 300);

    const filteredProducts = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();
        if (!term) return products;
        return products.filter(product =>
            product.name?.toLowerCase().includes(term) ||
            product.id.toString().includes(term)
        );
    }, [products, debouncedSearch]);

    // Callback estable → mantiene efectivo el React.memo de ProductPriceCard.
    const handleSavePrice = useCallback(async (id, price) => {
        const parsed = parseFloat(price);
        if (!parsed || parsed <= 0) {
            toast.error('El precio debe ser mayor a 0');
            return false;
        }
        return await handleUpdatePriceProduct(id, parsed);
    }, [handleUpdatePriceProduct]);

    return {
        handleGetProducts,
        searchText,
        setSearchText,
        debouncedSearch,
        filteredProducts,
        handleSavePrice,
    };
};
