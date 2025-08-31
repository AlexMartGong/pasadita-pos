import {customerTypeApi} from "../apis/customerTypeApi.js";

class CustomerTypeService {
    // Get all customer types
    async getAllCustomerTypes() {
        try {
            const response = await customerTypeApi.get("/all");
            return response.data;
        } catch (error) {
            console.error('Error fetching customer types:', error);
            throw error;
        }
    }

    // Save a new customer type
    async saveCustomerType(customerTypeData) {
        try {
            const response = await customerTypeApi.post("/save", customerTypeData);
            return response.data;
        } catch (error) {
            console.error('Error saving customer type:', error);
            throw error;
        }
    }

    // Update customer type
    async updateCustomerType(customerTypeData) {
        try {
            const response = await customerTypeApi.put("/update", customerTypeData);
            return response.data;
        } catch (error) {
            console.error('Error updating customer type:', error);
            throw error;
        }
    }
}

export const customerTypeService = new CustomerTypeService();
