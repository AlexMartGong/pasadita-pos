/**
 * Componente Sidebar para la aplicación La Pasadita POS
 * Renderiza el menú lateral en todas las páginas
 */

// Configuración de los menús según el rol
const menuItems = {
    // Menú completo para administradores
    'ROLE_ADMIN': [
        {id: 'dashboard', text: 'Dashboard', icon: 'bi bi-speedometer2', url: 'dashboard.html'},
        {id: 'pos', text: 'Punto de Venta', icon: 'bi bi-cart3', url: 'pos.html'},
        {id: 'products', text: 'Productos', icon: 'bi bi-box', url: 'products.html'},
        {id: 'employees', text: 'Empleados', icon: 'bi bi-people', url: 'employees.html'},
        {id: 'orders', text: 'Pedidos', icon: 'bi bi-list-check', url: 'orders.html'},
        {id: 'reports', text: 'Reportes', icon: 'bi bi-bar-chart', url: 'reports.html'}
    ],
    // Menú para cajeros
    'ROLE_CAJERO': [
        {id: 'dashboard', text: 'Dashboard', icon: 'bi bi-speedometer2', url: 'dashboard.html'},
        {id: 'pos', text: 'Punto de Venta', icon: 'bi bi-cart3', url: 'pos.html'},
        {id: 'orders', text: 'Pedidos', icon: 'bi bi-list-check', url: 'orders.html'}
    ],
    // Menú para personal de pedidos
    'ROLE_PEDIDOS': [
        {id: 'dashboard', text: 'Dashboard', icon: 'bi bi-speedometer2', url: 'dashboard.html'},
        {id: 'orders', text: 'Pedidos', icon: 'bi bi-list-check', url: 'orders.html'}
    ]
};

/**
 * Renderiza el sidebar basado en el rol del usuario
 * @param {string} activeItemId - ID del ítem de menú activo
 * @param {string} userRole - Rol del usuario actual
 * @returns {HTMLElement} - Elemento del sidebar
 */
function renderSidebar(activeItemId = '', userRole = 'ROLE_ADMIN') {
    const sidebarElement = document.createElement('div');
    sidebarElement.className = 'col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse';
    sidebarElement.id = 'sidebar';

    // Obtener los ítems de menú según el rol
    const items = menuItems[userRole] || menuItems['ROLE_ADMIN'];

    // Construir el HTML del sidebar
    let menuHTML = `
        <div class="position-sticky pt-3">
            <div class="text-center mb-4">
                <h4 class="text-white">La Pasadita</h4>
            </div>
            <ul class="nav flex-column">
    `;

    // Agregar cada ítem de menú
    items.forEach(item => {
        const isActive = item.id === activeItemId ? 'active' : '';
        menuHTML += `
            <li class="nav-item">
                <a class="nav-link ${isActive} text-white" href="${item.url}">
                    <i class="${item.icon} me-2"></i>
                    ${item.text}
                </a>
            </li>
        `;
    });

    // Agregar opción de cerrar sesión
    menuHTML += `
            <li class="nav-item mt-5">
                <a class="nav-link text-white" href="#" data-action="logout">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Cerrar Sesión
                </a>
            </li>
        </ul>
    </div>
    `;

    sidebarElement.innerHTML = menuHTML;
    return sidebarElement;
}

/**
 * Inicializa el sidebar en la página actual
 * @param {string} activeItemId - ID del ítem de menú activo
 * @param {string} containerId - ID del contenedor donde se insertará el sidebar
 */
function initSidebar(activeItemId, containerId = 'sidebarContainer') {
    // Detectar el rol del usuario desde localStorage o una variable global
    let userRole = 'ROLE_ADMIN'; // Por defecto

    try {
        // En una implementación real, obtendríamos el rol del token JWT o de una variable global
        // Para este ejemplo, simplemente usamos el rol de administrador
        const sidebar = renderSidebar(activeItemId, userRole);

        // Si existe un contenedor específico, insertarlo ahí
        const container = document.getElementById(containerId);
        if (container) {
            container.appendChild(sidebar);
        } else {
            // Si no existe el contenedor, buscar el primer elemento de la fila
            const rowElement = document.querySelector('.row');
            if (rowElement) {
                rowElement.insertBefore(sidebar, rowElement.firstChild);
            } else {
                console.error('No se encontró contenedor para el sidebar');
            }
        }
    } catch (error) {
        console.error('Error al inicializar el sidebar:', error);
    }
}

// Exportar funciones
window.PasaditaPOS = window.PasaditaPOS || {};
window.PasaditaPOS.Sidebar = {
    init: initSidebar,
    render: renderSidebar
};