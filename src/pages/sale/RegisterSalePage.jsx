import {SaleForm} from "../../components/sale/SaleForm.jsx";
import {useSale} from "../../hooks/sale/useSale.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, Card, CardContent, Container, Paper, Typography} from "@mui/material";
import {PointOfSale} from "@mui/icons-material";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
import {pageHeaderStyles} from "../../styles/js/PageHeader.js";

export const RegisterSalePage = () => {
    const {initialSaleForm, sales = []} = useSale();
    const [saleSelected, setSaleSelected] = useState(initialSaleForm);
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            const saleId = parseInt(id);
            const sale = sales.find(sale => sale.id === saleId);
            if (sale) {
                setSaleSelected(sale);
            }
        }
    }, [id, sales])

    const isEditMode = saleSelected && saleSelected.id !== 0;

    return (
        <Container maxWidth="xl" sx={pageContainerStyles.main}>
            <Paper elevation={2} sx={pageHeaderStyles.container}>
                <Box sx={pageHeaderStyles.content}>
                    <Box sx={pageHeaderStyles.titleSection}>
                        <PointOfSale sx={pageHeaderStyles.icon}/>
                        <Box>
                            <Typography variant="h4" component="h1" sx={pageHeaderStyles.title}>
                                {isEditMode ? 'Editar Venta' : 'Nueva Venta'}
                            </Typography>
                            <Typography variant="body1" sx={pageHeaderStyles.subtitle}>
                                {isEditMode ? 'Modifica los detalles de la venta' : 'Registra una nueva venta de forma rápida y eficiente'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <CardContent sx={{...pageContainerStyles.contentBody, p: 0}}>
                    <SaleForm saleSelected={saleSelected}/>
                </CardContent>
            </Card>
        </Container>
    );
};
