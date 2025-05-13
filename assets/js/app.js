function initApp() {
    setupEventListeners();
    const currentPath = window.location.pathname;
    loadSidebar();
    console.log('Aplicación inicializada');
}

function setupEventListeners() {
    document.addEventListener('click', function(e) {
        if (e.target && e.target.matches('[data-action="logout"]')) {
            logout();
        }
    });
}

function loadSidebar() {
    const userRole = getUserRole();

    if (userRole === 'ROLE_ADMIN') {
        document.querySelectorAll('.admin-only').forEach(item => {
            item.classList.remove('d-none');
        });
    }
}

function getUserRole() {
    return 'ROLE_ADMIN';
}

document.addEventListener('DOMContentLoaded', initApp);