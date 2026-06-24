import {SaleForm} from "../../components/sale/SaleForm.jsx";
import {useSale} from "../../hooks/sale/useSale.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Card, CardContent, Container} from "@mui/material";
import {pageContainerStyles} from "../../styles/js/PageContainer.js";
// import {pageHeaderStyles} from "../../styles/js/PageHeader.js";

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

    // const isEditMode = saleSelected && saleSelected.id !== 0;

    return (
        <Container maxWidth={false} sx={{...pageContainerStyles.main, px: {xs: 1, sm: 2, md: 3}}}>
            <Card elevation={4} sx={pageContainerStyles.contentCard}>
                <CardContent sx={{...pageContainerStyles.contentBody, p: 0}}>
                    <SaleForm saleSelected={saleSelected}/>
                </CardContent>
            </Card>
        </Container>
    );
};
