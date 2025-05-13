/**
 * Componente Header para la aplicación La Pasadita POS
 * Renderiza la barra de navegación superior en todas las páginas
 */
function renderHeader(pageTitle) {
    const headerElement = document.createElement('div');
    headerElement.className = 'd-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom';

    headerElement.innerHTML = `
        <h1 class="h2">${pageTitle || 'La Pasadita'}</h1>
        <div class="btn-toolbar mb-2 mb-md-0">
            <div class="dropdown me-2">
                <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="userMenuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <span id="currentUsername">Usuario</span>
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuDropdown">
                    <li><a class="dropdown-item" href="#" data-action="profile">Mi Perfil</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" data-action="logout">Cerrar Sesión</a></li>
                </ul>
            </div>
            <button type="button" class="btn btn-sm btn-outline-secondary d-md-none" data-bs-toggle="collapse" data-bs-target="#sidebar">
                Menú
            </button>
        </div>
    `;

    return headerElement;
}

/**
 * Inicializa el header en la página actual
 * @param {string} pageTitle - Título de la página
 * @param {string} containerId - ID del contenedor donde se insertará el header
 */
function initHeader(pageTitle, containerId = 'headerContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return;
    }

    container.appendChild(renderHeader(pageTitle));

    // Cargar nombre de usuario si está disponible
    try {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Extraer el nombre de usuario del token o hacer una llamada API si es necesario
            // Para el ejemplo, usamos un nombre fijo
            document.getElementById('currentUsername').textContent = 'Empleado';
        }
    } catch (error) {
        console.error('Error loading user information', error);
    }
}

// Exportar funciones
window.PasaditaPOS = window.PasaditaPOS || {};
window.PasaditaPOS.Header = {
    init: initHeader,
    render: renderHeader
};