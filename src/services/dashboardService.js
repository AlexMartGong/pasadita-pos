import {dashboardApi} from '../apis/dashboardApi.js';

export const getDashboardData = async (startDate, endDate) => {
    try {
        return await dashboardApi.get('', {
            params: {startDate, endDate}
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
    }
};

const dashboardService = {
    getDashboardData,
};

export default dashboardService;
