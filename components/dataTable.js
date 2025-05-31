/**
 * Componente DataTable para la aplicación La Pasadita POS
 * Maneja la inicialización y configuración de tablas con DataTables
 */

class DataTableManager {
    constructor() {
        this.tables = new Map();
        this.defaultConfig = {
            responsive: true,
            pageLength: 25,
            order: [[0, "desc"]],
            pagingType: "simple_numbers",
            lengthMenu: [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
            language: {
                // Configuración completa en español
                decimal: "",
                emptyTable: "No hay datos disponibles en la tabla",
                info: "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                infoEmpty: "Mostrando 0 a 0 de 0 entradas",
                infoFiltered: "(filtrado de _MAX_ entradas totales)",
                infoPostFix: "",
                thousands: ",",
                lengthMenu: "Mostrar _MENU_ entradas",
                loadingRecords: "Cargando...",
                processing: "Procesando...",
                search: "Buscar:",
                zeroRecords: "No se encontraron registros coincidentes",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                },
                aria: {
                    sortAscending: ": activar para ordenar la columna de manera ascendente",
                    sortDescending: ": activar para ordenar la columna de manera descendente"
                }
            },
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>' +
                '<"row"<"col-sm-12"tr>>' +
                '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            processing: true,
            autoWidth: false,
            stateSave: false,
            deferRender: true,
            columnDefs: [
                {className: "text-center", targets: "_all"}
            ]
        };
    }

    /**
     * Inicializa una tabla con DataTables
     * @param {string} selector - Selector CSS de la tabla
     * @param {Object} customConfig - Configuración personalizada
     * @returns {Object|null} - Instancia de DataTable o null
     */
    initTable(selector, customConfig = {}) {
        try {
            // Verificar que jQuery y DataTables estén disponibles
            if (typeof $ === 'undefined') {
                console.error('jQuery no está disponible. Asegúrate de cargar jQuery antes que DataTables.');
                return null;
            }

            if (!$.fn.DataTable) {
                console.error('DataTables no está disponible. Verifica que las librerías estén cargadas correctamente.');
                return null;
            }

            const $table = $(selector);
            if (!$table.length) {
                console.warn(`Tabla no encontrada con selector: ${selector}`);
                return null;
            }

            // Verificar que la tabla tenga la estructura correcta
            if (!$table.find('thead').length) {
                console.warn(`La tabla ${selector} no tiene elemento <thead>. DataTables podría no funcionar correctamente.`);
            }

            // Destruir tabla existente si existe
            this.destroyTable(selector);

            // Combinar configuraciones
            const config = {...this.defaultConfig, ...customConfig};

            // Agregar manejo de errores
            config.error = function (xhr, error, code) {
                console.error('Error en DataTable:', error, code);
            };

            // Inicializar DataTable
            const table = $table.DataTable(config);

            // Guardar referencia
            this.tables.set(selector, table);

            console.log(`DataTable inicializada exitosamente: ${selector}`);

            // Agregar evento para redimensionar columnas cuando se muestre la tabla
            table.columns.adjust().responsive.recalc();

            return table;

        } catch (error) {
            console.error('Error al inicializar DataTable:', error);
            console.error('Selector:', selector);
            console.error('Configuración:', customConfig);
            return null;
        }
    }

    /**
     * Destruye una tabla DataTable
     * @param {string} selector - Selector CSS de la tabla
     */
    destroyTable(selector) {
        try {
            if ($.fn.DataTable && $.fn.DataTable.isDataTable(selector)) {
                $(selector).DataTable().destroy();
                this.tables.delete(selector);
                console.log(`DataTable destruida: ${selector}`);
            }
        } catch (error) {
            console.error('Error al destruir DataTable:', error);
        }
    }

    /**
     * Obtiene una instancia de DataTable
     * @param {string} selector - Selector CSS de la tabla
     * @returns {Object|null} - Instancia de DataTable o null
     */
    getTable(selector) {
        return this.tables.get(selector) || null;
    }

    /**
     * Recarga los datos de una tabla
     * @param {string} selector - Selector CSS de la tabla
     */
    reloadTable(selector) {
        const table = this.getTable(selector);
        if (table) {
            table.ajax.reload();
        }
    }

    /**
     * Configuración predefinida para tabla de empleados
     */
    getEmployeesConfig() {
        return {
            columnDefs: [
                {searchable: true, targets: [0, 1, 2]}, // ID, Nombre, Usuario
                {searchable: false, targets: [3, 4, 5]}, // Posición, Teléfono, Acciones
                {orderable: false, targets: [5]}, // Columna de acciones
                {className: "text-center", targets: [0, 3, 4, 5]},
                {className: "text-start", targets: [1, 2]}
            ],
            language: {
                ...this.defaultConfig.language,
                emptyTable: "No hay empleados registrados"
            },
            order: [[0, "desc"]]
        };
    }

    /**
     * Configuración predefinida para tabla de productos
     */
    getProductsConfig() {
        return {
            columnDefs: [
                {searchable: true, targets: [0, 1, 2]}, // ID, Nombre, Categoría
                {searchable: false, targets: [3, 4, 5]}, // Precio, Stock, Acciones
                {orderable: false, targets: [5]}, // Columna de acciones
                {className: "text-center", targets: [0, 3, 4, 5]},
                {className: "text-start", targets: [1, 2]}
            ],
            language: {
                ...this.defaultConfig.language,
                emptyTable: "No hay productos registrados"
            },
            order: [[1, "asc"]] // Ordenar por nombre
        };
    }

    /**
     * Configuración predefinida para tabla de pedidos
     */
    getOrdersConfig() {
        return {
            columnDefs: [
                {searchable: true, targets: [0, 1, 2]}, // ID, Cliente, Fecha
                {searchable: false, targets: [3, 4, 5]}, // Total, Estado, Acciones
                {orderable: false, targets: [5]}, // Columna de acciones
                {className: "text-center", targets: [0, 3, 4, 5]},
                {className: "text-start", targets: [1, 2]}
            ],
            language: {
                ...this.defaultConfig.language,
                emptyTable: "No hay pedidos registrados"
            },
            order: [[0, "desc"]] // Más recientes primero
        };
    }

    /**
     * Agrega botones de exportación a una tabla
     * @param {string} selector - Selector CSS de la tabla
     * @param {Array} buttons - Array de botones ['copy', 'excel', 'pdf', 'print']
     */
    addExportButtons(selector, buttons = ['copy', 'excel', 'pdf']) {
        const table = this.getTable(selector);
        if (table) {
            new $.fn.dataTable.Buttons(table, {
                buttons: buttons
            });

            table.buttons().container().appendTo(`${selector}_wrapper .col-md-6:eq(0)`);
        }
    }

    /**
     * Destruye todas las tablas
     */
    destroyAllTables() {
        this.tables.forEach((table, selector) => {
            this.destroyTable(selector);
        });
    }
}

/**
 * Funciones de utilidad para renderizar tablas
 */
const TableUtils = {
    /**
     * Renderiza una tabla de empleados
     * @param {Array} employees - Array de empleados
     * @param {string} containerId - ID del contenedor
     */
    renderEmployeesTable(employees, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="table-responsive">
                <table id="employeesTable" class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre Completo</th>
                            <th>Usuario</th>
                            <th>Posición</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees.map(emp => `
                            <tr>
                                <td>${emp.id}</td>
                                <td>${emp.fullName}</td>
                                <td>${emp.username}</td>
                                <td>
                                    <span class="badge ${this.getPositionBadgeClass(emp.position)}">
                                        ${this.getPositionText(emp.position)}
                                    </span>
                                </td>
                                <td>${emp.phone}</td>
                                <td>
                                    <span class="badge ${emp.active ? 'bg-success' : 'bg-danger'}">
                                        ${emp.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>
                                    <div class="btn-group btn-group-sm">
                                        <button class="btn btn-outline-primary" onclick="editEmployee(${emp.id})" title="Editar">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                        <button class="btn btn-outline-warning" onclick="changeEmployeePassword(${emp.id})" title="Cambiar contraseña">
                                            <i class="bi bi-key"></i>
                                        </button>
                                        <button class="btn btn-outline-${emp.active ? 'secondary' : 'success'}" 
                                                onclick="toggleEmployeeStatus(${emp.id}, ${emp.active})" 
                                                title="${emp.active ? 'Desactivar' : 'Activar'}">
                                            <i class="bi bi-${emp.active ? 'x-circle' : 'check-circle'}"></i>
                                        </button>
                                        <button class="btn btn-outline-danger" onclick="deleteEmployee(${emp.id})" title="Eliminar">
                                            <i class="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    getPositionBadgeClass(position) {
        const classes = {
            'ROLE_ADMIN': 'bg-primary',
            'ROLE_CAJERO': 'bg-success',
            'ROLE_PEDIDOS': 'bg-warning'
        };
        return classes[position] || 'bg-secondary';
    },

    getPositionText(position) {
        const texts = {
            'ROLE_ADMIN': 'Administrador',
            'ROLE_CAJERO': 'Cajero',
            'ROLE_PEDIDOS': 'Pedidos'
        };
        return texts[position] || position;
    }
};

// Exportar al objeto global de la aplicación
window.PasaditaPOS = window.PasaditaPOS || {};
window.PasaditaPOS.DataTable = new DataTableManager();
window.PasaditaPOS.TableUtils = TableUtils;

console.log('Componente DataTable cargado correctamente');