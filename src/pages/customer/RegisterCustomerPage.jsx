import {CustomerForm} from "../../components/customer/CustomerForm.jsx";
import {useCustomer} from "../../hooks/customer/useCustomer.js";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

export const RegisterCustomerPage = () => {
    const {initialCustomerForm, customers = []} = useCustomer();
    const [customerSelected, setCustomerSelected] = useState(initialCustomerForm);
    const {id} = useParams();

    useEffect(() => {
        if (id) {
            const customerId = parseInt(id);
            const customer = customers.find(customer => customer.id === customerId);
            if (customer) {
                setCustomerSelected(customer);
            }
        }
    }, [id, customers])

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <CustomerForm customerSelected={customerSelected}/>
            </div>
        </div>
    );
};
