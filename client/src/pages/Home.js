import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    return (
        <div className="fade-in">
            <Navbar />

            <section className="hero">
                <h1>Empower Your Sales Team</h1>
                <p>A professional SaaS CRM designed for modern IT companies. Manage leads, track tasks, and grow your business with ease.</p>
                <div className="cta-group">
                    <Link to="/admin-login" className="btn btn-primary">Admin Login</Link>
                    <Link to="/employee-login" className="btn btn-secondary">Employee Login</Link>
                </div>
            </section>

            <section id="about" className="section">
                <h2 className="section-title">About the CRM</h2>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <p>Our Mini CRM provides a streamlined approach to managing your business relationships. Built with speed and efficiency in mind, it allows you to stay focused on what matters most: your customers.</p>
                </div>
            </section>

            <section id="services" className="section">
                <h2 className="section-title">Common Services</h2>
                <div className="grid">
                    <div className="card">
                        <h3>Leads Management</h3>
                        <p>Track your potential customers from initial contact to closing the deal.</p>
                    </div>
                    <div className="card">
                        <h3>Task Management</h3>
                        <p>Assign tasks to your employees and monitor their progress in real-time.</p>
                    </div>
                    <div className="card">
                        <h3>Company Management</h3>
                        <p>Maintain a detailed database of companies and their associated leads.</p>
                    </div>
                </div>
            </section>

            <footer>
                <p>&copy; 2026 CRM PRO IT Solutions. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
