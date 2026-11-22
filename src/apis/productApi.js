import {createApiClient} from "./apiClient.js";

const productApi = createApiClient('/api/products');

export {productApi};
