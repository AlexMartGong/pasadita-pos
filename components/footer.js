/**
 * Componente Footer para la aplicación La Pasadita POS
 * Renderiza el pie de página en todas las vistas
 */

/**
 * Renderiza el footer con información de copyright y enlaces útiles
 * @returns {HTMLElement} - Elemento del footer
 */
function renderFooter() {
    const currentYear = new Date().getFullYear();
    const footerElement = document.createElement('footer');
    footerElement.className = 'footer mt-auto py-3 bg-light';

    footerElement.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <p class="col-md-9 col-lg-10 ms-sm-auto px-md-4">&copy; ${currentYear} La Pasadita. Todos los derechos reservados.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <span class="text-muted">Versión 1.0.0</span>
                </div>
            </div>
        </div>
    `;

    return footerElement;
}

/**
 * Inicializa el footer en la página actual
 * @param {string} containerId - ID del contenedor donde se insertará el footer
 */
function initFooter(containerId = 'footerContainer') {
    const container = document.getElementById(containerId);

    if (container) {
        container.appendChild(renderFooter());
    } else {
        // Si no hay un contenedor específico, añadir al final del body
        const footer = renderFooter();

        // Verificar si ya existe un footer para no duplicarlo
        const existingFooter = document.querySelector('footer');
        if (existingFooter) {
            existingFooter.parentNode.replaceChild(footer, existingFooter);
        } else {
            document.body.appendChild(footer);
        }
    }

    // Asegurar que el body tenga la clase necesaria para el sticky footer
    document.body.classList.add('d-flex', 'flex-column', 'min-vh-100');

    // Asegurar que el contenido principal tenga flex-grow para empujar el footer al fondo
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('flex-grow-1');
    }
}

// Exportar funciones
window.PasaditaPOS = window.PasaditaPOS || {};
window.PasaditaPOS.Footer = {
    init: initFooter,
    render: renderFooter
};