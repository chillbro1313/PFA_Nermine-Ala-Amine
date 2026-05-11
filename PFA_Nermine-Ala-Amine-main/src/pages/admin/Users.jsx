import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Trash2, ShieldCheck, UserCircle, Users as UsersIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AdminPages.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { user: currentUser } = useAuth();

    const fetchUsers = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await API.get(`/admin/users?page=${page}&size=10`);
            setUsers(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
            setTotalElements(res.data.totalElements || 0);
        } catch (err) {
            setError('Failed to load users.');
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId, newRole) => {
        if (!window.confirm(`Change this user's role to ${newRole === 'ROLE_ADMIN' ? 'Admin' : 'Client'}?`)) return;
        setActionLoading(userId);
        try {
            await API.put(`/admin/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update role.';
            alert(msg);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;
        setActionLoading(userId);
        try {
            await API.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete user.';
            alert(msg);
        } finally {
            setActionLoading(null);
        }
    };

    const getRoleBadge = (role) => {
        return role === 'ROLE_ADMIN' ? 'badge-info' : 'badge-success';
    };

    const getRoleLabel = (role) => {
        return role === 'ROLE_ADMIN' ? 'Admin' : 'Client';
    };

    // Note: To get precise counts for all pages, we'd need a backend stats endpoint.
    // We'll show the paginated elements count or you can fetch total counts separately.

    if (loading) return <div className="loader fade-in">Loading users...</div>;

    if (error) return (
        <div className="fade-in" style={{textAlign: 'center', marginTop: '2rem'}}>
            <div className="alert alert-danger">{error}</div>
            <button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); fetchUsers(); }}>Retry</button>
        </div>
    );

    return (
        <div className="users-container fade-in">
            <h2 className="page-title">User Management</h2>

            {/* Stats Cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                        <UsersIcon size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Total Users</p>
                        <h3 className="stat-value">{totalElements}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                        <ShieldCheck size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Page Admins</p>
                        <h3 className="stat-value">{users.filter(u => u.role === 'ROLE_ADMIN').length}</h3>
                    </div>
                </div>
                <div className="stat-card glass-card">
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                        <UserCircle size={24} />
                    </div>
                    <div className="stat-details">
                        <p className="stat-label">Page Clients</p>
                        <h3 className="stat-value">{users.filter(u => u.role === 'ROLE_CLIENT').length}</h3>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="data-table-container glass-card fade-in">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Change Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => {
                            const isSelf = currentUser && currentUser.email === u.email;
                            return (
                                <tr key={u.id}>
                                    <td style={{ color: 'var(--text-muted)' }}>#{u.id}</td>
                                    <td style={{ fontWeight: 500 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: u.role === 'ROLE_ADMIN' ? 'var(--accent)' : 'var(--success)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 700, fontSize: '0.85rem'
                                            }}>
                                                {u.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            {u.name}
                                            {isSelf && <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>You</span>}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td>
                                        <span className={`badge ${getRoleBadge(u.role)}`}>
                                            {getRoleLabel(u.role)}
                                        </span>
                                    </td>
                                    <td>
                                        {isSelf ? (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                                        ) : (
                                            <select
                                                className="input-field"
                                                style={{ padding: '0.4rem', width: '120px', fontSize: '0.85rem' }}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                disabled={actionLoading === u.id}
                                            >
                                                <option value="ROLE_CLIENT">Client</option>
                                                <option value="ROLE_ADMIN">Admin</option>
                                            </select>
                                        )}
                                    </td>
                                    <td>
                                        {isSelf ? (
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                                        ) : (
                                            <button
                                                className="btn"
                                                style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)', padding: '0.35rem 0.5rem' }}
                                                onClick={() => handleDelete(u.id, u.name)}
                                                disabled={actionLoading === u.id}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button 
                        className="btn" 
                        disabled={page === 0} 
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center' }}>Page {page + 1} of {totalPages}</span>
                    <button 
                        className="btn" 
                        disabled={page >= totalPages - 1} 
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Users;
