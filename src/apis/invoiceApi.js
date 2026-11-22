import {createApiClient} from "./apiClient.js";

const invoiceApi = createApiClient('/api/invoices');

export {invoiceApi};
