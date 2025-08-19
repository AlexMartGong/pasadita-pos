import {useState} from "react";
import {useAuth} from "../hooks/useAuth";
import "../../styles/css/LoginPage.css";

export const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const {handlerLogin, isLoginLoading} = useAuth();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.username.trim() && formData.password.trim()) {
            await handlerLogin(formData);
        }
    };

    return (
        <div className="login-container">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <div className="card login-card shadow-lg">
                            <div className="card-body login-card-body">
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <span className="fruit-logo">🍎🍊🍌</span>
                                    </div>
                                    <h2 className="brand-title mb-2">Pasadita</h2>
                                    <p className="text-muted">Punto de Venta para Frutería</p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="username" className="form-label form-label-custom">
                                            <i className="fas fa-user me-2 icon-user"></i>Usuario
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg login-input"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            placeholder="Ingresa tu usuario"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label form-label-custom">
                                            <i className="fas fa-lock me-2 icon-lock"></i>Contraseña
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control form-control-lg login-input"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Ingresa tu contraseña"
                                            required
                                        />
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-success btn-lg login-button"
                                            disabled={isLoginLoading}
                                        >
                                            {isLoginLoading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2 loading-spinner"
                                                        role="status"></span>
                                                    Iniciando sesión...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-sign-in-alt me-2 icon-signin"></i>
                                                    Iniciar Sesión
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-4">
                                    <small className="footer-text">
                                        <i className="fas fa-leaf me-1 icon-leaf"></i>
                                        Frutas frescas, servicio de calidad
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
