import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialSaleForm,
    onCreateSale,
    onUpdateSale,
    setSales,
    onSelectSale,
    onClearSaleSelected, onChangeStatusSale
} from "../../stores/slices/sale/saleSlice.js";
import saleService from "../../services/saleService.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {useNavigate} from "react-router-dom";
import {onChangeStatusDeliveryOrder} from "../../stores/slices/deliveryOrder/deliveryOrderSlice.js";

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
                if (result.status === 201 || result.status === 200) {
                    toast.success('Venta creada exitosamente.');
                    dispatch(onCreateSale(result.data));
                    return result.data;
                }
            } else {
                result = await saleService.updateSale(saleData.id, saleData);
                if (result.status === 200) {
                    toast.success('Venta actualizada exitosamente.');
                    dispatch(onUpdateSale(result.data));
                    return result.data;
                }
            }
            toast.error('Error al guardar la venta.');
            return null;
        } catch (error) {
            console.error('Error saving sale:', error);
            handleApiError(error);
            return null;
        }
    }, [handleApiError, dispatch]);

    const handleChangeStatus = useCallback(async (id, paid) => {
        try {
            const statusData = {paid};
            const result = await saleService.changeStatusSale(id, statusData);
            if (result && (result.status === 200 || result.status === 204)) {
                toast.success('Estado de venta actualizado exitosamente.');
                dispatch(onUpdateSale(result.data));
                return result.data;
            }
            toast.error('Error al cambiar el estado de la venta.');
            return null;
        } catch (error) {
            console.error('Error changing sale status:', error);
            handleApiError(error);
            return null;
        }
    }, [dispatch, handleApiError]);

    const handlePaymentToggle = useCallback(async (id, currentPaidStatus) => {
        const newStatus = !currentPaidStatus;
        const result = await handleChangeStatus(id, newStatus);
        if (result) {
            dispatch(onChangeStatusSale({id, paid: newStatus}));
            dispatch(onChangeStatusDeliveryOrder({id, paid: newStatus}));
        }
    }, [handleChangeStatus, dispatch]);

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
        handleChangeStatus,
        handleSaleEdit,
        handleSelectSale,
        handlePaymentToggle,
        handleClearSaleSelected,
        handleCancel,
    }
}
