import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import Home from './app/pages/Home';
import About from './app/pages/About';
import Donations from './app/pages/Donations';
import BankTransferConfirmation from './app/pages/BankTransferConfirmation';
import MobileMoneyConfirmation from './app/pages/MobileMoneyConfirmation';
import CardPaymentConfirmation from './app/pages/CardPaymentConfirmation';
import AdminDashboard from './app/pages/AdminDashboard';
import NotFound from './app/pages/NotFound';

// Navigation component
const Navigation = () => {
    const user = localStorage.getItem('user');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    return (
        <nav className="navbar">
            <div className="nav-container">
                <a href="/" className="nav-logo">HLA - Aide Humanitaire & Juridique</a>
                <ul className="nav-menu">
                    <li><a href="/">Accueil</a></li>
                    <li><a href="/about">À Propos</a></li>
                    <li><a href="/donations">Donations</a></li>
                    {isAdmin && <li><a href="/admin/dashboard">Admin</a></li>}
                    {user ? (
                        <li><button onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('accessToken');
                            window.location.href = '/';
                        }}>Déconnexion</button></li>
                    ) : (
                        <li><a href="/auth/login">Connexion</a></li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/donations" element={<Donations />} />

                {/* Payment Confirmation Routes */}
                <Route path="/payment/bank-transfer/:contribution_id" element={<BankTransferConfirmation />} />
                <Route path="/payment/mobile-money/:contribution_id" element={<MobileMoneyConfirmation />} />
                <Route path="/payment/card/:contribution_id" element={<CardPaymentConfirmation />} />

                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
