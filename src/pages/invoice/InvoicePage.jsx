import {useEffect} from "react";
import {Box, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {ReceiptLong} from "@mui/icons-material";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";
import {InvoiceTable} from "../../components/invoice/InvoiceTable.jsx";
import {useInvoice} from "../../hooks/invoice/useInvoice.js";

export const InvoicePage = () => {
    const {handleGetAllInvoices} = useInvoice();

    useEffect(() => {
        handleGetAllInvoices(0, 50);
    }, []);

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <ReceiptLong sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                Historial de Facturas
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                Consulta, descarga y cancela los CFDI 4.0 emitidos
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <Box sx={pageContainerStyles.contentHeader}>
                    <Typography variant="h6" component="h2" sx={pageContainerStyles.contentTitle}>
                        Lista de Facturas
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={pageContainerStyles.contentSubtitle}>
                        Visualiza el historial completo de timbrado y cancelación de facturas
                    </Typography>
                </Box>

                <CardContent sx={pageContainerStyles.contentBody}>
                    <InvoiceTable/>
                </CardContent>
            </Card>
        </Container>
    );
};
