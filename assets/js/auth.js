// Funciones para manejar autenticación con JWT

// Guardar el token JWT en localStorage
function saveAuthToken(token) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('authTimestamp', Date.now().toString());
}

// Obtener el token JWT de localStorage
function getAuthToken() {
    return localStorage.getItem('authToken');
}

// Verificar si el usuario está autenticado
function isAuthenticated() {
    const token = getAuthToken();
    const timestamp = localStorage.getItem('authTimestamp');

    if (!token || !timestamp) {
        return false;
    }

    // Verificar si el token ha expirado (24 horas)
    const now = Date.now();
    const elapsed = now - parseInt(timestamp);
    const dayInMillis = 24 * 60 * 60 * 1000; // 24 horas

    return elapsed < dayInMillis;
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTimestamp');
    window.location.href = '../pages/login.html';
}

// Función para iniciar sesión
async function login(username, password) {
    try {
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}