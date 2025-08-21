import {productApi} from "../apis/productApi.js";

export const getProducts = async () => {
    try {
        return await productApi.get('/all')
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const createProduct = async ({name, category, price, unitMeasure, active}) => {
    try {
        return await productApi.post('/save', {
            name,
            category,
            price,
            unitMeasure,
            active,
        });
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async ({id, name, category, price, unitMeasure, active}) => {
    try {
        return await productApi.put(`/update/${id}`, {
            name,
            category,
            price,
            unitMeasure,
            active,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const changeStatusProduct = async (id, statusData) => {
    try {
        return await productApi.put(`/change-status/${id}`, statusData);
    } catch (error) {
        console.error('Error changing status:', error);
    }
};

const productService = {
    getProducts,
    createProduct,
    updateProduct,
};

export default productService;
