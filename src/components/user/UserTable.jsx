import {useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {TextField, Box, Paper, IconButton, Tooltip} from "@mui/material";
import {Edit, ToggleOn, ToggleOff} from "@mui/icons-material";
import {useUser} from "../../hooks/useUser.js";

export const UserTable = () => {
    const {users, getAllUsers} = useUser();
    const [searchText, setSearchText] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);

    useEffect(() => {
        if (users) {
            const filtered = users.filter((user) =>
                Object.values(user).some((value) =>
                    value?.toString().toLowerCase().includes(searchText.toLowerCase())
                )
            );
            setFilteredUsers(filtered);
        }
    }, [users, searchText]);

    const handleEdit = (userId) => {
        console.log("Editar usuario:", userId);
        // TODO: Implementar lógica de edición
    };

    const handleToggleStatus = (userId, currentStatus) => {
        console.log("Cambiar estado del usuario:", userId, "Estado actual:", currentStatus);
        // TODO: Implementar lógica de cambio de estado
    };

    const columns = [
        {
            field: "id",
            headerName: "ID",
            width: 90,
            sortable: true,
        },
        {
            field: "fullName",
            headerName: "Nombre",
            width: 300,
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
            sortable: true,
        },
        {
            field: "active",
            headerName: "Estado",
            width: 150,
            sortable: true,
        },
        {
            field: "actions",
            headerName: "Acciones",
            width: 300,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{display: 'flex', gap: 1}}>
                    <Tooltip title="Editar">
                        <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(params.row.id)}>
                            <Edit/>
                        </IconButton>
                        Editar
                    </Tooltip>
                    <Tooltip title={params.row.active ? "Desactivar" : "Activar"}>
                        <IconButton
                            size="small"
                            color={params.row.active ? "success" : "default"}
                            onClick={() => handleToggleStatus(params.row.id, params.row.active)}
                        >
                            {params.row.active ? <ToggleOn/> : <ToggleOff/>}
                        </IconButton>
                        Estado
                    </Tooltip>
                </Box>
            ),
        },
    ];

    return (
        <Paper sx={{p: 2, height: "100%"}}>
            <Box sx={{mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2}}>
                <TextField
                    fullWidth
                    label="Buscar usuarios..."
                    variant="outlined"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </Box>
            <Box sx={{height: 600, width: "100%"}}>
                <DataGrid
                    rows={filteredUsers || []}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    pagination
                    disableSelectionOnClick
                    loading={!users}
                    sx={{
                        "& .MuiDataGrid-root": {
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: "none",
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#f5f5f5",
                            color: "#000",
                            fontSize: 16,
                        },
                        "& .MuiDataGrid-virtualScroller": {
                            backgroundColor: "#fff",
                        },
                    }}
                />
            </Box>
        </Paper>
    );
};
