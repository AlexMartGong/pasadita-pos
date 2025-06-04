class EmployeeValidator {
    constructor() {
        this.form = document.getElementById('employeeForm');
        this.saveButton = document.getElementById('saveButton');
        this.originalFormData = {};
        this.currentFormData = {};
        this.isFormValid = false;
        this.hasChanges = false;

        this.validationRules = {
            fullName: {
                required: true,
                minLength: 3,
                maxLength: 100,
                pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
                messages: {
                    required: 'El nombre completo es obligatorio',
                    minLength: 'El nombre debe tener al menos 3 caracteres',
                    maxLength: 'El nombre no puede exceder 100 caracteres',
                    pattern: 'El nombre solo puede contener letras y espacios'
                }
            },
            username: {
                required: true,
                minLength: 3,
                maxLength: 50,
                pattern: /^[a-zA-Z0-9_-]+$/,
                unique: true,
                messages: {
                    required: 'El usuario es obligatorio',
                    minLength: 'El usuario debe tener al menos 3 caracteres',
                    maxLength: 'El usuario no puede exceder 50 caracteres',
                    pattern: 'El usuario solo puede contener letras, números, guiones y guiones bajos',
                    unique: 'Este nombre de usuario ya está en uso'
                }
            },
            password: {
                required: true,
                minLength: 6,
                maxLength: 20,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                messages: {
                    required: 'La contraseña es obligatoria',
                    minLength: 'La contraseña debe tener al menos 6 caracteres',
                    maxLength: 'La contraseña no puede exceder 20 caracteres',
                    pattern: 'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
                }
            },
            position: {
                required: true,
                messages: {
                    required: 'Debe seleccionar una posición'
                }
            },
            phone: {
                required: true,
                pattern: /^[0-9]{10}$/,
                messages: {
                    required: 'El teléfono es obligatorio',
                    pattern: 'El teléfono debe tener exactamente 10 dígitos'
                }
            }
        };

        this.init();
    }

    init() {
        if (!this.form || !this.saveButton) return;

        // Desactivar botón por defecto
        this.disableSaveButton();

        // Agregar listeners para validación en tiempo real
        this.addRealTimeValidation();

        // Agregar listeners para detectar cambios
        this.addChangeDetection();

        // Override del submit
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (await this.validateForm()) {
                // Si la validación es exitosa, continuar con el guardado
                await this.submitForm();
            }
        });
    }

    /**
     * Captura el estado original del formulario
     */
    captureOriginalFormData() {
        this.originalFormData = this.getCurrentFormData();
        this.hasChanges = false;
        this.updateButtonState();
    }

    /**
     * Obtiene los datos actuales del formulario
     */
    getCurrentFormData() {
        return {
            fullName: (document.getElementById('fullName')?.value || '').trim(),
            username: (document.getElementById('username')?.value || '').trim(),
            password: document.getElementById('password')?.value || '',
            position: document.getElementById('position')?.value || '',
            phone: (document.getElementById('phone')?.value || '').replace(/\D/g, ''),
            active: document.getElementById('active')?.checked || false
        };
    }

    /**
     * Detecta si hay cambios en el formulario
     */
    detectChanges() {
        this.currentFormData = this.getCurrentFormData();

        // En modo nuevo empleado, cualquier dato es un cambio
        if (!isEditMode) {
            this.hasChanges = Object.values(this.currentFormData).some(value => {
                if (typeof value === 'boolean') return value;
                return value.toString().trim() !== '';
            });
        } else {
            // En modo edición, comparar con datos originales
            this.hasChanges = Object.keys(this.currentFormData).some(key => {
                // Saltar password en modo edición si está vacío
                if (key === 'password' && !this.currentFormData[key]) {
                    return false;
                }
                return this.currentFormData[key] !== this.originalFormData[key];
            });
        }

        this.updateButtonState();
    }

    /**
     * Agrega detección de cambios a todos los campos
     */
    addChangeDetection() {
        const fieldsToWatch = ['fullName', 'username', 'password', 'position', 'phone', 'active'];

        fieldsToWatch.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field) return;

            if (field.type === 'checkbox') {
                field.addEventListener('change', () => this.detectChanges());
            } else {
                field.addEventListener('input', () => this.detectChanges());
            }
        });
    }

    addRealTimeValidation() {
        // Validación en tiempo real para todos los campos
        Object.keys(this.validationRules).forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!field) return;

            // Validar al perder el foco
            field.addEventListener('blur', async () => {
                await this.validateField(fieldName);
                await this.checkFormValidity();
            });

            // Validar mientras escribe (con debounce para username)
            if (fieldName === 'username') {
                let timeout;
                field.addEventListener('input', () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(async () => {
                        await this.validateField(fieldName);
                        await this.checkFormValidity();
                    }, 500);
                });
            } else {
                field.addEventListener('input', async () => {
                    // Limpiar error si el campo ya es válido
                    if (field.value.trim()) {
                        this.clearFieldError(fieldName);
                    }

                    // Verificar validez del formulario después de un pequeño delay
                    setTimeout(() => this.checkFormValidity(), 100);
                });
            }
        });

        // Formatear teléfono mientras escribe
        const phoneField = document.getElementById('phone');
        if (phoneField) {
            phoneField.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            });
        }
    }

    /**
     * Verifica si el formulario completo es válido
     */
    async checkFormValidity() {
        const fieldNames = Object.keys(this.validationRules);
        let isValid = true;

        for (const fieldName of fieldNames) {
            const field = document.getElementById(fieldName);
            if (!field) continue;

            // Saltar validación de password en modo edición si está vacío
            if (fieldName === 'password' && isEditMode && !field.value) {
                continue;
            }

            // Verificar si el campo tiene la clase is-invalid
            if (field.classList.contains('is-invalid')) {
                isValid = false;
                break;
            }

            // Verificar si el campo requerido está vacío
            const rules = this.validationRules[fieldName];
            if (rules.required && !field.value.trim()) {
                if (!(fieldName === 'password' && isEditMode)) {
                    isValid = false;
                    break;
                }
            }
        }

        this.isFormValid = isValid;
        this.updateButtonState();
    }

    /**
     * Actualiza el estado del botón de guardar
     */
    updateButtonState() {
        const shouldEnable = this.isFormValid && this.hasChanges;

        if (shouldEnable) {
            this.enableSaveButton();
        } else {
            this.disableSaveButton();
        }
    }

    /**
     * Habilita el botón de guardar
     */
    enableSaveButton() {
        if (this.saveButton) {
            this.saveButton.disabled = false;
        }
    }

    /**
     * Deshabilita el botón de guardar
     */
    disableSaveButton() {
        if (this.saveButton) {
            this.saveButton.disabled = true;
        }
    }

    async validateForm() {
        let isValid;
        const promises = [];

        for (const fieldName of Object.keys(this.validationRules)) {
            const field = document.getElementById(fieldName);
            if (!field) continue;

            // Saltar validación de password en modo edición si está vacío
            if (fieldName === 'password' && isEditMode && !field.value) {
                continue;
            }

            promises.push(this.validateField(fieldName));
        }

        const results = await Promise.all(promises);
        isValid = results.every(result => result);

        this.isFormValid = isValid;
        return isValid;
    }

    async validateField(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return true;

        const rules = this.validationRules[fieldName];
        const value = field.value.trim();
        let isValid = true;

        // Limpiar errores previos
        this.clearFieldError(fieldName);

        if (rules.required && !value) {
            // Saltar validación de password en modo edición
            if (fieldName === 'password' && isEditMode) {
                return true;
            }
            this.showFieldError(fieldName, rules.messages.required);
            return false;
        }

        // Si el campo está vacío y no es requerido, no validar más
        if (!value) return true;

        // Validación longitud mínima
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(fieldName, rules.messages.minLength);
            return false;
        }

        // Validación longitud máxima
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showFieldError(fieldName, rules.messages.maxLength);
            return false;
        }

        // Validación patrón
        if (rules.pattern && !rules.pattern.test(value)) {
            this.showFieldError(fieldName, rules.messages.pattern);
            return false;
        }

        // Validación de unicidad para username
        if (rules.unique && fieldName === 'username') {
            isValid = await this.validateUsernameUnique(value);
            if (!isValid) {
                this.showFieldError(fieldName, rules.messages.unique);
            }
        }

        // Si todas las validaciones pasan, mostrar éxito
        if (isValid) {
            this.showFieldSuccess(fieldName);
        }

        return isValid;
    }

    async validateUsernameUnique(username) {
        try {
            // No validar si estamos editando y es el mismo username
            if (isEditMode) {
                const employeeId = document.getElementById('employeeId').value;
                const currentEmployee = await api.getEmployee(employeeId);
                if (currentEmployee && currentEmployee.username === username) {
                    return true;
                }
            }

            // Verificar si el username existe
            const exists = await api.checkUsernameExists(username);
            return !exists;
        } catch (error) {
            console.error('Error validando username:', error);
            return true; // En caso de error, permitir continuar
        }
    }

    showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const feedback = field.nextElementSibling;

        field.classList.remove('is-valid');
        field.classList.add('is-invalid');

        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = message;
        }

        // Agregar icono de error
        this.updateFieldIcon(fieldName, 'error');
    }

    showFieldSuccess(fieldName) {
        const field = document.getElementById(fieldName);

        field.classList.remove('is-invalid');
        field.classList.add('is-valid');

        // Agregar icono de éxito
        this.updateFieldIcon(fieldName, 'success');
    }

    clearFieldError(fieldName) {
        const field = document.getElementById(fieldName);
        const feedback = field.nextElementSibling;

        field.classList.remove('is-invalid', 'is-valid');

        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = '';
        }

        // Remover iconos
        this.updateFieldIcon(fieldName, 'clear');
    }

    updateFieldIcon(fieldName, status) {
        const field = document.getElementById(fieldName);
        const wrapper = field.closest('.mb-3');
        const existingIcon = wrapper.querySelector('.field-icon');

        // Remover icono existente
        if (existingIcon) {
            existingIcon.remove();
        }

        if (status === 'clear') return;

        // Crear nuevo icono
        const icon = document.createElement('i');
        icon.className = 'field-icon position-absolute';

        if (status === 'error') {
            icon.className += ' bi bi-exclamation-circle text-danger';
        } else if (status === 'success') {
            icon.className += ' bi bi-check-circle text-success';
        }

        // Posicionar el icono
        wrapper.style.position = 'relative';
        field.parentElement.appendChild(icon);
    }

    async submitForm() {
        const saveButton = this.form.querySelector('button[type="submit"]');
        const spinner = document.getElementById('saveSpinner');

        try {
            // Mostrar spinner
            saveButton.disabled = true;
            spinner.classList.remove('d-none');

            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                username: document.getElementById('username').value.trim(),
                position: document.getElementById('position').value,
                phone: document.getElementById('phone').value.replace(/\D/g, ''),
                active: document.getElementById('active').checked
            };

            // Solo incluir password si tiene valor
            const passwordValue = document.getElementById('password').value;
            if (passwordValue) {
                formData.password = passwordValue;
            }
            if (isEditMode) {
                formData.id = document.getElementById('employeeId').value;
                await api.updateEmployee(formData.id, formData);
            } else {
                await api.saveEmployee(formData);
            }

            // Mostrar mensaje de éxito
            this.showSuccessMessage(isEditMode ? 'Empleado actualizado correctamente' : 'Empleado creado correctamente');

            // Cerrar modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('employeeModal'));
            modal.hide();

            // Recargar tabla
            await loadEmployees();

        } catch (error) {
            console.error('Error al guardar empleado:', error);
            this.showErrorMessage('Error al guardar el empleado. Por favor, intente nuevamente.');
        } finally {
            // Ocultar spinner
            saveButton.disabled = false;
            spinner.classList.add('d-none');
        }
    }

    /**
     * Resetea el estado del formulario
     */
    resetFormState() {
        this.originalFormData = {};
        this.currentFormData = {};
        this.isFormValid = false;
        this.hasChanges = false;
        this.disableSaveButton();

        // Limpiar todas las validaciones
        this.clearAllValidations();
    }

    /**
     * Limpia todas las validaciones del formulario
     */
    clearAllValidations() {
        Object.keys(this.validationRules).forEach(fieldName => {
            this.clearFieldError(fieldName);
        });
    }

    showSuccessMessage(message) {
        // Crear toast de éxito
        const toastHtml = `
            <div class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-check-circle me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>`;

        this.showToast(toastHtml);
    }

    showErrorMessage(message) {
        // Crear toast de error
        const toastHtml = `
            <div class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>`;

        this.showToast(toastHtml);
    }

    showToast(toastHtml) {
        // Crear contenedor de toast si no existe
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }

        // Agregar toast al contenedor
        const toastElement = document.createElement('div');
        toastElement.innerHTML = toastHtml;
        toastContainer.appendChild(toastElement.firstElementChild);

        // Inicializar y mostrar toast
        const toast = new bootstrap.Toast(toastContainer.lastElementChild);
        toast.show();

        // Remover toast después de ocultarse
        toastContainer.lastElementChild.addEventListener('hidden.bs.toast', (e) => {
            e.target.remove();
        });
    }
}

// Variable global para acceder al validador
let employeeValidator;

// Inicializar validador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    employeeValidator = new EmployeeValidator();
});

// Funciones globales para ser llamadas desde employees.html
window.initializeValidatorForNewEmployee = function () {
    if (employeeValidator) {
        employeeValidator.resetFormState();
        // En modo nuevo, cualquier cambio cuenta
        setTimeout(() => {
            employeeValidator.detectChanges();
        }, 100);
    }
};

window.initializeValidatorForEditEmployee = function () {
    if (employeeValidator) {
        // Establecer datos originales después de cargar el empleado
        setTimeout(() => {
            employeeValidator.captureOriginalFormData();
        }, 100);
    }
};