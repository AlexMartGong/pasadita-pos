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
        },
        onChangeStatusProduct: (state, action) => {
            state.products = state.products.map(product => {
                return (product.id === action.payload.id) ? {
                    ...product,
                    active: action.payload.active,
                } : product;
            });
        },
        onChangePriceProduct: (state, action) => {
            const index = state.products.findIndex(product => product.id === action.payload.id);
            if (index !== -1) {
                state.products[index].price = action.payload.price;
            }
        }
    }
});

export const {
    setProducts,
    onCreateProduct,
    onUpdateProduct,
    onChangeStatusProduct,
    onChangePriceProduct,
} = productSlice.actions;
