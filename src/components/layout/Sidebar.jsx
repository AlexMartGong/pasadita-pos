import {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useAuth} from '../../auth/hooks/useAuth.js';
import '../../styles/Sidebar.css';
import {useSidebar} from "../../hooks/useSidebar.js";

export const Sidebar = () => {
    const {isCollapsed, setIsCollapsed} = useSidebar();
    const location = useLocation();
    const {user, handlerLogout} = useAuth();

    const menuItems = [
        {path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard'},
        {path: '/products', icon: 'bi-box-seam', label: 'Products'},
        {path: '/analytics', icon: 'bi-graph-up', label: 'Analytics'},
        {path: '/settings', icon: 'bi-gear', label: 'Settings'}
    ];

    return (
        <div
            className={`bg-dark text-white position-fixed h-100 transition-all ${
                isCollapsed ? 'collapsed-sidebar' : 'expanded-sidebar'
            }`}
            style={{
                width: isCollapsed ? '80px' : '250px',
                transition: 'width 0.3s ease-in-out',
                zIndex: 1000,
                boxShadow: '2px 0 5px rgba(0,0,0,0.1)'
            }}>

            <div className="p-3 border-bottom border-secondary">
                <div className="d-flex align-items-center justify-content-between">
                    {!isCollapsed && (
                        <h5 className="mb-0 text-light fw-bold animate-fade-in">
                            FruitApp
                        </h5>
                    )}
                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{transition: 'all 0.2s ease'}}>
                        <i className={`bi ${isCollapsed ? 'bi-arrow-right' : 'bi-arrow-left'}`}></i>
                    </button>
                </div>
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
                                {!isCollapsed && (
                                    <span className="ms-3 animate-fade-in">{item.label}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="position-absolute bottom-0 w-100 border-top border-secondary">
                {!isCollapsed && (
                    <div className="p-3">
                        <div className="d-flex align-items-center animate-fade-in mb-2">
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
                )}
                <button
                    onClick={handlerLogout}
                    className="d-flex align-items-center px-3 py-2 text-decoration-none text-light sidebar-link w-100 border-0 bg-transparent logout-btn"
                    style={{
                        transition: 'all 0.2s ease',
                        borderTop: isCollapsed ? '1px solid #6c757d' : 'none'
                    }}
                    title={isCollapsed ? 'Logout' : ''}>
                    <i className="bi bi-box-arrow-right fs-5"></i>
                    {!isCollapsed && (
                        <span className="ms-3 animate-fade-in">Logout</span>
                    )}
                </button>
            </div>
        </div>
    );
};