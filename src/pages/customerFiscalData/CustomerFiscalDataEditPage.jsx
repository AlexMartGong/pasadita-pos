import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Box, CircularProgress} from "@mui/material";
import {CustomerFiscalDataForm} from "../../components/customerFiscalData/CustomerFiscalDataForm.jsx";
import {useCustomerFiscalData} from "../../hooks/customerFiscalData/useCustomerFiscalData.js";

export const CustomerFiscalDataEditPage = () => {
    const {id} = useParams();
    const {
        initialCustomerFiscalDataForm,
        customerFiscalDataList,
        handleGetFiscalDataById
    } = useCustomerFiscalData();
    const [fiscalDataSelected, setFiscalDataSelected] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fiscalId = parseInt(id, 10);

        const cached = customerFiscalDataList?.find(item => item.fiscalId === fiscalId);
        if (cached) {
            setFiscalDataSelected(cached);
            return;
        }

        (async () => {
            const data = await handleGetFiscalDataById(fiscalId);
            setFiscalDataSelected(data ?? initialCustomerFiscalDataForm);
        })();
    }, [id, customerFiscalDataList]);

    if (!fiscalDataSelected) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', py: 6}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <CustomerFiscalDataForm fiscalDataSelected={fiscalDataSelected}/>
    );
};
