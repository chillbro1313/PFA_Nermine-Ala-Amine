import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Package, ShoppingBag, ArrowLeft, ChevronDown, ChevronUp, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import '../components/Client.css';
import './MyOrders.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
const getImgUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
};

const statusConfig = {
    PENDING:   { label: 'En attente',  icon: Clock,       badge: 'badge-warning', color: '#f59e0b' },
    SHIPPED:   { label: 'Expédiée',    icon: Truck,       badge: 'badge-info',    color: '#3b82f6' },
    DELIVERED: { label: 'Livrée',      icon: CheckCircle, badge: 'badge-success', color: '#10b981' },
    CANCELLED: { label: 'Annulée',     icon: XCircle,     badge: 'badge-danger',  color: '#ef4444' },
};

const MyOrders = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        try {
            const res = await API.get('/orders/my-orders');
            setOrders(res.data);
        } catch (err) {
            setError('Impossible de charger vos commandes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    if (loading) return (
        <div className="my-orders-page fade-in">
            <div className="orders-loading">
                <div className="loader-pulse"></div>
                <p>Chargement de vos commandes...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="my-orders-page fade-in">
            <div className="orders-loading">
                <p style={{ color: 'var(--danger)' }}>{error}</p>
                <button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); fetchOrders(); }}>
                    Réessayer
                </button>
            </div>
        </div>
    );

    return (
        <div className="my-orders-page fade-in">
            <div className="my-orders-container">
                <div className="my-orders-header">
                    <button className="breadcrumb-link" onClick={() => navigate('/products')}>
                        <ArrowLeft size={16} /> Retour à la boutique
                    </button>
                    <h1 className="page-title">Mes Commandes</h1>
                    <p className="text-muted">{orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
                </div>

                {orders.length === 0 ? (
                    <div className="orders-empty">
                        <ShoppingBag size={64} />
                        <h2>Aucune commande</h2>
                        <p>Vous n'avez pas encore passé de commande.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/products')}>
                            Explorer la boutique
                        </button>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => {
                            const config = statusConfig[order.status] || statusConfig.PENDING;
                            const StatusIcon = config.icon;
                            const isExpanded = expandedId === order.id;

                            return (
                                <div key={order.id} className="order-card glass-card">
                                    <div className="order-card-header" onClick={() => toggleExpand(order.id)}>
                                        <div className="order-card-left">
                                            <div className="order-status-icon" style={{ background: `${config.color}20`, color: config.color }}>
                                                <StatusIcon size={20} />
                                            </div>
                                            <div>
                                                <h4>Commande #{order.id}</h4>
                                                <p className="order-date">
                                                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric', month: 'long', year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="order-card-right">
                                            <span className={`badge ${config.badge}`}>{config.label}</span>
                                            <span className="order-total">${order.totalAmount.toFixed(2)}</span>
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="order-card-details fade-in">
                                            <div className="order-items-list">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="order-detail-item">
                                                        <div className="order-detail-img">
                                                            {item.product?.imageUrl ? (
                                                                <img src={getImgUrl(item.product.imageUrl)} alt={item.product.name} />
                                                            ) : (
                                                                <div className="order-detail-placeholder"><Package size={18} /></div>
                                                            )}
                                                        </div>
                                                        <div className="order-detail-info">
                                                            <span className="order-detail-name">{item.product?.name || 'Produit'}</span>
                                                            <span className="order-detail-qty">× {item.quantity}</span>
                                                        </div>
                                                        <span className="order-detail-price">${(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-detail-total">
                                                <span>Total</span>
                                                <span>${order.totalAmount.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
