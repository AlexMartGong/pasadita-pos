import {createApiClient} from "./apiClient.js";

const salePaymentApi = createApiClient('/api/sale-payments');

export {salePaymentApi};
