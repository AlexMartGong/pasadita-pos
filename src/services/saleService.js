import {saleApi} from '../apis/saleApi.js';

export const getAllSales = async () => {
    try {
        return await saleApi.get('/all');
    } catch (error) {
        console.error('Error fetching all sales:', error);
        throw error;
    }
};

export const saveSale = async (saleCreateDto) => {
    try {
        return await saleApi.post('/save', saleCreateDto);
    } catch (error) {
        console.error('Error saving sale:', error);
        throw error;
    }
};

export const updateSale = async (id, saleUpdateDto) => {
    try {
        return await saleApi.put(`/update/${id}`, saleUpdateDto);
    } catch (error) {
        console.error('Error updating sale:', error);
        throw error;
    }
};

export const getSaleById = async (id) => {
    try {
        return await saleApi.get(`/${id}`);
    } catch (error) {
        console.error('Error fetching sale by ID:', error);
        throw error;
    }
}

export const getSaleDetailsById = async (id) => {
    try {
        return await saleApi.get(`/${id}/details`);
    } catch (error) {
        console.error('Error fetching sale details by ID:', error);
        throw error;
    }
}

export const changeStatusSale = async (id, statusData) => {
    try {
        return await saleApi.put(`/change-status/${id}`, statusData);
    } catch (error) {
        console.error('Error changing status:', error);
        throw error;
    }
}

export const getTicketBySaleId = async (id) => {
    try {
        return await saleApi.get(`/${id}/ticket`);
    } catch (error) {
        console.error('Error fetching ticket by sale ID:', error);
        throw error;
    }
}

const saleService = {
    getAllSales,
    saveSale,
    updateSale,
    changeStatusSale,
    getSaleById,
    getSaleDetailsById,
    getTicketBySaleId,
};

export default saleService;
