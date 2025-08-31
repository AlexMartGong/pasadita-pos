import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialCustomerForm,
    onCreateCustomer,
    onUpdateCustomer,
    onChangeStatusCustomer,
    setCustomers,
    setCustomerSelected,
    resetCustomerSelected
} from "../../stores/slices/customer/customerSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {customerService} from "../../services/customerService.js";
import {useNavigate} from "react-router-dom";

export const useCustomer = () => {
    const {customers, customerSelected} = useSelector(state => state.customer);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGetCustomers = useCallback(async () =>   {
        try {
            const result = await customerService.getAllCustomers();
            if (result.status === 200) {
                dispatch(setCustomers(result.data));
            } else {
                toast.error('Error al encontrar clientes.');
            }
        } catch (error) {
            console.error('Error fetching all customers:', error);
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

    const handleSaveCustomer = useCallback(async (customerData) => {
        let result;
        try {
            if (customerData.id === 0) {
                result = await customerService.saveCustomer(customerData);
                dispatch(onCreateCustomer(result.data));
            } else {
                result = await customerService.updateCustomer(customerData.id, customerData);
                dispatch(onUpdateCustomer(result.data));
            }
            if (result.status === 201 || result.status === 200) {
                toast.success('Cliente guardado exitosamente.');
            } else {
                toast.error('Error al guardar el cliente.');
            }
            return true;
        } catch (error) {
            console.error('Error saving customer:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError, dispatch]);

    const handleCustomerToggleStatus = useCallback(async (id, currentStatus) => {
        const newStatus = !currentStatus;
        const confirmMessage = `¿Está seguro de ${newStatus ? 'activar' : 'desactivar'} este cliente?`;
        if (!window.confirm(confirmMessage)) return;

        try {
            const result = await customerService.changeCustomerStatus(id, {active: newStatus});
            dispatch(onChangeStatusCustomer({id, active: newStatus}));
            if (result.status === 200) {
                toast.success('Estado del cliente actualizado exitosamente.');
            }
        } catch (error) {
            console.error('Error changing customer status:', error);
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

    const handleSelectCustomer = useCallback((customer) => {
        dispatch(setCustomerSelected(customer));
    }, [dispatch]);

    const handleResetCustomerSelection = useCallback(() => {
        dispatch(resetCustomerSelected());
    }, [dispatch]);

    const handleCancel = useCallback(() => {
        navigate('/customers');
    }, [navigate]);

    const handleCustomerEdit = useCallback((id) => {
        navigate(`/customer/edit/${id}`);
    }, [navigate]);

    return {
        initialCustomerForm,
        customers,
        customerSelected,
        handleGetCustomers,
        handleSaveCustomer,
        handleCustomerEdit,
        handleCustomerToggleStatus,
        handleSelectCustomer,
        handleResetCustomerSelection,
        handleCancel,
    }
}
