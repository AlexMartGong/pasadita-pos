import {Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from "@mui/material";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend} from "recharts";
import {dashboardStyles} from "../../styles/js/DashboardStyles.js";
import {formatCurrency} from "../../utils/formatters.js";
import {Inventory, TrendingUp, Warning} from "@mui/icons-material";

const COLORS = ['#003c8f', '#005cb2', '#1976d2', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd'];

const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
        return (
            <Box sx={{backgroundColor: 'white', p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1}}>
                <Typography variant="body2" fontWeight={600}>{payload[0].payload.productName || payload[0].payload.category}</Typography>
                <Typography variant="body2" color="text.secondary">{formatCurrency(payload[0].value)}</Typography>
            </Box>
        );
    }
    return null;
};

export const ProductAnalysisSection = ({productAnalysis}) => {
    if (!productAnalysis) return null;

    const {topProducts = [], categorySales = [], deadProducts = []} = productAnalysis;

    const topProductsData = topProducts.slice(0, 10).map(p => ({
        ...p,
        shortName: p.productName.length > 15 ? p.productName.slice(0, 15) + '...' : p.productName,
    }));

    return (
        <Card elevation={4} sx={dashboardStyles.sectionCard}>
            <Box sx={dashboardStyles.sectionHeader}>
                <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
                    <TrendingUp/> Analisis de Productos
                </Typography>
            </Box>
            <Box sx={dashboardStyles.sectionBody}>
                <Box sx={dashboardStyles.twoColumnGrid}>
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Top 10 Productos por Ingreso
                        </Typography>
                        <Box sx={dashboardStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProductsData} layout="vertical" margin={{left: 20, right: 20, top: 5, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
                                    <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}/>
                                    <YAxis type="category" dataKey="shortName" width={120} tick={{fontSize: 12}}/>
                                    <Tooltip content={<CustomTooltip/>}/>
                                    <Bar dataKey="totalRevenue" fill="#003c8f" radius={[0, 4, 4, 0]}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Ventas por Categoria
                        </Typography>
                        <Box sx={dashboardStyles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categorySales}
                                        dataKey="totalRevenue"
                                        nameKey="category"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        label={({category, percent}) => `${category} (${(percent * 100).toFixed(0)}%)`}
                                        labelLine={true}
                                    >
                                        {categorySales.map((entry, index) => (
                                            <Cell key={entry.category} fill={COLORS[index % COLORS.length]}/>
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)}/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Box>
                </Box>

                {deadProducts.length > 0 && (
                    <Box sx={{mt: 3}}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                            <Warning fontSize="small" color="warning"/> Productos Sin Movimiento
                        </Typography>
                        <TableContainer>
                            <Table size="small" sx={dashboardStyles.rankingTable}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Producto</TableCell>
                                        <TableCell>Categoria</TableCell>
                                        <TableCell align="right">Precio</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {deadProducts.map((product) => (
                                        <TableRow key={product.productId}>
                                            <TableCell>{product.productName}</TableCell>
                                            <TableCell>{product.category}</TableCell>
                                            <TableCell align="right">{formatCurrency(product.price)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>
        </Card>
    );
};
