import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialProductForm, onChangePriceProduct, onChangeStatusProduct,
    onCreateProduct,
    onUpdateProduct,
    setProducts
} from "../../stores/slices/product/productSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {
    getProducts,
    createProduct,
    updateProduct,
    changeStatusProduct,
    updateProductPrice
} from "../../services/productService.js";
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

    const handleSaveProduct = useCallback(async (productData) => {
        let result;
        try {
            if (productData.id === 0) {
                result = await createProduct(productData);
                dispatch(onCreateProduct(result.data));
            } else {
                result = await updateProduct(productData);
                dispatch(onUpdateProduct(result.data));
            }
            if (result.status === 201 || result.status === 200) toast.success('Producto guardado exitosamente.');
            else toast.error('Error al guardar el producto.');
            return true;
        } catch (error) {
            console.error('Error creating product:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError, dispatch]);

    const handleProductToggleStatus = useCallback(async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const confirmMessage = `¿Está seguro de ${newStatus ? 'activar' : 'desactivar'} este producto?`;
        if (!window.confirm(confirmMessage)) return;

        try {
            const result = await changeStatusProduct(id, {active: newStatus});
            dispatch(onChangeStatusProduct({id, active: newStatus}));
            if (result.status === 200) toast.success('Estado del producto actualizado exitosamente.');
        } catch (error) {
            console.error('Error fetching all products:', error);
            handleApiError(error);
        }

    }, [dispatch, handleApiError]);

    const handleUpdatePriceProduct = useCallback(async (id, newPrice) => {
        try {
            const result = await updateProductPrice(id, newPrice);
            if (result.status === 200) {
                toast.success('Precio actualizado exitosamente.');
                dispatch(onChangePriceProduct({id, price: newPrice}));
                return true;
            } else {
                toast.error('Error al actualizar el precio.');
                return false;
            }
        } catch (error) {
            handleApiError(error);
            console.log(error);
            return false;
        }
    }, [dispatch, handleApiError]);

    const handleCancel = useCallback(() => {
        navigate('/products');
    }, [navigate]);

    const handleProductEdit = useCallback((id) => {
        navigate(`/product/edit/${id}`);
    }, [navigate]);

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
        handleGetProducts,
        handleSaveProduct,
        handleProductEdit,
        handleProductToggleStatus,
        handleUpdatePriceProduct,
        handleCancel,
        categories,
        unitMeasures,
        products,
    }

}
