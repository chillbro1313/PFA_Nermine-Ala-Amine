import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { BadgeDollarSign, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import './AdminPages.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProductsSold: 0,
        totalOrders: 0,
        totalProducts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await API.get('/admin/dashboard');
                setStats(res.data);
            } catch (err) {
                setError('Failed to load dashboard data.');
                console.error("Failed to fetch dashboard stats", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loader fade-in">Loading dashboard...</div>;
    
    if (error) return (
        <div className="fade-in" style={{textAlign: 'center', marginTop: '2rem'}}>
            <div className="alert alert-danger">{error}</div>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
        </div>
    );

    return (
        <div className="dashboard-container fade-in">
            <h2 className="page-title">Overview</h2>
            
            <div className="stats-grid">
                <div className="stat-card glass-card">
                    <div className="stat-icon revenue-icon"><BadgeDollarSign size={24} /></div>
                    <div className="stat-details">
                        <p className="stat-label">Total Revenue</p>
                        <h3 className="stat-value">${stats.totalRevenue.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon orders-icon"><ShoppingBag size={24} /></div>
                    <div className="stat-details">
                        <p className="stat-label">Total Orders</p>
                        <h3 className="stat-value">{stats.totalOrders}</h3>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon products-icon"><Package size={24} /></div>
                    <div className="stat-details">
                        <p className="stat-label">Products Active</p>
                        <h3 className="stat-value">{stats.totalProducts}</h3>
                    </div>
                </div>

                <div className="stat-card glass-card">
                    <div className="stat-icon sales-icon"><TrendingUp size={24} /></div>
                    <div className="stat-details">
                        <p className="stat-label">Items Sold</p>
                        <h3 className="stat-value">{stats.totalProductsSold}</h3>
                    </div>
                </div>
            </div>

            {/* Simulated Chart Area */}
            <div className="chart-area glass-card">
                <h3>Revenue Overview</h3>
                <div className="dummy-chart">
                    <div className="bar" style={{ height: '40%' }}></div>
                    <div className="bar" style={{ height: '60%' }}></div>
                    <div className="bar" style={{ height: '30%' }}></div>
                    <div className="bar" style={{ height: '80%' }}></div>
                    <div className="bar" style={{ height: '50%' }}></div>
                    <div className="bar" style={{ height: '90%' }}></div>
                    <div className="bar accent-bar" style={{ height: '100%' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
