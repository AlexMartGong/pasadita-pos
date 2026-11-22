import {createApiClient} from "./apiClient.js";

const dashboardApi = createApiClient('/api/dashboard', {timeout: 15000});

export {dashboardApi};
