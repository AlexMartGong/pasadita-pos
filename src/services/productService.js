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

const productService = {
    getProducts,
    createProduct,
};

export default productService;
