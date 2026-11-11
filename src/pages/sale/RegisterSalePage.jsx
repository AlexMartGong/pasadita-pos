import {SaleForm} from "../../components/sale/SaleForm.jsx";
import {useSale} from "../../hooks/sale/useSale.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
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

    // Sin Container ni Card: la vista POS ocupa toda el área principal (ver AppShellStyles).
    return <SaleForm saleSelected={saleSelected}/>;
};
