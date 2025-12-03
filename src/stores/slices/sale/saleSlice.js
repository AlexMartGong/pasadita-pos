import {createSlice} from "@reduxjs/toolkit";

export const initialSaleForm = {
    id: 0,
    customerId: null,
    employeeId: null,
    paid: false,
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
        onChangeStatusSale: (state, action) => {
            state.sales = state.sales.map(sale => {
                return (sale.id === action.payload.id) ? {
                    ...sale,
                    paid: action.payload.paid,
                } : sale;
            });
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
    onChangeStatusSale,
    onSelectSale,
    onClearSaleSelected,
} = saleSlice.actions;
