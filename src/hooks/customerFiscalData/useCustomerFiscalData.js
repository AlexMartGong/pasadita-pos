import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";
import {
    initialCustomerFiscalDataForm,
    onCreateCustomerFiscalData,
    onUpdateCustomerFiscalData,
    setCustomerFiscalDataList,
    setCustomerFiscalDataSelected,
    resetCustomerFiscalDataSelected
} from "../../stores/slices/customerFiscalData/customerFiscalDataSlice.js";
import {toast} from "react-toastify";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {customerFiscalDataService} from "../../services/customerFiscalDataService.js";
import {useNavigate} from "react-router-dom";

export const useCustomerFiscalData = () => {
    const {customerFiscalDataList, customerFiscalDataSelected} = useSelector(state => state.customerFiscalData);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGetAllFiscalData = useCallback(async () => {
        try {
            const result = await customerFiscalDataService.getAllFiscalData();
            if (result.status === 200) {
                dispatch(setCustomerFiscalDataList(result.data));
            } else {
                toast.error('Error al obtener los datos fiscales.');
            }
        } catch (error) {
            console.error('Error fetching all fiscal data:', error);
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

    const handleGetFiscalDataById = useCallback(async (id) => {
        try {
            const result = await customerFiscalDataService.getFiscalDataById(id);
            if (result.status === 200) {
                return result.data;
            }
            toast.error('Datos fiscales no encontrados.');
            return null;
        } catch (error) {
            console.error('Error fetching fiscal data by id:', error);
            handleApiError(error);
            return null;
        }
    }, [handleApiError]);

    const handleGetFiscalDataByRfc = useCallback(async (rfc) => {
        try {
            const result = await customerFiscalDataService.getFiscalDataByRfc(rfc);
            if (result.status === 200) {
                return result.data;
            }
            toast.error('Datos fiscales no encontrados para el RFC proporcionado.');
            return null;
        } catch (error) {
            console.error('Error fetching fiscal data by RFC:', error);
            handleApiError(error);
            return null;
        }
    }, [handleApiError]);

    const handleSaveFiscalData = useCallback(async (fiscalData) => {
        let result;
        try {
            if (fiscalData.fiscalId === 0) {
                result = await customerFiscalDataService.saveFiscalData(fiscalData);
                dispatch(onCreateCustomerFiscalData(result.data));
            } else {
                result = await customerFiscalDataService.updateFiscalData(fiscalData.fiscalId, fiscalData);
                dispatch(onUpdateCustomerFiscalData(result.data));
            }
            if (result.status === 201 || result.status === 200) {
                toast.success('Datos fiscales guardados exitosamente.');
            } else {
                toast.error('Error al guardar los datos fiscales.');
            }
            return true;
        } catch (error) {
            console.error('Error saving fiscal data:', error);
            handleApiError(error);
            return false;
        }
    }, [handleApiError, dispatch]);

    const handleSelectFiscalData = useCallback((fiscalData) => {
        dispatch(setCustomerFiscalDataSelected(fiscalData));
    }, [dispatch]);

    const handleResetFiscalDataSelection = useCallback(() => {
        dispatch(resetCustomerFiscalDataSelected());
    }, [dispatch]);

    const handleCancel = useCallback(() => {
        navigate('/customer-fiscal-data');
    }, [navigate]);

    const handleFiscalDataEdit = useCallback((id) => {
        navigate(`/customer-fiscal-data/edit/${id}`);
    }, [navigate]);

    return {
        initialCustomerFiscalDataForm,
        customerFiscalDataList,
        customerFiscalDataSelected,
        handleGetAllFiscalData,
        handleGetFiscalDataById,
        handleGetFiscalDataByRfc,
        handleSaveFiscalData,
        handleSelectFiscalData,
        handleResetFiscalDataSelection,
        handleFiscalDataEdit,
        handleCancel,
    }
}
