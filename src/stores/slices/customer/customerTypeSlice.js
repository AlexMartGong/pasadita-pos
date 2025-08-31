import {createSlice} from "@reduxjs/toolkit";

export const initialCustomerTypeForm = {
    id: 0,
    name: '',
    description: '',
    discount: 0,
}

export const customerTypeSlice = createSlice({
    name: 'customerType',
    initialState: {
        customerTypes: [],
        customerTypeSelected: initialCustomerTypeForm,
    },
    reducers: {
        setCustomerTypes: (state, action) => {
            state.customerTypes = action.payload;
        },
        onCreateCustomerType: (state, action) => {
            state.customerTypes.push({
                ...action.payload,
            });
            state.customerTypeSelected = initialCustomerTypeForm;
        },
        onUpdateCustomerType: (state, action) => {
            const index = state.customerTypes.findIndex(customerType => customerType.id === action.payload.id);
            if (index !== -1) {
                state.customerTypes[index] = {
                    ...action.payload,
                }
            }
        },
        setCustomerTypeSelected: (state, action) => {
            state.customerTypeSelected = action.payload;
        },
        resetCustomerTypeSelected: (state) => {
            state.customerTypeSelected = initialCustomerTypeForm;
        }
    }
});

export const {
    setCustomerTypes,
    onCreateCustomerType,
    onUpdateCustomerType,
    setCustomerTypeSelected,
    resetCustomerTypeSelected,
} = customerTypeSlice.actions;
