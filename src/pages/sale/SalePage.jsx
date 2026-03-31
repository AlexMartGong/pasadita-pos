import {NavLink} from "react-router-dom";
import {useState, useCallback} from "react";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {Box, Button, Card, CardContent, Container, Paper, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {Add, ReceiptLong, ShoppingCart, AttachMoney} from "@mui/icons-material";
import {SaleTable} from "../../components/sale/SaleTable.jsx";
import {formatCurrency} from "../../utils/formatters.js";
import {StatsCard} from "../../components/common/StatsCard.jsx";
import {StatsCardContainer} from "../../components/common/StatsCardContainer.jsx";
import {FILTER_OPTIONS} from "../../hooks/sale/useSaleTable.jsx";

export const SalePage = () => {
    const [filterOption, setFilterOption] = useState(FILTER_OPTIONS.TODAY_ALL);
    const [stats, setStats] = useState({count: 0, total: 0});

    const handleFilterChange = useCallback((_, newFilter) => {
        if (newFilter !== null) {
            setFilterOption(newFilter);
        }
    }, []);

    const handleStatsChange = useCallback((newStats) => {
        setStats(newStats);
    }, []);

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <ReceiptLong sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Gestión de Ventas
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Administra las ventas de manera eficiente y segura
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={pageHeaderStyles.buttonContainer}>
                        <Button
                            component={NavLink}
                            to="/sale/register"
                            variant="contained"
                            size="large"
                            startIcon={<Add/>}
                            sx={pageHeaderStyles.actionButton}>
                            Nueva Venta
                        </Button>
                    </Box>
                </Box>
            </Paper>

            <StatsCardContainer>
                <StatsCard
                    label="Ventas en Caja"
                    value={stats.count}
                    icon={ShoppingCart}
                    color="primary"
                />
                <StatsCard
                    label="Monto Total (Pagado)"
                    value={formatCurrency(stats.total)}
                    icon={AttachMoney}
                    color="success"
                />
            </StatsCardContainer>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={{...pageContainerStyles.contentHeader, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1}}>
                    <Box>
                        <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                            Lista de Ventas en Caja
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                            Visualiza y gestiona las ventas registradas en caja
                        </Typography>
                    </Box>
                    <ToggleButtonGroup
                        value={filterOption}
                        exclusive
                        onChange={handleFilterChange}
                        size="small"
                    >
                        <ToggleButton value={FILTER_OPTIONS.TODAY_ALL}>Hoy</ToggleButton>
                        <ToggleButton value={FILTER_OPTIONS.TODAY_MORNING}>Mañana</ToggleButton>
                        <ToggleButton value={FILTER_OPTIONS.TODAY_AFTERNOON}>Tarde</ToggleButton>
                        <ToggleButton value={FILTER_OPTIONS.ALL}>Todas</ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <SaleTable filterOption={filterOption} onStatsChange={handleStatsChange}/>
                </CardContent>
            </Card>
        </Container>
    );
}
