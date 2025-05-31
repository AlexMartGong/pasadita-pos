// Clase para manejar las llamadas a la API
class ApiService {
    constructor(baseUrl = 'http://localhost:8080/api') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}/${endpoint}`;
        const token = getAuthToken();

        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);

            // Si el token expiró, redirigir al login
            if (response.status === 401) {
                logout();
                return null;
            }

            // Para métodos DELETE exitosos, retornar true
            if (method === 'DELETE' && response.ok) {
                return true;
            }

            // Si la respuesta está vacía pero fue exitosa, retornar true
            if (response.ok && response.status === 204) {
                return true;
            }

            // Si hay contenido, parsearlo como JSON
            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }
                return true;
            }

            // Si hay error, intentar extraer el mensaje de error
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    errorData = {message: `HTTP Error ${response.status}`};
                }
                throw new Error(errorData.message || `HTTP Error ${response.status}`);
            }

        } catch (error) {
            console.error(`Error in API request to ${endpoint}:`, error);
            throw error;
        }
    }

    /**
     * Obtiene todos los empleados
     */
    async getAllEmployees() {
        return this.request('employees/all');
    }

    /**
     * Obtiene un empleado por ID
     */
    async getEmployee(id) {
        return this.request(`employees/${id}`);
    }

    /**
     * Guarda un nuevo empleado
     */
    async saveEmployee(employee) {
        return this.request('employees/save', 'POST', employee);
    }

    /**
     * Actualiza un empleado existente
     */
    async updateEmployee(id, employee) {
        return this.request(`employees/${id}`, 'PUT', employee);
    }

    /**
     * Elimina un empleado
     */
    async deleteEmployee(id) {
        return this.request(`employees/delete/${id}`, 'DELETE');
    }

    /**
     * Busca un empleado por username
     */
    async searchEmployee(username) {
        return this.request(`employees/search?username=${encodeURIComponent(username)}`);
    }

    /**
     * Verifica si un username ya existe
     */
    async checkUsernameExists(username) {
        try {
            await this.searchEmployee(username);
            return true; // Si no hay error, el usuario existe
        } catch (error) {
            return false; // Si hay error 404, el usuario no existe
        }
    }

    /**
     * Cabia el password de un empleado
     */
    async changePassword(employeeId, newPassword) {
        return this.request(`employees/change-password/${employeeId}`, 'PUT', {password: newPassword});
    }

    /**
     * Cambia el estado de un empleado
     */
    async changeEmployeeStatus(employeeId, active) {
        return this.request(`employees/change-status/${employeeId}`, 'PUT', {active: active});
    }

    // =========================
    // MÉTODOS DE UTILIDAD
    // =========================

    /**
     * Verifica la conectividad con el servidor
     */
    async ping() {
        try {
            const response = await fetch(`${this.baseUrl.replace('/api', '')}/actuator/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene información del usuario actual
     */
    async getCurrentUser() {
        // Este método dependería de la implementación del backend
        // Por ahora, extraemos la info del token
        const token = getAuthToken();
        if (!token) return null;

        try {
            // Decodificar el payload del JWT (sin verificar la firma)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                username: payload.sub,
                authorities: payload.authorities,
                exp: payload.exp
            };
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Maneja errores comunes de la API
     */
    handleError(error) {
        if (error.response) {
            // El servidor respondió con un status de error
            const status = error.response.status;
            const message = error.response.data?.message || error.message;

            switch (status) {
                case 400:
                    console.error('Bad Request:', message);
                    break;
                case 401:
                    console.error('Unauthorized:', message);
                    logout();
                    break;
                case 403:
                    console.error('Forbidden:', message);
                    break;
                case 404:
                    console.error('Not Found:', message);
                    break;
                case 500:
                    console.error('Internal Server Error:', message);
                    break;
                default:
                    console.error(`HTTP Error ${status}:`, message);
            }

            return {status, message};
        } else if (error.request) {
            // La petición se hizo pero no se recibió respuesta
            console.error('Network Error:', error.message);
            return {status: 0, message: 'Error de conexión'};
        } else {
            // Algo más causó el error
            console.error('Error:', error.message);
            return {status: -1, message: error.message};
        }
    }
}

// Crear instancia global de la API
const api = new ApiService();

// Exponer globalmente para compatibilidad
window.api = api;