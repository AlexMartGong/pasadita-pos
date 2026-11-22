import {createApiClient} from "./apiClient.js";

const deliveryOrderApi = createApiClient('/api/delivery-orders');

export {deliveryOrderApi};
