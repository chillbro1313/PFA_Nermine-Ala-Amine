import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Save, UserCircle } from 'lucide-react';
import './AdminPages.css';

const Profile = () => {
    const { user, login, token } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const updates = { name: formData.name };
            // Only include password if changed
            if (formData.password) {
                updates.password = formData.password;
            }
            // NOTE: Email change is intentionally excluded because it would invalidate the current JWT
            const res = await API.put('/admin/profile', updates);
            
            // Update context with new data
            login(token, { ...res.data, role: user.role });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setFormData({ ...formData, password: '' });
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to update profile.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-container fade-in">
            <h2 className="page-title">Admin Profile</h2>

            <div className="profile-card glass-card">
                <div className="profile-header">
                    <UserCircle size={80} className="profile-avatar-icon" />
                    <div>
                        <h3>{user?.name}</h3>
                        <p className="text-muted">{user?.role}</p>
                    </div>
                </div>

                <form className="profile-form" onSubmit={handleSubmit}>
                    {message && (
                        <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            className="input-field" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address <span className="text-muted">(read-only)</span></label>
                        <input 
                            type="email" 
                            name="email" 
                            className="input-field" 
                            value={formData.email} 
                            disabled
                            style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password <span className="text-muted">(Leave blank to keep current)</span></label>
                        <input 
                            type="password" 
                            name="password" 
                            className="input-field" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn" disabled={loading}>
                        <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
