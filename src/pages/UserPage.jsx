import {Box, Button} from "@mui/material";
import {Add} from "@mui/icons-material";
import {UserTable} from "../components/user/UserTable.jsx";
import {NavLink} from "react-router-dom";

export const UserPage = () => {
    return (
        <Box sx={{p: 2}}>
            <Box sx={{mb: 2, display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    component={NavLink}
                    to="/users/register"
                    variant="contained"
                    color="primary"
                    startIcon={<Add/>}
                    sx={{textDecoration: 'none'}}
                >
                    Agregar Usuario
                </Button>
            </Box>
            <UserTable/>
        </Box>
    );
};