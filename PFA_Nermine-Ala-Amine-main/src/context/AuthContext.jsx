import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [role, setRole] = useState(localStorage.getItem('role') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setLoading(false);
                }
            } catch(e) {
                logout();
            }
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = (tokenData, userData) => {
        setToken(tokenData);
        setUser(userData);
        setRole(userData.role);
        // Persist everything so it survives page refresh
        localStorage.setItem('token', tokenData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', userData.role);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
