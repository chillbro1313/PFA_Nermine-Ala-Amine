import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { ShoppingBag, CheckCircle, AlertTriangle, ArrowLeft, Package, CreditCard, Truck } from 'lucide-react';
import '../components/Client.css';
import './Checkout.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
const getImgUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
};

const Checkout = () => {
    const { cart, cartItemCount, cartTotal, fetchCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [error, setError] = useState(null);

    if (!token) {
        navigate('/login');
        return null;
    }

    const items = cart?.items || [];

    if (!orderSuccess && items.length === 0) {
        return (
            <div className="checkout-page fade-in">
                <div className="checkout-empty">
                    <ShoppingBag size={64} />
                    <h2>Votre panier est vide</h2>
                    <p>Ajoutez des produits avant de passer commande</p>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        Explorer la boutique
                    </button>
                </div>
            </div>
        );
    }

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post('/orders/checkout');
            setOrderSuccess(res.data);
            fetchCart(); // Refresh cart (will be empty now)
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Échec de la commande. Veuillez réessayer.';
            setError(typeof msg === 'string' ? msg : 'Échec de la commande.');
        } finally {
            setLoading(false);
        }
    };

    // ─── Order Success ───
    if (orderSuccess) {
        return (
            <div className="checkout-page fade-in">
                <div className="checkout-success glass-card">
                    <div className="success-icon-wrapper">
                        <CheckCircle size={64} />
                    </div>
                    <h2>Commande confirmée ! 🎉</h2>
                    <p className="success-order-id">Commande #{orderSuccess.id}</p>
                    <p className="success-message">
                        Votre commande de <strong>${orderSuccess.totalAmount?.toFixed(2)}</strong> a été passée avec succès.
                    </p>

                    <div className="success-timeline">
                        <div className="timeline-step active">
                            <CheckCircle size={20} />
                            <span>Confirmée</span>
                        </div>
                        <div className="timeline-line"></div>
                        <div className="timeline-step">
                            <Package size={20} />
                            <span>Préparation</span>
                        </div>
                        <div className="timeline-line"></div>
                        <div className="timeline-step">
                            <Truck size={20} />
                            <span>Livraison</span>
                        </div>
                    </div>

                    <div className="success-actions">
                        <button className="btn btn-primary" onClick={() => navigate('/my-orders')}>
                            Voir mes commandes
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate('/products')}>
                            Continuer mes achats
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Checkout Review ───
    return (
        <div className="checkout-page fade-in">
            <div className="checkout-container">
                <div className="checkout-header">
                    <button className="breadcrumb-link" onClick={() => navigate('/cart')}>
                        <ArrowLeft size={16} /> Retour au panier
                    </button>
                    <h1 className="page-title">Finaliser la commande</h1>
                </div>

                {error && (
                    <div className="alert alert-danger fade-in">
                        <AlertTriangle size={18} style={{ marginRight: '0.5rem', flexShrink: 0 }} />
                        {error}
                    </div>
                )}

                <div className="checkout-layout">
                    {/* Order Items Review */}
                    <div className="checkout-items">
                        <div className="checkout-section glass-card">
                            <h3><Package size={20} /> Articles ({cartItemCount})</h3>
                            <div className="checkout-items-list">
                                {items.map(item => (
                                    <div key={item.id} className="checkout-item">
                                        <div className="checkout-item-img">
                                            {item.product.imageUrl ? (
                                                <img src={getImgUrl(item.product.imageUrl)} alt={item.product.name} />
                                            ) : (
                                                <div className="checkout-item-placeholder"><ShoppingBag size={20} /></div>
                                            )}
                                        </div>
                                        <div className="checkout-item-info">
                                            <h4>{item.product.name}</h4>
                                            <p className="checkout-item-qty">Qté: {item.quantity}</p>
                                        </div>
                                        <span className="checkout-item-price">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="checkout-section glass-card">
                            <h3><Truck size={20} /> Livraison</h3>
                            <div className="shipping-info">
                                <p className="shipping-method">📦 Livraison standard</p>
                                <span className="shipping-price text-success">Gratuite</span>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="checkout-summary glass-card">
                        <h3>Récapitulatif</h3>

                        <div className="summary-row">
                            <span>Sous-total ({cartItemCount} articles)</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Livraison</span>
                            <span className="text-success">Gratuite</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row summary-total">
                            <span>Total à payer</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <button
                            className={`btn btn-primary checkout-confirm-btn ${loading ? 'btn-loading' : ''}`}
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? (
                                <><span className="btn-spinner"></span> Traitement...</>
                            ) : (
                                <><CreditCard size={18} /> Confirmer la commande</>
                            )}
                        </button>

                        <p className="checkout-note">
                            En confirmant, vous acceptez nos conditions de vente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
