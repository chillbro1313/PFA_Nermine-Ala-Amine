import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, User, LogOut, PackageSearch, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar glass-card">
                <div className="sidebar-header">
                    <div className="logo-icon"><PackageSearch size={28} /></div>
                    <h2>Ecom<span className="accent-text">Admin</span></h2>
                </div>
                
                <nav className="sidebar-nav">
                    <ul>
                        <li>
                            <NavLink to="/admin/dashboard" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                                <LayoutDashboard size={20} /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/products" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                                <PackageSearch size={20} /> Products
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/orders" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                                <ShoppingCart size={20} /> Orders
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/users" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                                <Users size={20} /> Users
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/profile" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                                <User size={20} /> Profile
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar">{user?.name?.charAt(0) || 'A'}</div>
                        <div>
                            <p className="user-name">{user?.name || 'Admin'}</p>
                            <p className="user-role">Administrator</p>
                        </div>
                    </div>
                    <button className="btn btn-danger logout-btn" onClick={handleLogout}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar glass-card fade-in">
                    <h1>Welcome back, <span className="accent-text">{user?.name}</span> 👋</h1>
                </header>
                <div className="admin-content fade-in">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
