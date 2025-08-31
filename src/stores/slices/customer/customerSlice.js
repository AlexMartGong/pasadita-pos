import {createSlice} from "@reduxjs/toolkit";

export const initialCustomerForm = {
    id: 0,
    customerTypeId: null,
    customerTypeName: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    customDiscount: 0,
    notes: '',
    active: true,
}

export const customerSlice = createSlice({
    name: 'customer',
    initialState: {
        customers: [],
        customerSelected: initialCustomerForm,
    },
    reducers: {
        setCustomers: (state, action) => {
            state.customers = action.payload;
        },
        onCreateCustomer: (state, action) => {
            state.customers.push({
                ...action.payload,
            });
            state.customerSelected = initialCustomerForm;
        },
        onUpdateCustomer: (state, action) => {
            const index = state.customers.findIndex(customer => customer.id === action.payload.id);
            if (index !== -1) {
                state.customers[index] = {
                    ...action.payload,
                }
            }
        },
        onChangeStatusCustomer: (state, action) => {
            state.customers = state.customers.map(customer => {
                return (customer.id === action.payload.id) ? {
                    ...customer,
                    active: action.payload.active,
                } : customer;
            });
        },
        setCustomerSelected: (state, action) => {
            state.customerSelected = action.payload;
        },
        resetCustomerSelected: (state) => {
            state.customerSelected = initialCustomerForm;
        }
    }
});

export const {
    setCustomers,
    onCreateCustomer,
    onUpdateCustomer,
    onChangeStatusCustomer,
    setCustomerSelected,
    resetCustomerSelected,
} = customerSlice.actions;
