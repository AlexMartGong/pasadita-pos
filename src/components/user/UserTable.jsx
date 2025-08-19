import {useEffect} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {TextField, Box, Paper} from "@mui/material";
import {useUser} from "../../hooks/user/useUser.js";
import {useUserTable} from "../../hooks/user/useUserTable.jsx";
import {userTableStyles} from "../../styles/js/UserTable.js";

export const UserTable = () => {
    const {users, getAllUsers} = useUser();
    const {searchText, setSearchText, filteredUsers, columns} = useUserTable(users);

    useEffect(() => {
        getAllUsers();
    }, []);

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