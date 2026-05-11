import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { token } = useAuth();
    const [cart, setCart] = useState(null);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartError, setCartError] = useState(null);

    const cartItemCount = cart?.totalItems || 0;
    const cartTotal = cart?.totalAmount || 0;

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCart(null);
            return;
        }
        setCartLoading(true);
        setCartError(null);
        try {
            const res = await API.get('/cart');
            setCart(res.data);
        } catch (err) {
            // Don't show error for unauthenticated users
            if (err.response?.status !== 401) {
                setCartError('Failed to load cart');
            }
        } finally {
            setCartLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await API.post('/cart/add', { productId, quantity });
            setCart(res.data);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to add to cart';
            return { success: false, message };
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const res = await API.put(`/cart/item/${itemId}`, { quantity });
            setCart(res.data);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update quantity';
            return { success: false, message };
        }
    };

    const removeItem = async (itemId) => {
        try {
            const res = await API.delete(`/cart/item/${itemId}`);
            setCart(res.data);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to remove item';
            return { success: false, message };
        }
    };

    const clearCart = async () => {
        try {
            const res = await API.delete('/cart/clear');
            setCart(res.data);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to clear cart';
            return { success: false, message };
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartItemCount,
            cartTotal,
            cartLoading,
            cartError,
            addToCart,
            updateQuantity,
            removeItem,
            clearCart,
            fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
