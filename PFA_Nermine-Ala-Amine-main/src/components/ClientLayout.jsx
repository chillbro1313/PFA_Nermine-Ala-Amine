import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const ClientLayout = () => {
    return (
        <div className="client-layout">
            <Navbar />
            <main className="client-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;
