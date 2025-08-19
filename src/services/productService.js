import {productApi} from "../apis/productApi.js";

export const getProducts = async () => {
    try {
        return await productApi.get('/all')
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

const productService = {
    getProducts,
};

export default productService;
