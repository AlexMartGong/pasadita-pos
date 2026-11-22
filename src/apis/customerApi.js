import {createApiClient} from "./apiClient.js";

const customerApi = createApiClient('/api/customers');

export {customerApi};
