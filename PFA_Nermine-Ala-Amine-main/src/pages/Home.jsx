import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Truck, Clock, CreditCard, ChevronRight } from 'lucide-react';
import '../components/Client.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page fade-in">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Découvrez l'Excellence du Shopping en Ligne</h1>
                    <p className="hero-subtitle">
                        Des produits premium à des prix imbattables. Profitez d'une expérience fluide, rapide et totalement sécurisée depuis le confort de votre maison.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn btn-primary btn-large" onClick={() => navigate('/products')}>
                            Explorer la Boutique <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
                <div className="hero-image-placeholder">
                    <img 
                        src="/hero-image.png" 
                        alt="E-commerce Experience" 
                        className="hero-image-illustration fade-in" 
                    />
                </div>
            </section>

            {/* Benefits Section */}
            <section className="benefits-section">
                <div className="section-header">
                    <h2>Pourquoi Nous Choisir ?</h2>
                    <p className="text-muted">Des avantages conçus spécialement pour vous garantir la meilleure expérience.</p>
                </div>

                <div className="benefits-grid">
                    <div className="benefit-card glass-card">
                        <div className="benefit-icon blue-gradient"><Truck size={32} /></div>
                        <h3>Livraison Rapide</h3>
                        <p>Recevez vos commandes en un temps record grâce à notre réseau logistique express partout dans le monde.</p>
                    </div>

                    <div className="benefit-card glass-card">
                        <div className="benefit-icon emerald-gradient"><ShieldCheck size={32} /></div>
                        <h3>Paiement Sécurisé</h3>
                        <p>Toutes vos transactions sont cryptées et protégées. Achetez en toute confiance et tranquillité d'esprit.</p>
                    </div>

                    <div className="benefit-card glass-card">
                        <div className="benefit-icon purple-gradient"><Clock size={32} /></div>
                        <h3>Support 24/7</h3>
                        <p>Notre équipe d'assistance est disponible à tout moment pour répondre à vos questions et vous accompagner.</p>
                    </div>

                    <div className="benefit-card glass-card">
                        <div className="benefit-icon orange-gradient"><CreditCard size={32} /></div>
                        <h3>Garantie Satisfait</h3>
                        <p>Vous n'êtes pas convaincu ? Retournez vos articles dans les 30 jours pour un remboursement complet.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
