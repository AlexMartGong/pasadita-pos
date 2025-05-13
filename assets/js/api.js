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

            return await response.json();
        } catch (error) {
            console.error(`Error in API request to ${endpoint}:`, error);
            throw error;
        }
    }

    // Métodos específicos para cada entidad

    // Empleados
    async getAllEmployees() {
        return this.request('employees/all');
    }

    async saveEmployee(employee) {
        return this.request('employees/save', 'POST', employee);
    }

    // Aquí irían más métodos para otras entidades (productos, pedidos, etc.)
}

// Crear instancia global de la API
const api = new ApiService();