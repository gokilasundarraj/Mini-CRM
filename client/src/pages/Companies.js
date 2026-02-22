import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [industry, setIndustry] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const fetchCompanies = async () => {
        try {
            const res = await axios.get('https://mini-crm-xl4y.onrender.com/api/companies', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompanies(res.data);
        } catch (err) {
            console.error('Error fetching companies', err);
        }
    };

    const fetchCompanyDetail = async (id) => {
        try {
            const res = await axios.get(`https://mini-crm-xl4y.onrender.com/api/companies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedCompany(res.data);
        } catch (err) {
            alert('Error fetching company details');
        }
    };

    useEffect(() => {
        fetchCompanies();
       
    }, []);

    const handleDelete = async (id, e) => {
        e.stopPropagation(); 
        if (!window.confirm('Are you sure you want to delete this company?')) return;
        try {
            await axios.delete(`https://mini-crm-xl4y.onrender.com/api/companies/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCompanies();
        } catch (err) {
            alert(err.response?.data?.error || 'Error deleting company');
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://mini-crm-xl4y.onrender.com/api/companies', { name, industry }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setName('');
            setIndustry('');
            fetchCompanies();
        } catch (err) {
            alert('Error creating company');
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h2>Company Management</h2>
                {user.role === 'admin' && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Company</button>
                )}
            </div>

            <div className="grid">
                {companies.map(company => (
                    <div key={company._id} className="card" onClick={() => fetchCompanyDetail(company._id)} style={{ cursor: 'pointer' }}>
                        <h3>{company.name}</h3>
                        <p>{company.industry || 'No industry specified'}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#555' }}>Click to view details</span>
                            {user.role === 'admin' && (
                                <button
                                    onClick={(e) => handleDelete(company._id, e)}
                                    style={{ background: 'transparent', border: 'none', color: '#ff4444', cursor: 'pointer', fontSize: '0.8rem' }}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedCompany && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)', padding: '50px', zIndex: 1100, overflowY: 'auto' }}>
                    <button className="btn" style={{ marginBottom: '20px' }} onClick={() => setSelectedCompany(null)}>&larr; Back to List</button>
                    <div className="fade-in">
                        <h1 style={{ fontSize: '3rem' }}>{selectedCompany.company.name}</h1>
                        <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '40px' }}>{selectedCompany.company.industry || 'N/A'}</p>

                        <h3>Associated Leads</h3>
                        <div className="table-container" style={{ marginTop: '20px' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedCompany.leads.map(lead => (
                                        <tr key={lead._id}>
                                            <td>{lead.name}</td>
                                            <td>{lead.email}</td>
                                            <td><span className="status-badge">{lead.status}</span></td>
                                        </tr>
                                    ))}
                                    {selectedCompany.leads.length === 0 && (
                                        <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No leads associated with this company.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="form-title">Create New Company</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Company Name</label>
                                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Industry</label>
                                <input className="form-control" value={industry} onChange={(e) => setIndustry(e.target.value)} />
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

export default Companies;
