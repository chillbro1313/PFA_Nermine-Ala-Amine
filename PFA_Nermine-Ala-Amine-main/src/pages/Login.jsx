import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { KeyRound, Mail, PackageSearch } from 'lucide-react';
import './Login.css';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await API.post('/auth/login', credentials);
            const { token, role, ...userData } = res.data;
            login(token, { ...userData, role });
            
            if (role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            const message = err.response?.data?.message || 'Invalid credentials';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-card fade-in">
                <div className="login-header">
                    <div className="logo-icon-large">
                        <PackageSearch size={36} />
                    </div>
                    <h2>Welcome to Ecom<span className="accent-text">Admin</span></h2>
                    <p className="text-muted">Sign in to manage your ecommerce platform</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    
                    <div className="form-group-with-icon">
                        <Mail className="input-icon" size={18} />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email address"
                            className="input-field icon-padding" 
                            value={credentials.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group-with-icon">
                        <KeyRound className="input-icon" size={18} />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            className="input-field icon-padding" 
                            value={credentials.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                    
                    <div className="login-footer">
                        <p className="text-muted" style={{fontSize: '0.85rem'}}>
                            Pas encore de compte ?{' '}
                            <Link to="/register" className="login-link">Créer un compte</Link>
                        </p>
                    </div>
                </form>
            </div>
            
            {/* Background decors */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
        </div>
    );
};

export default Login;
