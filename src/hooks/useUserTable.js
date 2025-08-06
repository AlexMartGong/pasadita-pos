import {useState, useMemo, useEffect} from "react";

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

export const useUserTable = (users) => {
    const [searchText, setSearchText] = useState("");
    const debouncedSearchText = useDebounce(searchText, 300);

    const filteredUsers = useMemo(() => {
        if (!users || !debouncedSearchText) return users || [];

        const searchLower = debouncedSearchText.toLowerCase();
        return users.filter((user) => {
            return (
                user.fullName?.toLowerCase().includes(searchLower) ||
                user.phone?.toLowerCase().includes(searchLower)
            );
        });
    }, [users, debouncedSearchText]);

    return {
        searchText,
        setSearchText,
        filteredUsers,
    };
};
