import {SaleForm} from "../../components/sale/SaleForm.jsx";
import {useSale} from "../../hooks/sale/useSale.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

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

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <SaleForm saleSelected={saleSelected}/>
            </div>
        </div>
    );
};
