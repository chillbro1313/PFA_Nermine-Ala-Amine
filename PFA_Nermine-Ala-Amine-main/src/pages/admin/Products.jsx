import React, { useEffect, useState, useRef, useCallback } from 'react';
import API from '../../api/axios';
import { Edit, Plus, Trash2, Upload, X, Image, Package, Search, Eye, ChevronDown } from 'lucide-react';
import './AdminPages.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [viewProduct, setViewProduct] = useState(null);

    const initialFormState = { name: '', description: '', price: '', stock: '', category: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await API.get(`/admin/products?page=${page}&size=10&search=${searchTerm}`);
            setProducts(res.data.content || []);
            setTotalPages(res.data.totalPages || 0);
        } catch (err) {
            setError('Failed to load products.');
            console.error("Error fetching products", err);
        } finally {
            setLoading(false);
        }
    }, [page, searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchProducts]);

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const openAddForm = () => {
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData(initialFormState);
        setImageFile(null);
        setImagePreview(null);
        setShowForm(true);
    };

    const openEditForm = (product) => {
        setIsEditing(true);
        setCurrentProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category: product.category || ''
        });
        setImageFile(null);
        // Show existing image as preview
        if (product.imageUrl) {
            const imgUrl = product.imageUrl.startsWith('http') ? product.imageUrl : `${BASE_URL}${product.imageUrl}`;
            setImagePreview(imgUrl);
        } else {
            setImagePreview(null);
        }
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setIsEditing(false);
        setCurrentProduct(null);
        setFormData(initialFormState);
        setImageFile(null);
        setImagePreview(null);
    };

    // ─── Drag & Drop handlers ───
    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    }, []);

    const handleFileSelect = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPG, PNG, GIF, WEBP)');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await API.delete(`/admin/products/${id}`);
            showSuccess('Product deleted successfully!');
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const fd = new FormData();
            fd.append('name', formData.name);
            fd.append('description', formData.description);
            fd.append('price', parseFloat(formData.price));
            fd.append('stock', parseInt(formData.stock, 10));
            fd.append('category', formData.category || '');

            if (imageFile) {
                fd.append('image', imageFile);
            }

            if (isEditing && currentProduct) {
                await API.put(`/admin/products/${currentProduct.id}`, fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showSuccess('Product updated successfully!');
            } else {
                await API.post('/admin/products', fd, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showSuccess('Product created successfully!');
            }

            closeForm();
            fetchProducts();
        } catch (err) {
            console.error("Error saving product", err);
            alert('Failed to save product. Please check all fields and try again.');
        } finally {
            setSaving(false);
        }
    };

    const getImageUrl = (product) => {
        if (!product.imageUrl) return null;
        return product.imageUrl.startsWith('http') ? product.imageUrl : `${BASE_URL}${product.imageUrl}`;
    };

    // Server-side filtering replaces client-side filtering
    const filteredProducts = products;

    if (loading) return (
        <div className="product-loading fade-in">
            <div className="loading-spinner"></div>
            <p>Loading products...</p>
        </div>
    );

    if (error) return (
        <div className="fade-in" style={{ textAlign: 'center', marginTop: '2rem' }}>
            <div className="alert alert-danger">{error}</div>
            <button className="btn btn-primary" onClick={() => { setError(null); setLoading(true); fetchProducts(); }}>Retry</button>
        </div>
    );

    return (
        <div className="products-page fade-in">
            {/* Success Banner */}
            {successMsg && (
                <div className="success-banner fade-in">
                    <span>✓</span> {successMsg}
                </div>
            )}

            {/* Product Detail Modal */}
            {viewProduct && (
                <div className="product-modal-overlay" onClick={() => setViewProduct(null)}>
                    <div className="product-modal glass-card fade-in" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setViewProduct(null)}><X size={20} /></button>
                        <div className="modal-content">
                            <div className="modal-image-section">
                                {getImageUrl(viewProduct) ? (
                                    <img src={getImageUrl(viewProduct)} alt={viewProduct.name} className="modal-product-image" />
                                ) : (
                                    <div className="modal-no-image">
                                        <Image size={64} />
                                        <p>No image</p>
                                    </div>
                                )}
                            </div>
                            <div className="modal-details-section">
                                <h2>{viewProduct.name}</h2>
                                {viewProduct.category && <span className="badge badge-info">{viewProduct.category}</span>}
                                <div className="modal-price">${viewProduct.price.toFixed(2)}</div>
                                <div className="modal-stock">
                                    <span className={`badge ${viewProduct.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                                        {viewProduct.stock > 0 ? `${viewProduct.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                                <div className="modal-description">
                                    <h4>Description</h4>
                                    <p>{viewProduct.description || 'No description available.'}</p>
                                </div>
                                <div className="modal-actions">
                                    <button className="btn btn-primary" onClick={() => { setViewProduct(null); openEditForm(viewProduct); }}>
                                        <Edit size={16} /> Edit Product
                                    </button>
                                    <button className="btn btn-danger" onClick={() => { setViewProduct(null); handleDelete(viewProduct.id); }}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="products-header">
                <div>
                    <h2 className="page-title">
                        <Package size={28} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
                        Product Management
                    </h2>
                    <p className="page-subtitle">Manage your inventory</p>
                </div>
                {!showForm && (
                    <button className="btn btn-primary add-product-btn" onClick={openAddForm}>
                        <Plus size={18} /> Add Product
                    </button>
                )}
            </div>

            {/* Search & Filters */}
            {!showForm && (
                <div className="products-toolbar glass-card">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            className="input-field search-input"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                        />
                    </div>
                </div>
            )}

            {/* ─── ADD / EDIT FORM ─── */}
            {showForm && (
                <div className="product-form-container glass-card fade-in">
                    <div className="form-header">
                        <h3>{isEditing ? '✏️ Edit Product' : '➕ New Product'}</h3>
                        <button className="btn btn-close-form" onClick={closeForm}>
                            <X size={18} /> Cancel
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-layout">
                            {/* Left: Image Upload */}
                            <div className="form-image-section">
                                <label className="form-label">Product Image</label>
                                <div
                                    className={`dropzone ${dragActive ? 'dropzone-active' : ''} ${imagePreview ? 'has-image' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {imagePreview ? (
                                        <div className="dropzone-preview">
                                            <img src={imagePreview} alt="Preview" />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="dropzone-placeholder">
                                            <Upload size={36} />
                                            <p className="dropzone-text">Drag & drop an image here</p>
                                            <p className="dropzone-hint">or click to browse</p>
                                            <p className="dropzone-formats">JPG, PNG, WEBP • Max 10MB</p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileInputChange}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Right: Fields */}
                            <div className="form-fields-section">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Product Name <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="Enter product name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            placeholder="e.g. Electronics, Clothing"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Price ($) <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="input-field"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Stock Quantity <span className="required">*</span></label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="input-field"
                                            placeholder="0"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description <span className="required">*</span></label>
                                    <textarea
                                        className="input-field product-textarea"
                                        rows="5"
                                        placeholder="Describe your product in detail..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={`btn btn-primary submit-product-btn ${saving ? 'btn-loading' : ''}`}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            {isEditing ? <Edit size={16} /> : <Plus size={16} />}
                                            {isEditing ? 'Update Product' : 'Create Product'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* ─── PRODUCT CARDS GRID ─── */}
            {!showForm && (
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card glass-card">
                            <div className="product-card-image" onClick={() => setViewProduct(product)}>
                                {getImageUrl(product) ? (
                                    <img src={getImageUrl(product)} alt={product.name} />
                                ) : (
                                    <div className="no-image-placeholder">
                                        <Image size={40} />
                                        <span>No image</span>
                                    </div>
                                )}
                                <div className="product-card-overlay">
                                    <Eye size={20} />
                                    <span>View Details</span>
                                </div>
                            </div>
                            <div className="product-card-body">
                                <div className="product-card-header">
                                    <h4 className="product-card-name">{product.name}</h4>
                                    <span className="product-card-price">${product.price.toFixed(2)}</span>
                                </div>
                                {product.category && (
                                    <span className="badge badge-info product-card-category">{product.category}</span>
                                )}
                                <p className="product-card-desc">
                                    {product.description ? (product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description) : 'No description'}
                                </p>
                                <div className="product-card-footer">
                                    <span className={`badge ${product.stock > 0 ? 'badge-success' : 'badge-danger'}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                    </span>
                                    <div className="product-card-actions">
                                        <button className="btn btn-icon btn-edit" title="Edit" onClick={() => openEditForm(product)}>
                                            <Edit size={16} />
                                        </button>
                                        <button className="btn btn-icon btn-delete" title="Delete" onClick={() => handleDelete(product.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="empty-state">
                            <Package size={64} />
                            <h3>{searchTerm ? 'No products match your search' : 'No products yet'}</h3>
                            <p>{searchTerm ? 'Try adjusting your search.' : 'Start by adding your first product!'}</p>
                            {!searchTerm && (
                                <button className="btn btn-primary" onClick={openAddForm}>
                                    <Plus size={16} /> Add Your First Product
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {!showForm && totalPages > 1 && (
                <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button 
                        className="btn" 
                        disabled={page === 0} 
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span style={{ display: 'flex', alignItems: 'center' }}>Page {page + 1} of {totalPages}</span>
                    <button 
                        className="btn" 
                        disabled={page >= totalPages - 1} 
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
