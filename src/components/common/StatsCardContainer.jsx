import {Box} from "@mui/material";
import {statsCardStyles} from "../../styles/js/StatsCards.js";

/**
 * Contenedor para agrupar múltiples StatsCards
 * @param {React.ReactNode} children - Componentes StatsCard a mostrar
 */
export const StatsCardContainer = ({children}) => {
    return (
        <Box sx={statsCardStyles.container}>
            {children}
        </Box>
    );
};
