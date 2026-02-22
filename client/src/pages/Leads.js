import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leads = () => {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [currentLead, setCurrentLead] = useState({ name: '', email: '', phone: '', status: 'New', company: '', assignedTo: '' });
    const [companies, setCompanies] = useState([]);
    const [employees, setEmployees] = useState([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const fetchLeads = async () => {
        try {
            const res = await axios.get(`https://mini-crm-xl4y.onrender.com/api/leads?search=${search}&status=${status}&page=${page}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLeads(res.data.leads);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error('Error fetching leads', err);
        }
    };

    const fetchDependencies = async () => {
        if (user.role !== 'admin') return;
        try {
            const [compRes, empRes] = await Promise.all([
                axios.get('https://mini-crm-xl4y.onrender.com/api/companies', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('https://mini-crm-xl4y.onrender.com/api/users', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setCompanies(compRes.data);
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error fetching dependencies', err);
        }
    };

    useEffect(() => {
        fetchLeads();
       
    }, [search, status, page]);

    useEffect(() => {
        fetchDependencies();
    }, []);

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (currentLead._id) {
                await axios.patch(`https://mini-crm-xl4y.onrender.com/api/leads/${currentLead._id}`, currentLead, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('https://mini-crm-xl4y.onrender.com/api/leads', currentLead, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            setCurrentLead({ name: '', email: '', phone: '', status: 'New', company: '', assignedTo: '' });
            fetchLeads();
        } catch (err) {
            alert('Error saving lead');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this lead?')) return;
        try {
            await axios.delete(`https://mini-crm-xl4y.onrender.com/api/leads/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLeads();
        } catch (err) {
            alert('Error deleting lead');
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h2>Leads Management</h2>
                {user.role === 'admin' && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Lead</button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <input
                    className="form-control"
                    placeholder="Search leads..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: '300px' }}
                />
                <select
                    className="form-control"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ maxWidth: '200px' }}
                >
                    <option value="">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Lost">Lost</option>
                </select>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            {user.role === 'admin' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead._id}>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.phone}</td>
                                <td>{lead.company?.name || 'N/A'}</td>
                                <td><span className="status-badge">{lead.status}</span></td>
                                <td>{lead.assignedTo?.name || 'Unassigned'}</td>
                                {user.role === 'admin' && (
                                    <td>
                                        <button className="btn" style={{ padding: '4px 10px', marginRight: '5px' }} onClick={() => { setCurrentLead(lead); setShowModal(true); }}>Edit</button>
                                        <button className="btn" style={{ padding: '4px 10px', color: '#ff4444' }} onClick={() => handleDelete(lead._id)}>Delete</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <button disabled={page === 1} className="btn" onClick={() => setPage(p => p - 1)}>Prev</button>
                <span style={{ margin: '0 20px' }}>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} className="btn" onClick={() => setPage(p => p + 1)}>Next</button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="form-title">{currentLead._id ? 'Update Lead' : 'Create New Lead'}</h3>
                        <form onSubmit={handleCreateOrUpdate}>
                            <div className="form-group">
                                <label>Name</label>
                                <input className="form-control" value={currentLead.name} onChange={(e) => setCurrentLead({ ...currentLead, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control" value={currentLead.email} onChange={(e) => setCurrentLead({ ...currentLead, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input className="form-control" value={currentLead.phone} onChange={(e) => setCurrentLead({ ...currentLead, phone: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select className="form-control" value={currentLead.status} onChange={(e) => setCurrentLead({ ...currentLead, status: e.target.value })}>
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="Lost">Lost</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Company</label>
                                <select className="form-control" value={currentLead.company?._id || currentLead.company} onChange={(e) => setCurrentLead({ ...currentLead, company: e.target.value })} required>
                                    <option value="">Select Company</option>
                                    {companies.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Assigned To</label>
                                <select className="form-control" value={currentLead.assignedTo?._id || currentLead.assignedTo} onChange={(e) => setCurrentLead({ ...currentLead, assignedTo: e.target.value })} required>
                                    <option value="">Select Employee</option>
                                    {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
