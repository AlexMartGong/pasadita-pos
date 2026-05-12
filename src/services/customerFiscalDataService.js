import {customerFiscalDataApi} from "../apis/customerFiscalDataApi.js";

class CustomerFiscalDataService {
    async getAllFiscalData() {
        try {
            return await customerFiscalDataApi.get("/all");
        } catch (error) {
            console.error("Error fetching fiscal data list:", error);
            throw error;
        }
    }

    async getFiscalDataById(id) {
        try {
            return await customerFiscalDataApi.get(`/${id}`);
        } catch (error) {
            console.error("Error fetching fiscal data by id:", error);
            throw error;
        }
    }

    async getFiscalDataByRfc(rfc) {
        try {
            return await customerFiscalDataApi.get(`/by-rfc/${rfc}`);
        } catch (error) {
            console.error("Error fetching fiscal data by RFC:", error);
            throw error;
        }
    }

    async saveFiscalData(fiscalData) {
        try {
            return await customerFiscalDataApi.post("/save", fiscalData);
        } catch (error) {
            console.error("Error saving fiscal data:", error);
            throw error;
        }
    }

    async updateFiscalData(id, fiscalData) {
        try {
            return await customerFiscalDataApi.put(`/update/${id}`, fiscalData);
        } catch (error) {
            console.error("Error updating fiscal data:", error);
            throw error;
        }
    }
}

export const customerFiscalDataService = new CustomerFiscalDataService();
