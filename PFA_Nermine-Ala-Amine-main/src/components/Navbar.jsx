import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { PackageSearch, ShoppingCart, User, UserPlus, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Client.css';

const Navbar = () => {
    const { user, role, logout } = useAuth();
    const { cartItemCount } = useCart();
    const navigate = useNavigate();

    return (
        <nav className="client-navbar glass-card">
            <div className="nav-container">
                <div className="nav-logo" onClick={() => navigate('/')}>
                    <PackageSearch size={28} className="logo-icon" />
                    <h2>Ecom<span className="accent-text">Store</span></h2>
                </div>
                
                <div className="nav-links">
                    <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>Accueil</NavLink>
                    <NavLink to="/products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>Nos Produits</NavLink>
                </div>

                <div className="nav-actions">
                    <button className="icon-btn" onClick={() => navigate('/cart')}>
                        <ShoppingCart size={22} />
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                        )}
                    </button>
                    
                    {user ? (
                        <div className="user-menu">
                            <span className="user-greeting">Salut, {user.name}</span>
                            <button className="btn btn-outline" onClick={() => navigate('/my-orders')} title="Mes Commandes">
                                <ClipboardList size={16} /> Commandes
                            </button>
                            {role === 'ROLE_ADMIN' && (
                                <button className="btn btn-outline" onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
                            )}
                            <button className="btn btn-primary" onClick={() => { logout(); navigate('/'); }}>Déconnexion</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button className="btn btn-outline" onClick={() => navigate('/login')}>
                                Se Connecter
                            </button>
                            <button className="btn btn-primary" onClick={() => navigate('/register')}>
                                <UserPlus size={18} /> S'inscrire
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
