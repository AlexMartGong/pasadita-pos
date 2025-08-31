import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialCustomerTypeForm,
    onCreateCustomerType,
    onUpdateCustomerType,
    setCustomerTypes,
    setCustomerTypeSelected,
    resetCustomerTypeSelected
} from "../../stores/slices/customer/customerTypeSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {customerTypeService} from "../../services/customerTypeService.js";
import {useNavigate} from "react-router-dom";

export const useCustomerType = () => {
    const {customerTypes, customerTypeSelected} = useSelector(state => state.customerType);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGetCustomerTypes = useCallback(async () => {
        try {
            const result = await customerTypeService.getAllCustomerTypes();
            dispatch(setCustomerTypes(result));
        } catch (error) {
            console.error('Error fetching all customer types:', error);
            handleApiError(error);
            toast.error('Error al encontrar tipos de cliente.');
        }
    }, [dispatch, handleApiError]);

    const handleSaveCustomerType = useCallback(async (customerTypeData) => {
        let result;
        try {
            if (customerTypeData.id === 0) {
                result = await customerTypeService.saveCustomerType(customerTypeData);
                dispatch(onCreateCustomerType(result));
                toast.success('Tipo de cliente creado exitosamente.');
            } else {
                result = await customerTypeService.updateCustomerType(customerTypeData);
                dispatch(onUpdateCustomerType(result));
                toast.success('Tipo de cliente actualizado exitosamente.');
            }
            return true;
        } catch (error) {
            console.error('Error saving customer type:', error);
            handleApiError(error);
            toast.error('Error al guardar el tipo de cliente.');
            return false;
        }
    }, [handleApiError, dispatch]);

    const handleSelectCustomerType = useCallback((customerType) => {
        dispatch(setCustomerTypeSelected(customerType));
    }, [dispatch]);

    const handleResetCustomerTypeSelection = useCallback(() => {
        dispatch(resetCustomerTypeSelected());
    }, [dispatch]);

    const handleCancel = useCallback(() => {
        navigate('/customer-types');
    }, [navigate]);

    const handleCustomerTypeEdit = useCallback((id) => {
        navigate(`/customer-type/edit/${id}`);
    }, [navigate]);

    return {
        initialCustomerTypeForm,
        customerTypes,
        customerTypeSelected,
        handleGetCustomerTypes,
        handleSaveCustomerType,
        handleCustomerTypeEdit,
        handleSelectCustomerType,
        handleResetCustomerTypeSelection,
        handleCancel,
    }
}
