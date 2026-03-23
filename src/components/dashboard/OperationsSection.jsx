import {Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {dashboardStyles} from "../../styles/js/DashboardStyles.js";
import {formatCurrency} from "../../utils/formatters.js";
import {Groups, LocalShipping} from "@mui/icons-material";

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

const MedalBadge = ({position}) => {
    if (position > 3) return <Typography variant="body2" color="text.secondary">{position}</Typography>;
    return (
        <Box sx={{
            ...dashboardStyles.medalIcon,
            backgroundColor: MEDAL_COLORS[position - 1],
        }}>
            {position}
        </Box>
    );
};

export const OperationsSection = ({operations}) => {
    if (!operations) return null;

    const {cashierRanking = [], deliveryRanking = []} = operations;

    return (
        <Card elevation={4} sx={dashboardStyles.sectionCard}>
            <Box sx={dashboardStyles.sectionHeader}>
                <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
                    <Groups/> Operacion y Empleados
                </Typography>
            </Box>
            <Box sx={dashboardStyles.sectionBody}>
                <Box sx={dashboardStyles.twoColumnGrid}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Ranking de Cajeros
                        </Typography>
                        <TableContainer>
                            <Table size="small" sx={dashboardStyles.rankingTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={50}>#</TableCell>
                                        <TableCell>Cajero</TableCell>
                                        <TableCell align="center">Ventas</TableCell>
                                        <TableCell align="right">Monto Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cashierRanking.map((cashier, index) => (
                                        <TableRow key={cashier.employeeId}>
                                            <TableCell><MedalBadge position={index + 1}/></TableCell>
                                            <TableCell>{cashier.employeeName}</TableCell>
                                            <TableCell align="center">{cashier.salesCount}</TableCell>
                                            <TableCell align="right">{formatCurrency(cashier.totalSold)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {cashierRanking.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography variant="body2" color="text.secondary">Sin datos</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                            <LocalShipping fontSize="small"/> Ranking de Repartidores
                        </Typography>
                        <TableContainer>
                            <Table size="small" sx={dashboardStyles.rankingTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={50}>#</TableCell>
                                        <TableCell>Repartidor</TableCell>
                                        <TableCell align="center">Entregas</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {deliveryRanking.map((driver, index) => (
                                        <TableRow key={driver.employeeId}>
                                            <TableCell><MedalBadge position={index + 1}/></TableCell>
                                            <TableCell>{driver.employeeName}</TableCell>
                                            <TableCell align="center">{driver.deliveriesCompleted}</TableCell>
                                        </TableRow>
                                    ))}
                                    {deliveryRanking.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center">
                                                <Typography variant="body2" color="text.secondary">Sin datos</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};
