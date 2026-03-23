import {useDispatch, useSelector} from "react-redux";
import {useCallback, useEffect} from "react";
import {setDashboardData, setDashboardError, setDashboardLoading} from "../../stores/slices/dashboard/dashboardSlice.js";
import dashboardService from "../../services/dashboardService.js";
import {useApiErrorHandler} from "../useApiErrorHandler.js";

export const useDashboard = () => {
    const {data, loading, error} = useSelector(state => state.dashboard);
    const {handleApiError} = useApiErrorHandler();
    const dispatch = useDispatch();

    const handleGetDashboard = useCallback(async (startDate, endDate) => {
        dispatch(setDashboardLoading());
        try {
            const result = await dashboardService.getDashboardData(startDate, endDate);
            console.log('Dashboard data:', result);
            if (result.status === 200) {
                dispatch(setDashboardData(result.data));
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
            dispatch(setDashboardError(error.message));
            handleApiError(error);
        }
    }, [dispatch, handleApiError]);

    useEffect(() => {
        handleGetDashboard();
    }, []);

    return {
        data,
        loading,
        error,
        handleGetDashboard,
    };
};
