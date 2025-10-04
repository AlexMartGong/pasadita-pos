import {saleApi} from '../apis/saleApi.js';

// Get all sales
export const getAllSales = async () => {
    try {
        return await saleApi.get('/all');
    } catch (error) {
        console.error('Error fetching all sales:', error);
        throw error;
    }
};

// Save new sale
export const saveSale = async (saleCreateDto) => {
    try {
        return await saleApi.post('/save', saleCreateDto);
    } catch (error) {
        console.error('Error saving sale:', error);
        throw error;
    }
};

// Update sale
export const updateSale = async (id, saleUpdateDto) => {
    try {
        return await saleApi.put(`/update/${id}`, saleUpdateDto);
    } catch (error) {
        console.error('Error updating sale:', error);
        throw error;
    }
};

// Export all functions as default object for easier importing
const saleService = {
    getAllSales,
    saveSale,
    updateSale
};

export default saleService;
