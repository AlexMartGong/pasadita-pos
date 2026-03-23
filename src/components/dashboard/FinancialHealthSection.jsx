import {Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell} from "recharts";
import {dashboardStyles} from "../../styles/js/DashboardStyles.js";
import {formatCurrency, formatDate} from "../../utils/formatters.js";
import {StatsCard} from "../common/StatsCard.jsx";
import {StatsCardContainer} from "../common/StatsCardContainer.jsx";
import {AccountBalance, ShoppingBasket, Percent, Warning} from "@mui/icons-material";

export const FinancialHealthSection = ({financialHealth, basketAnalysis}) => {
    if (!financialHealth) return null;

    const {totalDebt = 0, unpaidSales = [], discountImpact = {}} = financialHealth;
    const averageItems = basketAnalysis?.averageItemsPerSale || 0;

    const discountData = [
        {name: 'Ventas Brutas', value: discountImpact.grossSales || 0, fill: '#003c8f'},
        {name: 'Descuentos', value: discountImpact.totalDiscounts || 0, fill: '#ff6b35'},
        {name: 'Ventas Netas', value: discountImpact.netSales || 0, fill: '#2e7d32'},
    ];

    return (
        <Card elevation={4} sx={dashboardStyles.sectionCard}>
            <Box sx={dashboardStyles.sectionHeader}>
                <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
                    <AccountBalance/> Salud Financiera
                </Typography>
            </Box>
            <Box sx={dashboardStyles.sectionBody}>
                <StatsCardContainer>
                    <StatsCard
                        label="Deuda Total"
                        value={formatCurrency(totalDebt)}
                        icon={Warning}
                        color="error"
                    />
                    <StatsCard
                        label="Promedio Items/Venta"
                        value={averageItems.toFixed(1)}
                        icon={ShoppingBasket}
                        color="info"
                    />
                    <StatsCard
                        label="% Descuento"
                        value={`${(discountImpact.discountPercentage || 0).toFixed(1)}%`}
                        icon={Percent}
                        color="warning"
                    />
                </StatsCardContainer>

                <Box sx={dashboardStyles.twoColumnGrid}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Impacto de Descuentos
                        </Typography>
                        <Box sx={dashboardStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={discountData} margin={{left: 10, right: 10, top: 5, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                                    <XAxis dataKey="name" tick={{fontSize: 12}}/>
                                    <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}/>
                                    <Tooltip formatter={(value) => formatCurrency(value)}/>
                                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                        {discountData.map((entry) => (
                                            <Cell key={entry.name} fill={entry.fill}/>
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                            <Warning fontSize="small" color="error"/> Ventas Sin Pagar ({unpaidSales.length})
                        </Typography>
                        <TableContainer sx={{maxHeight: 300}}>
                            <Table size="small" stickyHeader sx={dashboardStyles.rankingTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Fecha</TableCell>
                                        <TableCell>Cliente</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {unpaidSales.map((sale) => (
                                        <TableRow key={sale.saleId}>
                                            <TableCell>{sale.saleId}</TableCell>
                                            <TableCell>{formatDate(sale.saleDate)}</TableCell>
                                            <TableCell>{sale.customerName}</TableCell>
                                            <TableCell align="right">{formatCurrency(sale.total)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {unpaidSales.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography variant="body2" color="text.secondary">Sin deudas pendientes</Typography>
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
