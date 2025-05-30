/**
 * Archivo principal de la aplicación La Pasadita POS
 * Encargado de inicializar componentes y eventos globales
 */

// Objeto global para la aplicación
window.PasaditaPOS = window.PasaditaPOS || {};

/**
 * Inicializa la aplicación
 */
function initApp() {
    // Verificar autenticación
    if (!isAuthenticated()) {
        window.location.href = getBasePath() + 'pages/login.html';
        return;
    }

    setupEventListeners();
    loadPageComponents();
    console.log('Aplicación inicializada');
}

/**
 * Configura los escuchadores de eventos globales
 */
function setupEventListeners() {
    // Delegación de eventos para botones de cerrar sesión
    document.addEventListener('click', function (e) {
        if (e.target && e.target.closest('[data-action="logout"]')) {
            e.preventDefault();
            logout();
        }
    });
}

/**
 * Carga los componentes comunes (Header, Sidebar, Footer) en la página actual
 */
function loadPageComponents() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop().split('.')[0];

    // Preparar contenedores si no existen
    prepareContainers();

    // Cargar componentes si existen en la ventana global
    if (window.PasaditaPOS.Header && typeof window.PasaditaPOS.Header.init === 'function') {
        window.PasaditaPOS.Header.init(getPageTitle());
    }

    if (window.PasaditaPOS.Sidebar && typeof window.PasaditaPOS.Sidebar.init === 'function') {
        window.PasaditaPOS.Sidebar.init(pageName);
    }

    if (window.PasaditaPOS.Footer && typeof window.PasaditaPOS.Footer.init === 'function') {
        window.PasaditaPOS.Footer.init();
    }

    // Ajustar permisos según rol del usuario
    adjustForUserRole();
}

/**
 * Prepara los contenedores para los componentes si no existen
 */
function prepareContainers() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;

    // Preparar contenedor para el header si no existe
    if (!document.getElementById('headerContainer')) {
        const headerContainer = document.createElement('div');
        headerContainer.id = 'headerContainer';
        mainContent.prepend(headerContainer);
    }

    // No preparamos contenedor para el sidebar porque normalmente
    // está definido directamente en la estructura HTML de la página

    // Preparar contenedor para el footer si no existe
    if (!document.getElementById('footerContainer')) {
        const footerContainer = document.createElement('div');
        footerContainer.id = 'footerContainer';
        document.body.appendChild(footerContainer);
    }
}

/**
 * Obtiene el título de la página actual
 * @returns {string} Título de la página
 */
function getPageTitle() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop().split('.')[0];

    const pageTitles = {
        'dashboard': 'Dashboard',
        'pos': 'Punto de Venta',
        'products': 'Productos',
        'employees': 'Empleados',
        'orders': 'Pedidos',
        'reports': 'Reportes'
    };

    return pageTitles[pageName] || 'La Pasadita POS';
}

/**
 * Ajusta la interfaz según el rol del usuario
 */
function adjustForUserRole() {
    const userRole = getUserRole();

    if (userRole === 'ROLE_ADMIN') {
        document.querySelectorAll('.admin-only').forEach(item => {
            item.classList.remove('d-none');
        });
    } else {
        document.querySelectorAll('.admin-only').forEach(item => {
            item.classList.add('d-none');
        });
    }

    // Elementos específicos para cajeros
    if (userRole === 'ROLE_CAJERO') {
        document.querySelectorAll('.cashier-only').forEach(item => {
            item.classList.remove('d-none');
        });
    }
}

/**
 * Obtiene el rol del usuario actual
 * @returns {string} Rol del usuario
 */
function getUserRole() {
    // En una implementación real, obtendríamos esto del token JWT
    // Para este ejemplo, retornamos un rol fijo
    return 'ROLE_ADMIN';
}

/**
 * Obtiene la ruta base de la aplicación
 * @returns {string} Ruta base
 */
function getBasePath() {
    const pathParts = window.location.pathname.split('/');
    let basePath = '';

    // Si estamos en una subcarpeta como /pages/, retroceder un nivel
    if (pathParts.includes('pages')) {
        const pagesIndex = pathParts.indexOf('pages');
        basePath = pathParts.slice(0, pagesIndex).join('/') + '/';
    }

    return basePath;
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);

// Exponer funciones globalmente
window.PasaditaPOS.App = {
    init: initApp
};