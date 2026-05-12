import {CustomerFiscalDataForm} from "../../components/customerFiscalData/CustomerFiscalDataForm.jsx";
import {useCustomerFiscalData} from "../../hooks/customerFiscalData/useCustomerFiscalData.js";

export const CustomerFiscalDataRegisterPage = () => {
    const {initialCustomerFiscalDataForm} = useCustomerFiscalData();

    return (
        <CustomerFiscalDataForm fiscalDataSelected={initialCustomerFiscalDataForm}/>
    );
};
