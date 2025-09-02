import {CustomerTypeForm} from "../../components/customer/CustomerTypeForm.jsx";
import {useCustomerType} from "../../hooks/customer/useCustomerType.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {initialCustomerTypeForm} from "../../stores/slices/customer/customerTypeSlice.js";

export const RegisterCustomerTypePage = () => {
    const {customerTypes = []} = useCustomerType();
    const [customerTypeSelected, setCustomerTypeSelected] = useState(initialCustomerTypeForm);
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            const customerTypeId = parseInt(id);
            const customerType = customerTypes.find(customerType => customerType.id === customerTypeId);
            if (customerType) {
                setCustomerTypeSelected(customerType);
            }
        }
    }, [id, customerTypes])

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <CustomerTypeForm customerTypeSelected={customerTypeSelected}/>
            </div>
        </div>
    );
};
