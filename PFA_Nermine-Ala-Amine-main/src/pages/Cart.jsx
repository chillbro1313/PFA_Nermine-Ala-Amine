import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, PackageX } from 'lucide-react';
import '../components/Client.css';
import './Cart.css';

const CartPage = () => {
    const { cart, cartItemCount, cartTotal, updateQuantity, removeItem, clearCart, cartLoading } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState(null);

    if (!token) {
        return (
            <div className="cart-page fade-in">
                <div className="cart-empty">
                    <ShoppingBag size={64} />
                    <h2>Connectez-vous pour voir votre panier</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/login')}>Se Connecter</button>
                </div>
            </div>
        );
    }

    if (cartLoading) {
        return (
            <div className="cart-page fade-in">
                <div className="cart-empty">
                    <div className="loader-pulse"></div>
                    <p>Chargement du panier...</p>
                </div>
            </div>
        );
    }

    const items = cart?.items || [];

    const handleUpdateQty = async (itemId, newQty) => {
        setActionLoading(itemId);
        setMessage(null);
        const result = await updateQuantity(itemId, newQty);
        if (!result.success) {
            setMessage({ type: 'error', text: result.message });
        }
        setActionLoading(null);
    };

    const handleRemove = async (itemId) => {
        setActionLoading(itemId);
        setMessage(null);
        const result = await removeItem(itemId);
        if (!result.success) {
            setMessage({ type: 'error', text: result.message });
        }
        setActionLoading(null);
    };

    const handleClear = async () => {
        if (!window.confirm('Vider tout le panier ?')) return;
        setMessage(null);
        const result = await clearCart();
        if (!result.success) {
            setMessage({ type: 'error', text: result.message });
        }
    };

    return (
        <div className="cart-page fade-in">
            <div className="cart-container">
                {/* Header */}
                <div className="cart-header">
                    <button className="breadcrumb-link" onClick={() => navigate('/products')}>
                        <ArrowLeft size={16} /> Continuer mes achats
                    </button>
                    <h1 className="page-title">Mon Panier ({cartItemCount} article{cartItemCount !== 1 ? 's' : ''})</h1>
                </div>

                {message && (
                    <div className={`alert ${message.type === 'error' ? 'alert-danger' : 'alert-success'} fade-in`}>
                        {message.text}
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <PackageX size={64} />
                        <h2>Votre panier est vide</h2>
                        <p className="text-muted">Découvrez nos produits et ajoutez-les à votre panier</p>
                        <button className="btn btn-primary" onClick={() => navigate('/products')}>
                            Explorer la boutique
                        </button>
                    </div>
                ) : (
                    <div className="cart-layout">
                        {/* Cart Items */}
                        <div className="cart-items">
                            {items.map(item => (
                                <div key={item.id} className="cart-item glass-card fade-in">
                                    <div className="cart-item-image" onClick={() => navigate(`/products/${item.product.id}`)}>
                                        {item.product.imageUrl ? (
                                            <img src={item.product.imageUrl} alt={item.product.name} />
                                        ) : (
                                            <div className="cart-item-placeholder">
                                                <ShoppingBag size={28} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="cart-item-details">
                                        <h3 
                                            className="cart-item-name" 
                                            onClick={() => navigate(`/products/${item.product.id}`)}
                                        >
                                            {item.product.name}
                                        </h3>
                                        <p className="cart-item-price">${item.product.price.toFixed(2)} / unité</p>
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-selector">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                                                disabled={actionLoading === item.id || item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                                                disabled={actionLoading === item.id || item.quantity >= item.product.stock}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <span className="cart-item-subtotal">
                                            ${(item.product.price * item.quantity).toFixed(2)}
                                        </span>

                                        <button
                                            className="cart-remove-btn"
                                            onClick={() => handleRemove(item.id)}
                                            disabled={actionLoading === item.id}
                                            title="Supprimer"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cart Summary */}
                        <div className="cart-summary glass-card">
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
                                <span>Total</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>

                            <button className="btn btn-primary checkout-btn" onClick={() => navigate('/checkout')}>
                                Passer la commande
                            </button>

                            <button className="btn btn-outline clear-cart-btn" onClick={handleClear}>
                                Vider le panier
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
