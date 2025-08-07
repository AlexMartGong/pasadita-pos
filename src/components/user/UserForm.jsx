import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useUser} from "../../hooks/useUser.js";

export const UserForm = ({userSelected}) => {
    const {handleAddUser, initialUserForm} = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialUserForm);
    const [errors, setErrors] = useState({});

    // Position options based on the enum
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

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es requerido';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es requerido';
        }

        if ((!userSelected || !userSelected.id) && !formData.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        }

        if (!formData.position) {
            newErrors.position = 'La posición es requerida';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form data to submit:', formData);
            handleAddUser(formData).then(r => console.log(r)).catch(e => console.error(e));
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
                                {isEditMode ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label htmlFor="fullName" className="form-label">
                                            Nombre Completo <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                            id="fullName"
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

                                    <div className="col-md-6">
                                        <label htmlFor="username" className="form-label">
                                            Nombre de Usuario <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                            id="username"
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

                                    <div className="col-md-6">
                                        <label htmlFor="password" className="form-label">
                                            {isEditMode ? "Nueva Contraseña (opcional)" : "Contraseña"}
                                            {!isEditMode && <span className="text-danger">*</span>}
                                        </label>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required={!isEditMode}
                                        />
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password}
                                            </div>
                                        )}
                                        {isEditMode && !errors.password && (
                                            <div className="form-text">
                                                Dejar vacío para mantener la actual
                                            </div>
                                        )}
                                    </div>

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

                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label">
                                            Teléfono <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.phone && (
                                            <div className="invalid-feedback">
                                                {errors.phone}
                                            </div>
                                        )}
                                    </div>

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
                                                {isEditMode ? 'Actualizar' : 'Guardar'}
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