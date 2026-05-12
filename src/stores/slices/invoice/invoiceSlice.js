import {createSlice} from "@reduxjs/toolkit";

export const invoiceSlice = createSlice({
    name: 'invoice',
    initialState: {
        invoiceList: [],
        loading: false,
    },
    reducers: {
        setInvoiceList: (state, action) => {
            state.invoiceList = action.payload;
        },
        onCreateInvoice: (state, action) => {
            state.invoiceList.unshift({...action.payload});
        },
        onUpdateInvoice: (state, action) => {
            const index = state.invoiceList.findIndex(
                item => item.invoiceId === action.payload.invoiceId
            );
            if (index !== -1) {
                state.invoiceList[index] = {...action.payload};
            }
        },
        setInvoiceLoading: (state, action) => {
            state.loading = action.payload;
        },
    }
});

export const {
    setInvoiceList,
    onCreateInvoice,
    onUpdateInvoice,
    setInvoiceLoading,
} = invoiceSlice.actions;
