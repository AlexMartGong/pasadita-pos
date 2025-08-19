import {useEffect, useMemo} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {TextField, Box, Paper, IconButton, Tooltip, Chip} from "@mui/material";
import {Edit, ToggleOn, ToggleOff, Password} from "@mui/icons-material";
import {useUser} from "../../hooks/user/useUser.js";
import {useUserTable} from "../../hooks/user/useUserTable.js";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const UserTable = () => {
    const {users, getAllUsers, handleToggleStatus, handleEditRow, handleEditPassword} = useUser();
    const {searchText, setSearchText, filteredUsers} = useUserTable(users);

    useEffect(() => {
        getAllUsers();
    }, []);

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

    return (
        <Paper sx={userTableStyles.paper}>
            <Box sx={userTableStyles.searchContainer}>
                <TextField
                    fullWidth
                    label="Buscar usuarios..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={userTableStyles.tableContainer}>
                <DataGrid
                    rows={filteredUsers}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50]}
                    disableRowSelectionOnClick
                    loading={!users}
                    sx={userTableStyles.dataGrid}
                />
            </Box>
        </Paper>
    );
};