import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', lead: '', assignedTo: '', dueDate: '', status: 'Pending' });
    const [leads, setLeads] = useState([]);
    const [employees, setEmployees] = useState([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const fetchTasks = useCallback(async () => {
        try {
            const res = await axios.get('https://mini-crm-xl4y.onrender.com/api/tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        }
    }, [token]);

    const fetchDependencies = useCallback(async () => {
        if (user.role !== 'admin') return;
        try {
            const [leadRes, empRes] = await Promise.all([
                axios.get('https://mini-crm-xl4y.onrender.com/api/leads?limit=100', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('https://mini-crm-xl4y.onrender.com/api/users', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setLeads(leadRes.data.leads);
            setEmployees(empRes.data);
        } catch (err) {
            console.error('Error fetching dependencies', err);
        }
    }, [token, user.role]);

    useEffect(() => {
        fetchTasks();
        fetchDependencies();
    }, [fetchTasks, fetchDependencies]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://mini-crm-xl4y.onrender.com/api/tasks', newTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setNewTask({ title: '', lead: '', assignedTo: '', dueDate: '', status: 'Pending' });
            fetchTasks();
        } catch (err) {
            alert('Error creating task');
        }
    };

    const updateStatus = async (taskId, newStatus) => {
        try {
            await axios.patch(`https://mini-crm-xl4y.onrender.com/api/tasks/${taskId}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await axios.delete(`https://mini-crm-xl4y.onrender.com/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert(err.response?.data?.error || 'Error deleting task');
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h2>Tasks</h2>
                {user.role === 'admin' && (
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Create Task</button>
                )}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Lead</th>
                            <th>Assigned To</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task._id}>
                                <td>{task.title}</td>
                                <td>{task.lead?.name || 'N/A'}</td>
                                <td>{task.assignedTo?.name || 'Unassigned'}</td>
                                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                <td><span className="status-badge">{task.status}</span></td>
                                <td>
                                    {user.role === 'employee' && task.status !== 'Completed' && (
                                        <button className="btn btn-primary" style={{ padding: '4px 10px', marginRight: '5px' }} onClick={() => updateStatus(task._id, 'Completed')}>Mark Completed</button>
                                    )}
                                    {user.role === 'admin' && (
                                        <button className="btn" style={{ padding: '4px 10px', color: '#ff4444' }} onClick={() => handleDelete(task._id)}>Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="form-title">Create New Task</h3>
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label>Task Title</label>
                                <input className="form-control" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Associated Lead</label>
                                <select className="form-control" value={newTask.lead} onChange={(e) => setNewTask({ ...newTask, lead: e.target.value })} required>
                                    <option value="">Select Lead</option>
                                    {leads.map(l => <option key={l._id} value={l._id}>{l.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Assign To</label>
                                <select className="form-control" value={newTask.assignedTo} onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })} required>
                                    <option value="">Select Employee</option>
                                    {employees.map(e => <option key={e._id} value={e._id}>{e.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input type="date" className="form-control" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} required />
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

export default Tasks;
