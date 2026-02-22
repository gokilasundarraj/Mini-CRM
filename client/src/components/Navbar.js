import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="topbar" style={{ justifyContent: 'space-between', position: 'fixed', width: '100%', top: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', paddingLeft: '20px' }}>CRM PRO</div>
            <div style={{ display: 'flex', gap: '30px', paddingRight: '20px' }}>
                <Link to="/" className="nav-item-public">Home</Link>
                <Link to="/about" className="nav-item-public">About</Link>
                <Link to="/services" className="nav-item-public">Services</Link>
                <Link to="/admin-login" className="btn btn-secondary" style={{ padding: '8px 20px' }}>Admin</Link>
                <Link to="/employee-login" className="btn btn-primary" style={{ padding: '8px 20px' }}>Employee</Link>
            </div>
        </nav>
    );
};

export default Navbar;
