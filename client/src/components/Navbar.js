import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="topbar">
            <div className="logo">CRM PRO</div>

            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '☰'}
            </button>

            <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                <Link to="/" className="nav-item-public" onClick={() => setIsOpen(false)}>Home</Link>
                <Link to="/#about" className="nav-item-public" onClick={() => setIsOpen(false)}>About</Link>
                <Link to="/#services" className="nav-item-public" onClick={() => setIsOpen(false)}>Services</Link>
                <Link to="/admin-login" className="btn btn-secondary" style={{ padding: '8px 20px' }} onClick={() => setIsOpen(false)}>Admin</Link>
                <Link to="/employee-login" className="btn btn-primary" style={{ padding: '8px 20px' }} onClick={() => setIsOpen(false)}>Employee</Link>
            </div>
        </nav>
    );
};

export default Navbar;
