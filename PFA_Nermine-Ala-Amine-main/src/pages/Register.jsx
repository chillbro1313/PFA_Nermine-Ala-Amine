import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, KeyRound, User, PackageSearch, ArrowLeft } from 'lucide-react';
import './Login.css';
import './Register.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (formData.name.trim().length < 2) {
            setError('Name must be at least 2 characters.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            const res = await API.post('/auth/register', {
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password
            });

            const { token, role, ...userData } = res.data;
            login(token, { ...userData, role });
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card register-card glass-card fade-in">
                <div className="login-header">
                    <div className="logo-icon-large register-icon">
                        <PackageSearch size={36} />
                    </div>
                    <h2>Créer un Compte</h2>
                    <p className="text-muted">Rejoignez Ecom<span className="accent-text">Store</span> et commencez vos achats</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="alert alert-danger fade-in">
                            {error}
                        </div>
                    )}

                    <div className="form-group-with-icon">
                        <User className="input-icon" size={18} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Nom complet"
                            className="input-field icon-padding"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group-with-icon">
                        <Mail className="input-icon" size={18} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Adresse email"
                            className="input-field icon-padding"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group-with-icon">
                        <KeyRound className="input-icon" size={18} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe (min. 6 caractères)"
                            className="input-field icon-padding"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="form-group-with-icon">
                        <KeyRound className="input-icon" size={18} />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmer le mot de passe"
                            className="input-field icon-padding"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary login-submit register-submit" disabled={loading}>
                        {loading ? (
                            <>Création du compte...</>
                        ) : (
                            <><UserPlus size={18} /> Créer mon compte</>
                        )}
                    </button>

                    <div className="register-footer">
                        <p className="text-muted">
                            Vous avez déjà un compte ?{' '}
                            <Link to="/login" className="register-link">Se connecter</Link>
                        </p>
                    </div>
                </form>
            </div>

            {/* Background decors */}
            <div className="bg-shape shape-1"></div>
            <div className="bg-shape shape-2"></div>
            <div className="bg-shape shape-3"></div>
        </div>
    );
};

export default Register;
