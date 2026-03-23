import {Box, Card, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {dashboardStyles} from "../../styles/js/DashboardStyles.js";
import {formatCurrency} from "../../utils/formatters.js";
import {People, PersonAdd, PersonOff} from "@mui/icons-material";

const COLORS = ['#ff6b35', '#f7931e', '#003c8f', '#005cb2', '#1976d2', '#42a5f5'];

export const CustomerAnalysisSection = ({customerAnalysis}) => {
    if (!customerAnalysis) return null;

    const {vipCustomers = [], customerTypeSales = [], registeredVsAnonymous = {}} = customerAnalysis;
    const {registeredSalesCount = 0, anonymousSalesCount = 0} = registeredVsAnonymous;
    const totalCount = registeredSalesCount + anonymousSalesCount;
    const registeredPercent = totalCount > 0 ? ((registeredSalesCount / totalCount) * 100).toFixed(0) : 0;

    return (
        <Card elevation={4} sx={dashboardStyles.sectionCard}>
            <Box sx={dashboardStyles.sectionHeader}>
                <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
                    <People/> Clientes
                </Typography>
            </Box>
            <Box sx={dashboardStyles.sectionBody}>
                <Box sx={dashboardStyles.twoColumnGrid}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Ventas por Tipo de Cliente
                        </Typography>
                        <Box sx={{...dashboardStyles.chartContainer, height: 260}}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={customerTypeSales}
                                        dataKey="totalRevenue"
                                        nameKey="customerTypeName"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({customerTypeName, percent}) => `${customerTypeName} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {customerTypeSales.map((entry, index) => (
                                            <Cell key={entry.customerTypeName} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)}/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <Box sx={{display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap'}}>
                            <Chip
                                icon={<PersonAdd/>}
                                label={`Registrados: ${registeredSalesCount} (${registeredPercent}%)`}
                                color="primary"
                                variant="outlined"
                                size="small"
                            />
                            <Chip
                                icon={<PersonOff/>}
                                label={`Anonimos: ${anonymousSalesCount}`}
                                color="default"
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Clientes VIP
                        </Typography>
                        <TableContainer>
                            <Table size="small" sx={dashboardStyles.rankingTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell align="center">Compras</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vipCustomers.map((customer) => (
                                        <TableRow key={customer.customerId}>
                                            <TableCell>{customer.customerName}</TableCell>
                                            <TableCell align="center">{customer.salesCount}</TableCell>
                                            <TableCell align="right">{formatCurrency(customer.totalPurchased)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {vipCustomers.length === 0 && (
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
