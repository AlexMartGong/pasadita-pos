import {Box, Button} from "@mui/material";
import {Add} from "@mui/icons-material";
import {UserTable} from "../components/user/UserTable.jsx";

export const UserPage = () => {
    const handleAddUser = () => {
        console.log("Agregar nuevo usuario");
        // TODO: Implementar lógica para agregar usuario
    };

    return (
        <Box sx={{p: 2}}>
            <Box sx={{mb: 2, display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add/>}
                    onClick={handleAddUser}
                >
                    Agregar Usuario
                </Button>
            </Box>
            <UserTable/>
        </Box>
    );
};