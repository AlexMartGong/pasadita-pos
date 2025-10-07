import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialSaleForm,
    onCreateSale,
    setSales,
    onSelectSale,
    onClearSaleSelected
} from "../../stores/slices/sale/saleSlice.js";
import saleService from "../../services/saleService.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {useNavigate} from "react-router-dom";

export const useSale = () => {
    const {sales, saleSelected} = useSelector(state => state.sale);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGetSales = useCallback(async () => {
        try {
            const result = await saleService.getAllSales();
            if (result.status === 200) {
                dispatch(setSales(result.data));
            } else {
                toast.error('Error al encontrar ventas.');
            }
        } catch (error) {
            console.error('Error fetching all sales:', error);
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

    const handleSaveSale = useCallback(async (saleData) => {
        let result;
        try {
            if (saleData.id === 0) {
                result = await saleService.saveSale(saleData);
            } else {
                result = await saleService.updateSale(saleData.id, saleData);
            }
            if (result.status === 201 || result.status === 200) {
                toast.success('Venta guardada exitosamente.');
                dispatch(onCreateSale(result.data));
            } else {
                toast.error('Error al guardar la venta.');
            }
            return true;
        } catch (error) {
            console.error('Error saving sale:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError, dispatch]);

    const handleSelectSale = useCallback((sale) => {
        dispatch(onSelectSale(sale));
    }, [dispatch]);

    const handleClearSaleSelected = useCallback(() => {
        dispatch(onClearSaleSelected());
    }, [dispatch]);

    const handleCancel = useCallback(() => {
        navigate('/sales');
    }, [navigate]);

    const handleSaleEdit = useCallback((id) => {
        navigate(`/sale/edit/${id}`);
    }, [navigate]);

    return {
        initialSaleForm,
        sales,
        saleSelected,
        handleGetSales,
        handleSaveSale,
        handleSaleEdit,
        handleSelectSale,
        handleClearSaleSelected,
        handleCancel,
    }
}
