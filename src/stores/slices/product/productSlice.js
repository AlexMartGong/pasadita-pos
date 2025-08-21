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
        onCreateProduct: (state, action) => {
            state.products.push({
                ...action.payload,
            });
            state.productSelected = initialProductForm;
        },
        onUpdateProduct: (state, action) => {
            const index = state.products.findIndex(product => product.id === action.payload.id);
            if (index !== -1) {
                state.products[index] = {
                    ...action.payload,
                }
            }
        }
    }
});

export const {
    setProducts,
    onCreateProduct,
    onUpdateProduct,
} = productSlice.actions;
