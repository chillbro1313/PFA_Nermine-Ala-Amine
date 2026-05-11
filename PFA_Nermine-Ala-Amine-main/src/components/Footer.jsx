import React from 'react';
import { PackageSearch, Globe, Share2, MessageCircle, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Client.css';

const Footer = () => {
    return (
        <footer className="client-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <div className="nav-logo">
                        <PackageSearch size={28} className="logo-icon" />
                        <h2>Ecom<span className="accent-text">Store</span></h2>
                    </div>
                    <p className="footer-desc">
                        La meilleure plateforme e-commerce pour trouver des produits de qualité supérieure avec une expérience d'achat fluide et sécurisée.
                    </p>
                    <div className="social-links">
                        <a href="#" className="social-icon"><Globe size={20} /></a>
                        <a href="#" className="social-icon"><Share2 size={20} /></a>
                        <a href="#" className="social-icon"><MessageCircle size={20} /></a>
                    </div>
                </div>

                <div className="footer-links-group">
                    <h3>Liens Rapides</h3>
                    <ul>
                        <li><Link to="/">Accueil</Link></li>
                        <li><Link to="/products">Boutique</Link></li>
                        <li><Link to="/login">Connexion</Link></li>
                    </ul>
                </div>

                <div className="footer-links-group">
                    <h3>Service Client</h3>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Politique de retour</a></li>
                        <li><a href="#">Suivi de commande</a></li>
                        <li><a href="#">Conditions d'utilisation</a></li>
                    </ul>
                </div>

                <div className="footer-contact">
                    <h3>Contactez-nous</h3>
                    <p className="contact-item"><Mail size={16} /> support@ecomstore.com</p>
                    <p>📍 123 Avenue du Commerce, Paris</p>
                    <p>📞 +33 1 23 45 67 89</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} EcomStore. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;
