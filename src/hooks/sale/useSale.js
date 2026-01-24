import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialSaleForm,
    onCreateSale,
    onUpdateSale,
    setSales,
    setTotalAmountAndSales,
    onSelectSale,
    onClearSaleSelected, onChangeStatusSale
} from "../../stores/slices/sale/saleSlice.js";
import saleService from "../../services/saleService.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {useNavigate} from "react-router-dom";
import {onChangeStatusDeliveryOrder} from "../../stores/slices/deliveryOrder/deliveryOrderSlice.js";

export const useSale = () => {
    const {sales, saleSelected, totalSales, totalAmount} = useSelector(state => state.sale);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGetSales = useCallback(async () => {
        try {
            const result = await saleService.getAllSales();
            if (result.status === 200) {
                dispatch(setSales(result.data));

                // Filtrar ventas de hoy
                const today = new Date();
                const todaySales = result.data.filter(sale => {
                    const saleDate = new Date(sale.datetime);
                    return (
                        saleDate.getDate() === today.getDate() &&
                        saleDate.getMonth() === today.getMonth() &&
                        saleDate.getFullYear() === today.getFullYear()
                    );
                });

                // Calcular totalAmount solo de las ventas pagadas de hoy
                const paidSales = todaySales.filter(sale => sale.paid === true);
                const totalAmountPaid = paidSales.reduce((sum, sale) => sum + (sale.total || 0), 0);

                dispatch(setTotalAmountAndSales({
                    totalSales: todaySales.length,
                    totalAmount: totalAmountPaid
                }));
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
    }, [dispatch, handleApiError]);

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

    const handleGetTicket = useCallback(async (saleId) => {
        try {
            const result = await saleService.getTicketBySaleId(saleId);
            return result.data;
        } catch (error) {
            handleApiError(error);
        }
    }, [handleApiError]);

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

    const handlePrintTicket = useCallback((saleId) => {
        navigate(`/sale/ticket/${saleId}`);
    }, [navigate]);

    return {
        initialSaleForm,
        sales,
        saleSelected,
        totalSales,
        totalAmount,
        handlePrintTicket,
        handleGetSales,
        handleSaveSale,
        handleChangeStatus,
        handleSaleEdit,
        handleGetTicket,
        handleSelectSale,
        handlePaymentToggle,
        handleClearSaleSelected,
        handleCancel,
    }
}
