import {createApiClient} from "./apiClient.js";

const userApi = createApiClient('/api/employees');

export {userApi};
