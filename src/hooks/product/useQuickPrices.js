import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {toast} from "react-toastify";
import {useProduct} from "./useProduct.js";

// Valor del filtro de categoría que no filtra nada.
export const ALL_CATEGORIES = 'ALL';

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
 * no añade API/Service/Slice nuevos. Expone buscador con debounce de 300ms, filtro por
 * categoría, la lista filtrada y un guardado por tarjeta validado.
 */
export const useQuickPrices = () => {
    const {products, handleGetProducts, handleUpdatePriceProduct} = useProduct();
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
    const debouncedSearch = useDebounce(searchText, 300);

    const filteredProducts = useMemo(() => {
        const term = debouncedSearch.trim().toLowerCase();
        if (!term && selectedCategory === ALL_CATEGORIES) return products;
        return products.filter(product =>
            (selectedCategory === ALL_CATEGORIES || product.category === selectedCategory) &&
            (!term ||
                product.name?.toLowerCase().includes(term) ||
                product.id.toString().includes(term))
        );
    }, [products, debouncedSearch, selectedCategory]);

    // handleUpdatePriceProduct cambia de identidad en cada render (depende de useApiErrorHandler,
    // que no es estable). Se guarda la última versión en un ref para que handleSavePrice no
    // cambie nunca y el React.memo de ProductPriceCard sea efectivo.
    const updatePriceRef = useRef(handleUpdatePriceProduct);
    useEffect(() => {
        updatePriceRef.current = handleUpdatePriceProduct;
    });

    const handleSavePrice = useCallback(async (id, price) => {
        const parsed = parseFloat(price);
        if (!parsed || parsed <= 0) {
            toast.error('El precio debe ser mayor a 0');
            return false;
        }
        return await updatePriceRef.current(id, parsed);
    }, []);

    return {
        handleGetProducts,
        searchText,
        setSearchText,
        debouncedSearch,
        selectedCategory,
        setSelectedCategory,
        filteredProducts,
        handleSavePrice,
    };
};
