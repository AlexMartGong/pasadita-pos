import {useState, useMemo, useEffect} from "react";
import {userTableStyles} from "../../styles/js/UserTable.js";
import {useUser} from "./useUser.js";
import {Box, Chip, IconButton, Tooltip} from "@mui/material";
import {Edit, ToggleOn, ToggleOff, Password} from "@mui/icons-material";

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
    const {handleToggleStatus, handleEditRow, handleEditPassword} = useUser();

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

    const columns = useMemo(() => [
        {
            field: "id",
            headerName: "ID",
            width: 90,
        },
        {
            field: "fullName",
            headerName: "Nombre",
            width: 300,
            sortable: true,
        },
        {
            field: "username",
            headerName: "Usuario",
            width: 150,
            sortable: true,
        },
        {
            field: "position",
            headerName: "Rol",
            width: 150,
            sortable: true,
        },
        {
            field: "phone",
            headerName: "Teléfono",
            width: 150,
        },
        {
            field: "active",
            headerName: "Estado",
            width: 100,
            sortable: true,
            renderCell: (params) => (
                <Chip
                    label={params.row.active ? "Activo" : "Inactivo"}
                    color={params.row.active ? "success" : "default"}
                    variant="outlined"
                    size="small"
                />
            ),
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 400,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={userTableStyles.actionsContainer}>
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditRow(params.row.id)}>
                            <Edit/> Editar
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.active ? "Desactivar" : "Activar"}>
                        <IconButton
                            size="small"
                            color={params.row.active ? "success" : "default"}
                            onClick={() => handleToggleStatus(params.row.id, params.row.active)}>
                            {params.row.active ? <ToggleOn/> : <ToggleOff/>} Estado
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar contraseña">
                        <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleEditPassword(params.row.id)}>
                            <Password/> Editar contraseña
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleEditRow, handleToggleStatus, handleEditPassword]);

    return {
        searchText,
        setSearchText,
        filteredUsers,
        columns,
    };
};
