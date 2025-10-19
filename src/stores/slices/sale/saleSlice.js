import {createSlice} from "@reduxjs/toolkit";

export const initialSaleForm = {
    id: 0,
    customerId: null,
    employeeId: null,
    paid: 0,
    paymentMethodId: 0,
    total: 0,
    notes: '',
    saleDetails: [],
}

export const saleSlice = createSlice({
    name: 'sale',
    initialState: {
        sales: [],
        saleSelected: initialSaleForm,
    },
    reducers: {
        setSales: (state, action) => {
            state.sales = action.payload;
        },
        onCreateSale: (state, action) => {
            state.sales.push({
                ...action.payload,
            });
            state.saleSelected = initialSaleForm;
        },
        onUpdateSale: (state, action) => {
            const index = state.sales.findIndex(sale => sale.id === action.payload.id);
            if (index !== -1) {
                state.sales[index] = {
                    ...action.payload,
                }
            }
        },
        onSelectSale: (state, action) => {
            state.saleSelected = action.payload;
        },
        onClearSaleSelected: (state) => {
            state.saleSelected = initialSaleForm;
        }
    }
});

export const {
    setSales,
    onCreateSale,
    onUpdateSale,
    onSelectSale,
    onClearSaleSelected,
} = saleSlice.actions;
