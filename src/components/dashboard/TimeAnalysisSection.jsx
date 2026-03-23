import {Box, Card, Tooltip as MuiTooltip, Typography} from "@mui/material";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from "recharts";
import {dashboardStyles} from "../../styles/js/DashboardStyles.js";
import {formatCurrency} from "../../utils/formatters.js";
import {AccessTime} from "@mui/icons-material";

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
const HOURS = Array.from({length: 24}, (_, i) => i);

const getHeatmapColor = (count, maxCount) => {
    if (count === 0 || maxCount === 0) return '#f5f5f5';
    const intensity = count / maxCount;
    if (intensity < 0.25) return '#bbdefb';
    if (intensity < 0.5) return '#64b5f6';
    if (intensity < 0.75) return '#1976d2';
    return '#003c8f';
};

const buildHeatmapData = (heatmap) => {
    const grid = {};
    let maxCount = 0;
    heatmap.forEach(({dayOfWeek, hour, salesCount}) => {
        const key = `${dayOfWeek}-${hour}`;
        grid[key] = salesCount;
        if (salesCount > maxCount) maxCount = salesCount;
    });
    return {grid, maxCount};
};

export const TimeAnalysisSection = ({timeAnalysis}) => {
    if (!timeAnalysis) return null;

    const {heatmap = [], hourlyAverages = []} = timeAnalysis;
    const {grid, maxCount} = buildHeatmapData(heatmap);

    const hourlyData = hourlyAverages.map(h => ({
        ...h,
        label: `${h.hour}:00`,
    }));

    return (
        <Card elevation={4} sx={dashboardStyles.sectionCard}>
            <Box sx={dashboardStyles.sectionHeader}>
                <Typography variant="h6" sx={dashboardStyles.sectionTitle}>
                    <AccessTime/> Tiempos y Picos de Venta
                </Typography>
            </Box>
            <Box sx={dashboardStyles.sectionBody}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Mapa de Calor - Ventas por Dia y Hora
                </Typography>
                <Box sx={{overflowX: 'auto', mb: 3}}>
                    <Box sx={dashboardStyles.heatmapGrid}>
                        <Box/>
                        {HOURS.map(h => (
                            <Typography key={h} variant="caption" align="center" sx={{fontSize: '0.65rem', color: 'text.secondary'}}>
                                {h}
                            </Typography>
                        ))}

                        {[1, 2, 3, 4, 5, 6, 7].map(day => (
                            <Box key={day} sx={{display: 'contents'}}>
                                <Box sx={dashboardStyles.heatmapLabel}>
                                    {DAY_LABELS[day - 1]}
                                </Box>
                                {HOURS.map(hour => {
                                    const count = grid[`${day}-${hour}`] || 0;
                                    return (
                                        <MuiTooltip
                                            key={`${day}-${hour}`}
                                            title={`${DAY_LABELS[day - 1]} ${hour}:00 - ${count} ventas`}
                                            arrow
                                        >
                                            <Box sx={{
                                                ...dashboardStyles.heatmapCell,
                                                backgroundColor: getHeatmapColor(count, maxCount),
                                            }}/>
                                        </MuiTooltip>
                                    );
                                })}
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, justifyContent: 'flex-end'}}>
                        <Typography variant="caption" color="text.secondary">Menos</Typography>
                        {['#f5f5f5', '#bbdefb', '#64b5f6', '#1976d2', '#003c8f'].map(color => (
                            <Box key={color} sx={{width: 14, height: 14, borderRadius: 0.5, backgroundColor: color}}/>
                        ))}
                        <Typography variant="caption" color="text.secondary">Mas</Typography>
                    </Box>
                </Box>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Ticket Promedio por Hora
                </Typography>
                <Box sx={dashboardStyles.chartContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hourlyData} margin={{left: 10, right: 10, top: 5, bottom: 5}}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="label" tick={{fontSize: 11}}/>
                            <YAxis tickFormatter={(v) => `$${v}`}/>
                            <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(l) => `Hora: ${l}`}/>
                            <Bar dataKey="averageTicket" fill="#ff6b35" radius={[4, 4, 0, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </Card>
    );
};
