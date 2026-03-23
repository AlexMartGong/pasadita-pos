import {Box, Container, IconButton, LinearProgress, Paper, Skeleton, Typography} from "@mui/material";
import {Dashboard, Refresh} from "@mui/icons-material";
import {pageContainerStyles} from "../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../styles/js/PageHeader.js";
import {useDashboard} from "../hooks/dashboard/useDashboard.js";
import {DateRangeFilter} from "../components/dashboard/DateRangeFilter.jsx";
import {FinancialSummarySection} from "../components/dashboard/FinancialSummarySection.jsx";
import {ProductAnalysisSection} from "../components/dashboard/ProductAnalysisSection.jsx";
import {OperationsSection} from "../components/dashboard/OperationsSection.jsx";
import {CustomerAnalysisSection} from "../components/dashboard/CustomerAnalysisSection.jsx";
import {TimeAnalysisSection} from "../components/dashboard/TimeAnalysisSection.jsx";
import {FinancialHealthSection} from "../components/dashboard/FinancialHealthSection.jsx";

const DashboardSkeleton = () => (
    <Box>
        <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3, mb: 3}}>
            {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} variant="rectangular" height={100} sx={{borderRadius: 2}}/>
            ))}
        </Box>
        {[1, 2, 3].map(i => (
            <Skeleton key={i} variant="rectangular" height={350} sx={{borderRadius: 3, mb: 3}}/>
        ))}
    </Box>
);

export const DashboardPage = () => {
    const {data, loading, handleGetDashboard} = useDashboard();

    const handleFilterChange = (startDate, endDate) => {
        handleGetDashboard(startDate, endDate);
    };

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <Dashboard sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Panel de Control
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Resumen general del negocio
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={pageHeaderStyles.buttonContainer}>
                        <IconButton
                            onClick={() => handleGetDashboard()}
                            sx={{
                                ...pageHeaderStyles.actionButton,
                                minWidth: 'auto',
                                p: 1.5,
                            }}
                        >
                            <Refresh/>
                        </IconButton>
                    </Box>
                </Box>
            </Paper>

            <DateRangeFilter onFilterChange={handleFilterChange}/>

            {loading && data && <LinearProgress sx={{mb: 2, borderRadius: 1}}/>}

            {loading && !data ? (
                <DashboardSkeleton/>
            ) : data && (
                <>
                    <FinancialSummarySection financialSummary={data.financialSummary}/>
                    <ProductAnalysisSection productAnalysis={data.productAnalysis}/>
                    <OperationsSection operations={data.operations}/>
                    <CustomerAnalysisSection customerAnalysis={data.customerAnalysis}/>
                    <TimeAnalysisSection timeAnalysis={data.timeAnalysis}/>
                    <FinancialHealthSection
                        financialHealth={data.financialHealth}
                        basketAnalysis={data.basketAnalysis}
                    />
                </>
            )}
        </Container>
    );
};
