import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useUser} from "../../hooks/useUser.js";

export const UserForm = ({userSelected}) => {
    const {handleAddUser, handleChangePassword, initialUserForm} = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState(initialUserForm);
    const [errors, setErrors] = useState({});
    const isPasswordEditMode = location.pathname.includes('/edit-password/');

    const positionOptions = [
        {value: 'ROLE_ADMIN', label: 'Administrador'},
        {value: 'ROLE_CAJERO', label: 'Cajero'},
        {value: 'ROLE_PEDIDOS', label: 'Pedidos'}
    ];

    useEffect(() => {
        if (userSelected && userSelected.id !== 0) {
            setFormData({
                id: userSelected.id || 0,
                fullName: userSelected.fullName || '',
                username: userSelected.username || '',
                password: '',
                position: userSelected.position || '',
                phone: userSelected.phone || '',
                active: userSelected.active !== undefined ? userSelected.active : true
            });
        }
    }, [userSelected]);

    const handleInputChange = (e) => {
        const {name, value, checked, type} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (isPasswordEditMode) {
            if (!formData.password.trim()) newErrors.password = 'La nueva contraseña es requerida';
            if ((!userSelected || !userSelected.id) && (formData.password.length > 8 && formData.password.length < 50)) newErrors.password = 'La contraseña debe tener entre 8 y 50 caracteres';
        } else {
            if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es requerido';
            if (formData.fullName.length > 5 || formData.fullName.length < 150) newErrors.fullName = 'El nombre completo debe tener entre 5 y 150 caracteres';

            if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es requerido';
            if (formData.username.length > 4 || formData.username.length < 50) newErrors.username = 'El nombre de usuario debe tener entre 4 y 50 caracteres';

            if ((!userSelected || !userSelected.id) && !formData.password.trim()) newErrors.password = 'La contraseña es requerida';
            if ((!userSelected || !userSelected.id) || (formData.password.length > 8 && formData.password.length < 50)) newErrors.password = 'La contraseña debe tener entre 8 y 50 caracteres';

            if (!formData.position) newErrors.position = 'La posición es requerida';
            if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
            if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) newErrors.phone = 'El teléfono debe tener 10 dígitos numéricos';

        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            if (isPasswordEditMode) {
                handleChangePassword(formData.id, formData.password);
            } else {
                handleAddUser(formData);
            }
            navigate('/users');
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    const isEditMode = userSelected && userSelected.id !== 0;

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0 fw-bold">
                                {isPasswordEditMode ? 'Editar Contraseña' : (isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario')}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    {!isPasswordEditMode && (
                                        <div className="col-12">
                                            <label htmlFor="fullName" className="form-label">
                                                Nombre Completo <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                                id="fullName"
                                                maxLength="150"
                                                minLength="5"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.fullName && (
                                                <div className="invalid-feedback">
                                                    {errors.fullName}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!isPasswordEditMode && (
                                        <div className="col-md-6">
                                            <label htmlFor="username" className="form-label">
                                                Nombre de Usuario <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                                id="username"
                                                minLength="4"
                                                maxLength="50"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            {errors.username && (
                                                <div className="invalid-feedback">
                                                    {errors.username}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {(isPasswordEditMode || formData.id === 0) && (
                                        <div className={isPasswordEditMode ? "col-12" : "col-md-6"}>
                                            <label htmlFor="password" className="form-label">
                                                {isPasswordEditMode ? "Nueva Contraseña" : (isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña")}
                                                {(isPasswordEditMode || !isEditMode) &&
                                                    <span className="text-danger">*</span>}
                                            </label>
                                            <input
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required={isPasswordEditMode || !isEditMode}
                                            />
                                            {errors.password && (
                                                <div className="invalid-feedback">
                                                    {errors.password}
                                                </div>
                                            )}
                                            {!isPasswordEditMode && isEditMode && !errors.password && (
                                                <div className="form-text">
                                                    Dejar vacío para mantener la actual
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!isPasswordEditMode && (
                                        <div className="col-md-6">
                                            <label htmlFor="position" className="form-label">
                                                Posición <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.position ? 'is-invalid' : ''}`}
                                                id="position"
                                                name="position"
                                                value={formData.position}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleccionar posición</option>
                                                {positionOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.position && (
                                                <div className="invalid-feedback">
                                                    {errors.position}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!isPasswordEditMode && (
                                        <div className="col-md-6">
                                            <label htmlFor="phone" className="form-label">
                                                Teléfono <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                                id="phone"
                                                maxLength="10"
                                                name="phone"
                                                pattern="[0-9]{10}"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                onKeyPress={(e) => {
                                                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                                                }}
                                                required
                                            />
                                            {errors.phone && (
                                                <div className="invalid-feedback">
                                                    {errors.phone}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {!isPasswordEditMode && (
                                        <div className="col-12">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="active"
                                                    name="active"
                                                    checked={formData.active}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="active">
                                                    Usuario Activo
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <input type="hidden" name="id" value={formData.id}/>

                                    <div className="col-12">
                                        <div className="d-flex gap-2 justify-content-end mt-3">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={handleCancel}
                                                style={{minWidth: '120px'}}
                                            >
                                                <i className="fas fa-times me-2"></i>
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                style={{minWidth: '120px'}}
                                            >
                                                <i className="fas fa-save me-2"></i>
                                                {isPasswordEditMode ? 'Actualizar Contraseña' : (isEditMode ? 'Actualizar' : 'Guardar')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}