import {Box, Card, CardContent, Typography} from "@mui/material";
import {statsCardStyles} from "../../styles/js/StatsCards.js";

/**
 * Componente reutilizable para mostrar tarjetas de estadísticas
 * @param {string} label - Etiqueta descriptiva de la estadística
 * @param {string|number} value - Valor a mostrar
 * @param {React.Component} icon - Icono de MUI a mostrar
 * @param {string} color - Color del borde y del icono ('primary', 'success', 'warning', 'error', 'info')
 */
export const StatsCard = ({label, value, icon: Icon, color = 'primary'}) => {
    const colorValue = statsCardStyles.colors[color] || statsCardStyles.colors.primary;

    return (
        <Card elevation={3} sx={{...statsCardStyles.card, borderLeft: `4px solid ${colorValue}`}}>
            <CardContent>
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={statsCardStyles.label}>
                            {label}
                        </Typography>
                        <Typography variant="h4" sx={{...statsCardStyles.value, color: colorValue}}>
                            {value}
                        </Typography>
                    </Box>
                    {Icon && <Icon sx={{fontSize: 48, color: colorValue, opacity: 0.3}}/>}
                </Box>
            </CardContent>
        </Card>
    );
};
