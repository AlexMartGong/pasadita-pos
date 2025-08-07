import {userApi} from '../apis/userApi.js';

// Get all employees
export const getAllEmployees = async () => {
    try {
        return await userApi.get('/all');
    } catch (error) {
        console.error('Error fetching all employees:', error);
        throw error;
    }
};

// Get employee by ID
export const getEmployeeById = async (id) => {
    try {
        const response = await userApi.get(`/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching employee by ID:', error);
        throw error;
    }
};

// Save new employee
export const saveEmployee = async ({username, phone, active, fullName, password, position}) => {
    try {
        return await userApi.post('/save', {
            username,
            phone,
            active,
            fullName,
            password,
            position,
        });
    } catch (error) {
        console.error('Error saving employee:', error);
        throw error;
    }
};

// Update employee
export const updateEmployee = async ({id, username, phone, active, fullName, position}) => {
    try {
        return await userApi.put(`/${id}`, {
            username,
            phone,
            active,
            fullName,
            position,
        });
    } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
    }
};

// Delete employee
export const deleteEmployee = async (id) => {
    try {
        const response = await userApi.delete(`/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
    }
};

// Search employee by username
export const searchEmployee = async (username) => {
    try {
        const response = await userApi.get('/search', {
            params: {username}
        });
        return response.data;
    } catch (error) {
        console.error('Error searching employee:', error);
        throw error;
    }
};

// Change employee password
export const changePassword = async (id, passwordData) => {
    try {
        const response = await userApi.put(`/change-password/${id}`, passwordData);
        return response.data;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
};

// Change employee status
export const changeStatus = async (id, statusData) => {
    try {
        const response = await userApi.put(`/change-status/${id}`, statusData);
        return response.data;
    } catch (error) {
        console.error('Error changing status:', error);
        throw error;
    }
};

// Check if employee exists by ID
export const checkEmployeeExists = async (id) => {
    try {
        await getEmployeeById(id);
        return true;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return false;
        }
        throw error;
    }
};

// Export all functions as default object for easier importing
const userService = {
    getAllEmployees,
    getEmployeeById,
    saveEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployee,
    changePassword,
    changeStatus,
    checkEmployeeExists
};

export default userService;
