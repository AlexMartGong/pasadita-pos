import {createSlice} from "@reduxjs/toolkit";

export const initialProductForm = {
    id: 0,
    name: '',
    category: '',
    price: 0,
    unitMeasure: '',
    active: true,
}

export const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productSelected: initialProductForm,
    },
    reducers: {
        setProducts: (state, action) => {
            state.products = action.payload;
        },
    }
});

export const {
    setProducts,
} = productSlice.actions;
