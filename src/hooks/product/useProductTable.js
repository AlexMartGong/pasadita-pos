import {useEffect, useMemo, useState} from "react";

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const useProductTable = (products) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);

    const filteredProducts = useMemo(() => {
        if (!products || !debouncedSearchText) return products || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return products.filter((user) => {
            return (
                user.fullName?.toLowerCase().includes(searchLower) ||
                user.phone?.toLowerCase().includes(searchLower)
            );
        });
    }, [products, debouncedSearchText]);

    return {
        searchText,
        setSearchText,
        filteredProducts,
    }

};
