import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://mini-crm-xl4y.onrender.com/api/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching dashboard stats', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="fade-in">
            <h2 style={{ marginBottom: '30px' }}>Dashboard Overview</h2>

            {user.role === 'admin' ? (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{stats?.totalLeads || 0}</div>
                        <div className="stat-label">Total Leads</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.qualifiedLeads || 0}</div>
                        <div className="stat-label">Qualified Leads</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.tasksDueToday || 0}</div>
                        <div className="stat-label">Tasks Due Today</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.completedTasks || 0}</div>
                        <div className="stat-label">Completed Tasks</div>
                    </div>
                </div>
            ) : (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{stats?.myTasksDueToday || 0}</div>
                        <div className="stat-label">My Tasks Due Today</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.myPendingTasks || 0}</div>
                        <div className="stat-label">My Pending Tasks</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{stats?.myCompletedTasks || 0}</div>
                        <div className="stat-label">My Completed Tasks</div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: '50px' }}>
                <h3 style={{ marginBottom: '20px' }}>Welcome back, {user.name}!</h3>
                <p style={{ color: '#888' }}>
                    {user.role === 'admin'
                        ? 'Use the sidebar to manage leads, companies, tasks and employees.'
                        : 'Access your assigned leads and tasks from the sidebar to manage your workflow.'}
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
