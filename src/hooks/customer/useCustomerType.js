import {useDispatch, useSelector} from "react-redux";
import {useApiErrorHandler} from "../useApiErrorHandler.js";
import {useNavigate} from "react-router-dom";
import {customerTypeService} from "../../services/customerTypeService.js";
import {
    onCreateCustomerType,
    onUpdateCustomerType,
    resetCustomerTypeSelected,
    setCustomerTypes,
    setCustomerTypeSelected
} from "../../stores/slices/customer/customerTypeSlice.js";

export const useCustomerType = () => {
    const {customerTypes, customerTypeSelected} = useSelector(state => state.customerType);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {handleApiError} = useApiErrorHandler();

    const handleGetCustomerTypes = async () => {
        try {
            const response = await customerTypeService.getAllCustomerTypes();
            dispatch(setCustomerTypes(response));
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleCustomerTypeFormSubmit = async (customerTypeData) => {
        try {
            let response;
            if (customerTypeData.id === 0) {
                response = await customerTypeService.saveCustomerType(customerTypeData);
                dispatch(onCreateCustomerType(response));
            } else {
                response = await customerTypeService.updateCustomerType(customerTypeData);
                dispatch(onUpdateCustomerType(response));
            }
            navigate("/customer-types");
        } catch (error) {
            handleApiError(error);
        }
    };

    const handleCustomerTypeEdit = (customerType) => {
        dispatch(setCustomerTypeSelected(customerType));
        navigate(`/customer-type/edit/${customerType.id}`);
    };

    const handleCustomerTypeReset = () => {
        dispatch(resetCustomerTypeSelected());
    };

    return {
        customerTypes,
        customerTypeSelected,
        handleGetCustomerTypes,
        handleCustomerTypeFormSubmit,
        handleCustomerTypeEdit,
        handleCustomerTypeReset
    };
};
