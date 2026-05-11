import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

import ClientLayout from './components/ClientLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Dashboard from './pages/admin/Dashboard';
import Profile from './pages/admin/Profile';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';

function AppRoutes() {
  const { role, token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token && role === 'ROLE_ADMIN' ? <Navigate to="/admin/dashboard" replace /> : token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />
      
      {/* Espace Client (Public) avec Navbar et Footer */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />
      </Route>

      {/* Admin Space */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppRoutes />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
