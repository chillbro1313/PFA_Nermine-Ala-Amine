import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, ArrowLeft, Package, Tag, Layers, Check } from 'lucide-react';
import '../components/Client.css';
import './ProductDetail.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';
const getImgUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [addError, setAddError] = useState(null);
    const { addToCart } = useCart();
    const { token } = useAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await API.get(`/products/${id}`);
                setProduct(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('Produit introuvable.');
                } else {
                    setError('Impossible de charger le produit.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleQuantityChange = (delta) => {
        setQuantity(prev => {
            const next = prev + delta;
            if (next < 1) return 1;
            if (product && next > product.stock) return product.stock;
            return next;
        });
    };

    if (loading) {
        return (
            <div className="product-detail-page fade-in">
                <div className="detail-loader">
                    <div className="loader-pulse"></div>
                    <p>Chargement du produit...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="product-detail-page fade-in">
                <div className="detail-error">
                    <h2>{error}</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/products')}>
                        <ArrowLeft size={18} /> Retour à la boutique
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page fade-in">
            <div className="detail-container">
                {/* Breadcrumb */}
                <div className="detail-breadcrumb">
                    <button className="breadcrumb-link" onClick={() => navigate('/products')}>
                        <ArrowLeft size={16} /> Retour à la boutique
                    </button>
                </div>

                <div className="detail-content">
                    {/* Product Image */}
                    <div className="detail-image-section">
                        <div className="detail-image-wrapper glass-card">
                            {product.imageUrl ? (
                                <img 
                                    src={getImgUrl(product.imageUrl)} 
                                    alt={product.name} 
                                    className="detail-image" 
                                />
                            ) : (
                                <div className="detail-image-placeholder">
                                    <Package size={80} />
                                    <p>Pas d'image disponible</p>
                                </div>
                            )}
                            {product.stock <= 0 && (
                                <div className="detail-out-of-stock-overlay">
                                    <span>Rupture de stock</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="detail-info-section">
                        <div className="detail-info-card glass-card">
                            <h1 className="detail-name">{product.name}</h1>
                            
                            <div className="detail-price-row">
                                <span className="detail-price">${product.price.toFixed(2)}</span>
                                <span className={`detail-stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                                    <Layers size={14} />
                                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                                </span>
                            </div>

                            <div className="detail-divider"></div>

                            <div className="detail-description">
                                <h3><Tag size={18} /> Description</h3>
                                <p>{product.description || 'Aucune description disponible pour ce produit.'}</p>
                            </div>

                            <div className="detail-divider"></div>

                            {/* Quantity + Add to Cart */}
                            <div className="detail-actions">
                                <div className="quantity-selector">
                                    <button 
                                        className="qty-btn" 
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1 || product.stock <= 0}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{quantity}</span>
                                    <button 
                                        className="qty-btn" 
                                        onClick={() => handleQuantityChange(1)}
                                        disabled={quantity >= product.stock || product.stock <= 0}
                                    >
                                        +
                                    </button>
                                </div>

                                <button 
                                    className={`btn ${added ? 'btn-success' : 'btn-primary'} detail-add-btn`}
                                    disabled={product.stock <= 0 || added}
                                    onClick={async () => {
                                        if (!token) { navigate('/login'); return; }
                                        setAddError(null);
                                        const result = await addToCart(product.id, quantity);
                                        if (result.success) {
                                            setAdded(true);
                                            setTimeout(() => setAdded(false), 2000);
                                        } else {
                                            setAddError(result.message);
                                        }
                                    }}
                                >
                                    {added ? (<><Check size={20} /> Ajouté au panier !</>) : (<><ShoppingCart size={20} />{product.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}</>)}
                                </button>
                                {addError && <p style={{color: 'var(--danger)', marginTop: '0.5rem', fontSize: '0.9rem'}}>{addError}</p>}
                            </div>

                            {product.stock > 0 && product.stock <= 5 && (
                                <p className="low-stock-warning">
                                    ⚠️ Plus que {product.stock} article{product.stock > 1 ? 's' : ''} restant{product.stock > 1 ? 's' : ''} !
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
