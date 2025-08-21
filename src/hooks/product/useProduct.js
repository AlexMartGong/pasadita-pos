import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {initialProductForm, setProducts} from "../../stores/slices/product/productSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {getProducts, createProduct} from "../../services/productService.js";
import {useNavigate} from "react-router-dom";

export const useProduct = () => {
    const {products} = useSelector(state => state.product);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    const handleCreateProduct = useCallback(async (productData) => {
        try {
            const result = await createProduct(productData);
            if (result.status === 201) {
                toast.success('Producto creado exitosamente');
                await handleGetProducts(); // Refresh the products list
                return true;
            } else {
                toast.error('Error al crear el producto.');
                return false;
            }
        } catch (error) {
            console.error('Error creating product:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError, handleGetProducts]);

    const handleCancel = useCallback(() => {
        navigate('/products');
    }, [navigate]);

    const handleProductEdit = useCallback((id) => {
        navigate(`/product/edit/${id}`);
    }, [navigate]);

    const handleProductToggleStatus = useCallback(async (id, currentStatus) => {
    }, [dispatch, handleApiError]);

    const categories = [
        {value: 'FRUTAS', label: 'Fruta'},
        {value: 'VERDURAS', label: 'Verdura'},
        {value: 'HIERBAS', label: 'Hierba'},
        {value: 'CHILES', label: 'Chile'},
        {value: 'GRANOS_CEREALES', label: 'Grano Cereal'},
        {value: 'FRUTOS_SECOS', label: 'Fruto Seco'},
    ];

    const unitMeasures = [
        {value: 'PIEZA', label: 'Pieza'},
        {value: 'PORCION', label: 'Porción'},
        {value: 'KILOGRAMO', label: 'Kilogramo'},
        {value: 'GRAMO', label: 'Gramo'},
        {value: 'LITRO', label: 'Litro'},
        {value: 'MILILITRO', label: 'Mililitro'},
    ];

    return {
        initialProductForm,
        handleProductEdit,
        handleProductToggleStatus,
        handleCancel,
        categories,
        unitMeasures,
        products,
        handleGetProducts,
        handleCreateProduct,
    }

}
