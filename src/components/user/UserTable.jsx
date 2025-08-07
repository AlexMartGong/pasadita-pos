import {useEffect, useMemo} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {TextField, Box, Paper, IconButton, Tooltip} from "@mui/material";
import {Edit, ToggleOn, ToggleOff} from "@mui/icons-material";
import {useUser} from "../../hooks/useUser.js";
import {useUserTable} from "../../hooks/useUserTable.js";

export const UserTable = () => {
    const {users, getAllUsers, handleToggleStatus, handleEditRow} = useUser();
    const {searchText, setSearchText, filteredUsers} = useUserTable(users);


    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);


    const columns = useMemo(() => [
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
                            onClick={() => handleEditRow(params.row.id)}>
                            <Edit/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={params.row.active ? "Desactivar" : "Activar"}>
                        <IconButton
                            size="small"
                            color={params.row.active ? "success" : "default"}
                            onClick={() => handleToggleStatus(params.row.id, params.row.active)}
                        >
                            {params.row.active ? <ToggleOn/> : <ToggleOff/>}
                        </IconButton>
                    </Tooltip>
                </Box>
            ),
        },
    ], [handleEditRow, handleToggleStatus]);

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