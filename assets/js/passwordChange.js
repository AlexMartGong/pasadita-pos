document.addEventListener('DOMContentLoaded', function () {
    // Toggle para mostrar/ocultar nueva contraseña
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const newPasswordField = document.getElementById('newPassword');
    const toggleNewPasswordIcon = document.getElementById('toggleNewPasswordIcon');

    if (toggleNewPassword && newPasswordField && toggleNewPasswordIcon) {
        toggleNewPassword.addEventListener('click', function () {
            const type = newPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
            newPasswordField.setAttribute('type', type);
            toggleNewPasswordIcon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });
    }

    // Toggle para mostrar/ocultar confirmar contraseña
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const toggleConfirmPasswordIcon = document.getElementById('toggleConfirmPasswordIcon');

    if (toggleConfirmPassword && confirmPasswordField && toggleConfirmPasswordIcon) {
        toggleConfirmPassword.addEventListener('click', function () {
            const type = confirmPasswordField.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordField.setAttribute('type', type);
            toggleConfirmPasswordIcon.className = type === 'password' ? 'bi bi-eye' : 'bi bi-eye-slash';
        });
    }

    // Validación de fuerza de contraseña
    const newPasswordInput = document.getElementById('newPassword');
    const strengthBar = document.getElementById('newPasswordStrength');

    if (newPasswordInput && strengthBar) {
        newPasswordInput.addEventListener('input', function (e) {
            const password = e.target.value;
            let strength = 0;
            let strengthClass = '';
            let strengthWidth = '0%';

            if (password.length >= 6) strength += 25;
            if (password.length >= 8) strength += 25;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
            if (/\d/.test(password)) strength += 25;

            if (strength <= 25) {
                strengthClass = 'bg-danger';
                strengthWidth = '25%';
            } else if (strength <= 50) {
                strengthClass = 'bg-warning';
                strengthWidth = '50%';
            } else if (strength <= 75) {
                strengthClass = 'bg-info';
                strengthWidth = '75%';
            } else {
                strengthClass = 'bg-success';
                strengthWidth = '100%';
            }

            strengthBar.className = 'progress-bar ' + strengthClass;
            strengthBar.style.width = strengthWidth;
        });
    }

    // Validación en tiempo real
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changePasswordButton = document.getElementById('changePasswordButton');

    function validatePasswordForm() {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        let isValid = true;

        // Limpiar errores previos
        clearPasswordValidationErrors();

        // Validar nueva contraseña
        if (!newPassword) {
            showPasswordFieldError('newPassword', 'La nueva contraseña es obligatoria');
            isValid = false;
        } else if (newPassword.length < 6) {
            showPasswordFieldError('newPassword', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(newPassword)) {
            showPasswordFieldError('newPassword', 'La contraseña debe contener al menos una minúscula, una mayúscula y un número');
            isValid = false;
        } else {
            showPasswordFieldSuccess('newPassword');
        }

        // Validar confirmación de contraseña
        if (!confirmPassword) {
            showPasswordFieldError('confirmPassword', 'Debe confirmar la contraseña');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            showPasswordFieldError('confirmPassword', 'Las contraseñas no coinciden');
            isValid = false;
        } else if (newPassword) {
            showPasswordFieldSuccess('confirmPassword');
        }

        // Habilitar/deshabilitar botón
        changePasswordButton.disabled = !isValid;
        return isValid;
    }

    // Agregar listeners de validación
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', validatePasswordForm);
        newPasswordInput.addEventListener('blur', validatePasswordForm);
    }

    if (confirmPasswordField) {
        confirmPasswordField.addEventListener('input', validatePasswordForm);
        confirmPasswordField.addEventListener('blur', validatePasswordForm);
    }

    // Manejar envío del formulario
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (validatePasswordForm()) {
                await submitPasswordChange();
            }
        });
    }

    // Limpiar formulario al cerrar modal
    const changePasswordModal = document.getElementById('changePasswordModal');
    if (changePasswordModal) {
        changePasswordModal.addEventListener('hidden.bs.modal', function () {
            clearPasswordForm();
        });
    }
});

// Función para abrir el modal de cambio de contraseña
async function openChangePasswordModal(employeeId) {
    try {
        // Obtener datos del empleado
        const employee = await api.getEmployee(employeeId);

        if (employee) {
            // Establecer ID del empleado
            document.getElementById('changePasswordEmployeeId').value = employeeId;

            // Mostrar nombre del empleado
            document.getElementById('changePasswordEmployeeName').textContent = employee.fullName;

            // Limpiar formulario
            clearPasswordForm();

            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
            modal.show();
        } else {
            alert('Empleado no encontrado');
        }
    } catch (error) {
        console.error('Error al cargar empleado:', error);
        alert('Error al cargar los datos del empleado');
    }
}

// Función para limpiar el formulario de contraseña
function clearPasswordForm() {
    const form = document.getElementById('changePasswordForm');
    if (form) {
        form.reset();
        clearPasswordValidationErrors();

        // Resetear barra de fuerza
        const strengthBar = document.getElementById('newPasswordStrength');
        if (strengthBar) {
            strengthBar.className = 'progress-bar';
            strengthBar.style.width = '0%';
        }

        // Resetear iconos de toggle
        document.getElementById('toggleNewPasswordIcon').className = 'bi bi-eye';
        document.getElementById('toggleConfirmPasswordIcon').className = 'bi bi-eye';
        document.getElementById('newPassword').setAttribute('type', 'password');
        document.getElementById('confirmPassword').setAttribute('type', 'password');

        // Deshabilitar botón
        document.getElementById('changePasswordButton').disabled = true;
    }
}

// Función para mostrar error en campo de contraseña
function showPasswordFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const feedback = field.parentElement.nextElementSibling;

    field.classList.remove('is-valid');
    field.classList.add('is-invalid');

    if (feedback && feedback.classList.contains('invalid-feedback')) {
        feedback.textContent = message;
    }
}

// Función para mostrar éxito en campo de contraseña
function showPasswordFieldSuccess(fieldName) {
    const field = document.getElementById(fieldName);

    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// Función para limpiar errores de validación
function clearPasswordValidationErrors() {
    const form = document.getElementById('changePasswordForm');
    if (form) {
        form.querySelectorAll('.is-invalid, .is-valid').forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });

        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
            feedback.textContent = '';
        });
    }
}

// Función para enviar el cambio de contraseña
async function submitPasswordChange() {
    const employeeId = document.getElementById('changePasswordEmployeeId').value;
    const newPassword = document.getElementById('newPassword').value;
    const button = document.getElementById('changePasswordButton');
    const spinner = document.getElementById('changePasswordSpinner');

    try {
        // Mostrar spinner
        button.disabled = true;
        spinner.classList.remove('d-none');

        // Cambiar contraseña
        await api.changePassword(employeeId, newPassword);

        // Mostrar mensaje de éxito
        showPasswordSuccessMessage('Contraseña cambiada correctamente');

        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
        modal.hide();

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        showPasswordErrorMessage('Error al cambiar la contraseña: ' + error.message);
    } finally {
        // Ocultar spinner
        button.disabled = false;
        spinner.classList.add('d-none');
    }
}

// Funciones para mostrar mensajes (usando el sistema existente)
function showPasswordSuccessMessage(message) {
    if (employeeValidator) {
        employeeValidator.showSuccessMessage(message);
    } else {
        console.log(message);
    }
}

function showPasswordErrorMessage(message) {
    if (employeeValidator) {
        employeeValidator.showErrorMessage(message);
    } else {
        alert(message);
    }
}

// Modificar la función changeEmployeePassword existente
async function changeEmployeePassword(id) {
    await openChangePasswordModal(id);
}