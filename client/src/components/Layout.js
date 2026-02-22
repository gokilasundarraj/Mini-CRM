import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'employee'] },
        { name: 'Leads', path: '/leads', roles: ['admin', 'employee'] },
        { name: 'Companies', path: '/companies', roles: ['admin', 'employee'] },
        { name: 'Tasks', path: '/tasks', roles: ['admin', 'employee'] },
        { name: 'Employees', path: '/users', roles: ['admin'] },
    ];

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-logo">CRM PRO</div>
                <nav className="sidebar-nav">
                    {menuItems.filter(item => item.roles.includes(user.role)).map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-user">
                        <span>{user.name} ({user.role})</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </header>

                <div className="content-area">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
