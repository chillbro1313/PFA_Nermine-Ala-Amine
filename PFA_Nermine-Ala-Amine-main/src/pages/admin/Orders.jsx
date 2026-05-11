import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import './AdminPages.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchOrders = React.useCallback(async () => {
        setLoading(true);
        try {
            const res = await API.get(`/admin/orders?page=${page}&size=10`);
            setOrders(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            setError('Failed to load orders.');
            console.error("Error fetching orders", err);
        } finally {
            setLoading(false);
        }
    }, [page]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/admin/orders/${id}`, { status });
            fetchOrders();
        } catch (err) {
            console.error("Error updating order status", err);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'PENDING': return 'badge-warning';
            case 'SHIPPED': return 'badge-info';
            case 'DELIVERED': return 'badge-success';
            case 'CANCELLED': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    if (loading) return <div className="loader fade-in">Loading orders...</div>;

    if (error) return (
        <div className="fade-in" style={{textAlign: 'center', marginTop: '2rem'}}>
            <div className="alert alert-danger">{error}</div>
            <button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); fetchOrders(); }}>Retry</button>
        </div>
    );

    return (
        <div className="orders-container fade-in">
            <h2 className="page-title">Manage Orders</h2>

            <div className="data-table-container glass-card fade-in">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Quick Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td style={{ fontWeight: 600 }}>${order.totalAmount.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td>
                                    <select 
                                        className="input-field" 
                                        style={{ padding: '0.4rem', width: '130px', fontSize: '0.85rem' }}
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="DELIVERED">Delivered</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No orders found.</td>
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

export default Orders;
