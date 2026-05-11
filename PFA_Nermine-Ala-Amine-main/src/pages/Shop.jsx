import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Check, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import '../components/Client.css';
import '../components/Shop.css';

const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8080';

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
};

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { token } = useAuth();
    const [addedId, setAddedId] = useState(null);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const handleAddToCart = async (e, productId) => {
        e.stopPropagation();
        if (!token) {
            navigate('/login');
            return;
        }
        const result = await addToCart(productId, 1);
        if (result.success) {
            setAddedId(productId);
            setTimeout(() => setAddedId(null), 1500);
        } else {
            alert(result.message);
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await API.get(`/products?page=${currentPage}&size=8&search=${searchTerm}`);
                setProducts(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);
            } catch (err) {
                setError('Impossible de charger les produits. Veuillez réessayer.');
                console.error("Erreur de chargement des produits", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentPage, searchTerm]);

    if (loading && products.length === 0) return <div className="loader fade-in" style={{textAlign: 'center', marginTop: '4rem'}}>Chargement de la boutique...</div>;
    
    if (error) return (
        <div className="fade-in" style={{textAlign: 'center', marginTop: '4rem', color: 'var(--danger)'}}>
            <p>{error}</p>
            <button className="btn btn-primary" style={{marginTop: '1rem'}} onClick={() => window.location.reload()}>Réessayer</button>
        </div>
    );

    return (
        <div className="shop-page fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem 5%' }}>
            <h1 className="page-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Notre Catalogue</h1>
            
            <div className="shop-toolbar glass-card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                <form 
                    className="search-box" 
                    onSubmit={(e) => {
                        e.preventDefault();
                        setSearchTerm(searchInput);
                        setCurrentPage(0);
                    }}
                    style={{ display: 'flex', alignItems: 'center', width: '100%', maxWidth: '500px', position: 'relative' }}
                >
                    <Search size={18} className="search-icon" style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        className="input-field search-input"
                        placeholder="Rechercher un produit..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        style={{ paddingLeft: '2.5rem', width: '100%', borderRadius: '50px' }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '0.2rem', padding: '0.5rem 1.5rem', borderRadius: '50px' }}>
                        Chercher
                    </button>
                </form>
            </div>
            
            {loading && <div className="loader" style={{textAlign: 'center', margin: '2rem 0'}}>Chargement...</div>}

            <div className="products-grid" style={{ opacity: loading ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                {products.length === 0 ? (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                        Aucun produit disponible pour le moment.
                    </p>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="product-card glass-card">
                            <div 
                                className="product-clickable" 
                                onClick={() => navigate(`/products/${product.id}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="product-image-container">
                                    {product.imageUrl ? (
                                        <img src={getImageUrl(product.imageUrl)} alt={product.name} className="product-img" />
                                    ) : (
                                        <div className="product-placeholder">Pas d'image</div>
                                    )}
                                    {product.stock <= 0 && <span className="out-of-stock-badge">Rupture de stock</span>}
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-desc">{product.description}</p>
                                </div>
                            </div>
                            <div className="product-info" style={{ paddingTop: 0 }}>
                                <div className="product-bottom">
                                    <span className="product-price">${product.price.toFixed(2)}</span>
                                    <div className="product-actions">
                                        <button 
                                            className="btn btn-outline detail-btn"
                                            onClick={() => navigate(`/products/${product.id}`)}
                                        >
                                            <Eye size={18} /> Détails
                                        </button>
                                        <button 
                                            className={`btn ${addedId === product.id ? 'btn-success' : 'btn-primary'}`}
                                            disabled={product.stock <= 0}
                                            onClick={(e) => handleAddToCart(e, product.id)}
                                        >
                                            {addedId === product.id ? (
                                                <><Check size={18} /> Ajouté !</>
                                            ) : (
                                                <><ShoppingCart size={18} /> Ajouter</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                    <button 
                        className="btn btn-outline pagination-btn"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <ChevronLeft size={18} /> Précédent
                    </button>
                    
                    <div className="page-numbers" style={{ display: 'flex', gap: '0.5rem' }}>
                        {[...Array(totalPages)].map((_, i) => {
                            // Simple logic to show limited pages if total is large
                            if (totalPages > 7 && i !== 0 && i !== totalPages - 1 && Math.abs(currentPage - i) > 1) {
                                if (i === 1 && currentPage > 2) return <span key={i} style={{ padding: '0.5rem' }}>...</span>;
                                if (i === totalPages - 2 && currentPage < totalPages - 3) return <span key={i} style={{ padding: '0.5rem' }}>...</span>;
                                return null;
                            }
                            
                            return (
                                <button
                                    key={i}
                                    className={`btn pagination-number ${currentPage === i ? 'btn-primary' : 'btn-outline'}`}
                                    onClick={() => setCurrentPage(i)}
                                    style={{ minWidth: '40px', padding: '0.5rem' }}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}
                    </div>

                    <button 
                        className="btn btn-outline pagination-btn"
                        disabled={currentPage === totalPages - 1}
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        Suivant <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Shop;
