import {Link, useLocation} from 'react-router-dom';
import {useAuth} from '../../auth/hooks/useAuth.js';
import '../../styles/Sidebar.css';

export const Sidebar = () => {
    const location = useLocation();
    const {user, isAdmin, handlerLogout} = useAuth();

    const menuItems = [
        {path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard'},
        {path: '/products', icon: 'bi-box-seam', label: 'Products'},
        ...(isAdmin ? [{path: '/users', icon: 'bi bi-people', label: 'Users'}] : []),
        {path: '/settings', icon: 'bi-gear', label: 'Settings'}
    ];

    return (
        <div
            className="bg-dark text-white position-fixed h-100"
            style={{
                width: '250px',
                zIndex: 1000,
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
            }}>

            <div className="p-3 border-bottom border-secondary">
                <h5 className="mb-0 text-light fw-bold">
                    FruitApp
                </h5>
            </div>

            <nav className="py-3">
                <ul className="list-unstyled">
                    {menuItems.map((item, index) => (
                        <li key={item.path} className="mb-1">
                            <Link
                                to={item.path}
                                className={`d-flex align-items-center px-3 py-2 text-decoration-none text-light sidebar-link ${
                                    location.pathname === item.path ? 'active' : ''
                                }`}
                                style={{
                                    transition: 'all 0.2s ease',
                                    animationDelay: `${index * 0.1}s`
                                }}
                            >
                                <i className={`${item.icon} fs-5`}></i>
                                <span className="ms-3">{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="position-absolute bottom-0 w-100 border-top border-secondary">
                <div className="p-3">
                    <div className="d-flex align-items-center mb-2">
                        <div
                            className="bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                            style={{width: '40px', height: '40px'}}>
                            <i className="bi bi-person-fill text-white"></i>
                        </div>
                        <div className="ms-2">
                            <small className="text-light fw-bold d-block">{user || 'Admin User'}</small>
                            <small className="text-light">Administrator</small>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handlerLogout}
                    className="d-flex align-items-center px-3 py-2 text-decoration-none text-light sidebar-link w-100 border-0 bg-transparent logout-btn"
                    style={{transition: 'all 0.2s ease'}}>
                    <i className="bi bi-box-arrow-right fs-5"></i>
                    <span className="ms-3">Logout</span>
                </button>
            </div>
        </div>
    );
};