import {customerApi} from "../apis/customerApi.js";

class CustomerService {
    async getAllCustomers() {
        try {
            return await customerApi.get("/all");
        } catch (error) {
            console.error("Error fetching customers:", error);
            throw error;
        }
    }

    async saveCustomer(customerData) {
        try {
            return await customerApi.post("/save", customerData);
        } catch (error) {
            console.error("Error saving customer:", error);
            throw error;
        }
    }

    async updateCustomer(id, customerData) {
        try {
            return await customerApi.put(`/update/${id}`, customerData);
        } catch (error) {
            console.error("Error updating customer:", error);
            throw error;
        }
    }

    async changeCustomerStatus(id, statusData) {
        try {
            return await customerApi.put(`/change-status/${id}`, statusData);
        } catch (error) {
            console.error("Error changing customer status:", error);
            throw error;
        }
    }
}

export const customerService = new CustomerService();
