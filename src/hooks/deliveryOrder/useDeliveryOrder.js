import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialDeliveryOrderForm,
    onCreateDeliveryOrder,
    onUpdateDeliveryOrderStatus,
    setDeliveryOrders,
    setDeliveryOrderSelected,
    resetDeliveryOrderSelected,
    setTotalAmountAndOrders
} from "../../stores/slices/deliveryOrder/deliveryOrderSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {deliveryOrderService} from "../../services/deliveryOrderService.js";

export const useDeliveryOrder = () => {
    const {deliveryOrders, deliveryOrderSelected, totalOrders, totalAmount} = useSelector(state => state.deliveryOrder);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();

    const handleGetDeliveryOrders = useCallback(async () => {
        try {
            const result = await deliveryOrderService.getAllDeliveryOrders();
            dispatch(setDeliveryOrders(result.orders));
            dispatch(setTotalAmountAndOrders(result));
            console.log(result);
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

    const handleUpdateDeliveryOrder = useCallback(async (id, deliveryOrderData) => {
        try {
            const result = await deliveryOrderService.updateDeliveryOrder(id, deliveryOrderData);
            dispatch(onUpdateDeliveryOrderStatus(result));
            toast.success('Orden de entrega actualizada exitosamente.');
            return true;
        } catch (error) {
            console.error('Error updating delivery order:', error);
            handleApiError(error);
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


    return {
        initialDeliveryOrderForm,
        deliveryOrders,
        deliveryOrderSelected,
        totalOrders,
        totalAmount,
        handleGetDeliveryOrders,
        handleSaveDeliveryOrder,
        handleUpdateDeliveryOrder,
        handleChangeDeliveryOrderStatus,
        handleSelectDeliveryOrder,
        handleResetDeliveryOrderSelection,
    }
}
