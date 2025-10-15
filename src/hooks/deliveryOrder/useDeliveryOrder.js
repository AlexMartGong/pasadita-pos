import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialDeliveryOrderForm,
    onCreateDeliveryOrder,
    onUpdateDeliveryOrderStatus,
    setDeliveryOrders,
    setDeliveryOrderSelected,
    resetDeliveryOrderSelected
} from "../../stores/slices/deliveryOrder/deliveryOrderSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {deliveryOrderService} from "../../services/deliveryOrderService.js";
import {useNavigate} from "react-router-dom";

export const useDeliveryOrder = () => {
    const {deliveryOrders, deliveryOrderSelected} = useSelector(state => state.deliveryOrder);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGetDeliveryOrders = useCallback(async () => {
        try {
            const result = await deliveryOrderService.getAllDeliveryOrders();
            dispatch(setDeliveryOrders(result));
            return true;
        } catch (error) {
            console.error('Error fetching all delivery orders:', error);
            handleApiError(error);
            return false;
        }
    }, [dispatch, handleApiError]);

    const handleSaveDeliveryOrder = useCallback(async (deliveryOrderData) => {
        try {
            const result = await deliveryOrderService.saveDeliveryOrder(deliveryOrderData);
            dispatch(onCreateDeliveryOrder(result));
            toast.success('Orden de entrega guardada exitosamente.');
            return true;
        } catch (error) {
            console.error('Error saving delivery order:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError, dispatch]);

    const handleChangeDeliveryOrderStatus = useCallback(async (id, statusData) => {
        try {
            const result = await deliveryOrderService.changeDeliveryOrderStatus(id, statusData);
            dispatch(onUpdateDeliveryOrderStatus(result));
            toast.success('Estado de la orden actualizado exitosamente.');
            return true;
        } catch (error) {
            console.error('Error changing delivery order status:', error);
            handleApiError(error);
            return false;
        }
    }, [dispatch, handleApiError]);

    const handleSelectDeliveryOrder = useCallback((deliveryOrder) => {
        dispatch(setDeliveryOrderSelected(deliveryOrder));
    }, [dispatch]);

    const handleResetDeliveryOrderSelection = useCallback(() => {
        dispatch(resetDeliveryOrderSelected());
    }, [dispatch]);

    const handleCancel = useCallback(() => {
        navigate('/delivery-orders');
    }, [navigate]);

    const handleDeliveryOrderEdit = useCallback((id) => {
        navigate(`/delivery-order/edit/${id}`);
    }, [navigate]);

    const handleDeliveryOrderView = useCallback((id) => {
        navigate(`/delivery-order/view/${id}`);
    }, [navigate]);

    return {
        initialDeliveryOrderForm,
        deliveryOrders,
        deliveryOrderSelected,
        handleGetDeliveryOrders,
        handleSaveDeliveryOrder,
        handleChangeDeliveryOrderStatus,
        handleDeliveryOrderEdit,
        handleDeliveryOrderView,
        handleSelectDeliveryOrder,
        handleResetDeliveryOrderSelection,
        handleCancel,
    }
}
