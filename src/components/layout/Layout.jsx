import {useSidebar} from '../../hooks/useSidebar.js';

export const Layout = ({children}) => {
    const {isCollapsed} = useSidebar();

    return (
        <div style={{
            marginLeft: isCollapsed ? '80px' : '250px',
            padding: '20px',
            minHeight: '100vh',
            transition: 'margin-left 0.3s ease-in-out'
        }}>
            {children}
        </div>
    );
};
