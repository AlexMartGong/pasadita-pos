import {createApiClient} from "./apiClient.js";

// Endpoints de CustomerAccountController: cruzan /delivery-orders, /customers y /sales, por eso la base es /api.
const customerAccountApi = createApiClient('/api');

export {customerAccountApi};
