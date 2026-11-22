import {createApiClient} from "./apiClient.js";

const customerTypeApi = createApiClient('/api/customer-types');

export {customerTypeApi};
