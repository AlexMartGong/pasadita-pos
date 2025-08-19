import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {setProducts} from "../../stores/slices/product/productSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {getProducts} from "../../services/productService.js";

export const useProduct = () => {
    const {products} = useSelector(state => state.product);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();

    const handleGetProducts = useCallback(async () => {
        try {
            const result = await getProducts();
            if (result.status === 200) {
                dispatch(setProducts(result.data));
            } else {
                toast.error('Error al encontrar productos.');
            }
        } catch (error) {
            console.error('Error fetching all products:', error);
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

    return {
        products,
        handleGetProducts,
    }

}
