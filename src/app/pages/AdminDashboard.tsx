import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/admin/dashboard`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );
                setOverview(response.data.overview);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du chargement');
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    if (loading) return <div className="admin-loading">Chargement du dashboard...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-dashboard-container">
            <header className="admin-header">
                <h1>🔐 Tableau de Bord Administrateur</h1>
                <p>Gestion des donations et vérification des paiements</p>
            </header>

            <div className="admin-nav">
                <button 
                    className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Vue d'ensemble
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'donations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('donations')}
                >
                    💰 Donations
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    ✓ Vérification
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'blog' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blog')}
                >
                    📝 Blog
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'documents' ? 'active' : ''}`}
                    onClick={() => setActiveTab('documents')}
                >
                    📄 Documents
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'overview' && overview && (
                    <div className="overview-section">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <h3>Total Donations</h3>
                                    <p className="stat-value">{overview.total_donations}</p>
                                    <p className="stat-amount">{overview.total_amount.toFixed(2)} USD</p>
                                </div>
                            </div>

                            <div className="stat-card pending">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-content">
                                    <h3>En Attente</h3>
                                    <p className="stat-value">{overview.pending_count}</p>
                                    <p className="stat-label">À vérifier</p>
                                </div>
                            </div>

                            <div className="stat-card verified">
                                <div className="stat-icon">✓</div>
                                <div className="stat-content">
                                    <h3>Vérifiées</h3>
                                    <p className="stat-value">{overview.verified_count}</p>
                                    <p className="stat-label">Confirmées</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-transactions">
                            <h3>Transactions Récentes</h3>
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Montant</th>
                                        <th>Email</th>
                                        <th>Type</th>
                                        <th>Référence</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overview.recent_transactions.map((tx, idx) => (
                                        <tr key={idx}>
                                            <td className="amount">{tx.amount} {tx.currency}</td>
                                            <td>{tx.email || 'Anonyme'}</td>
                                            <td><span className="badge">{tx.transaction_type || 'Card'}</span></td>
                                            <td className="reference">{tx.transaction_reference || '-'}</td>
                                            <td className="date">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'donations' && (
                    <DonationsList />
                )}

                {activeTab === 'transactions' && (
                    <TransactionVerification />
                )}

                {activeTab === 'blog' && (
                    <div className="coming-soon">
                        <p>📝 Gestion du Blog - Bientôt disponible</p>
                    </div>
                )}

                {activeTab === 'documents' && (
                    <div className="coming-soon">
                        <p>📄 Gestion des Documents - Bientôt disponible</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const DonationsList = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', cause: '' });
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/admin/donations`,
                    {
                        params: { ...filters, ...pagination },
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );
                setDonations(response.data.donations);
                setPagination(response.data.pagination);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching donations:', err);
                setLoading(false);
            }
        };

        fetchDonations();
    }, [filters, pagination]);

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="donations-section">
            <h3>Gestion des Donations</h3>
            
            <div className="filters">
                <select 
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="filter-input"
                >
                    <option value="">Tous les statuts</option>
                    <option value="Vérifiée">Vérifiée</option>
                    <option value="En attente">En attente</option>
                    <option value="Rejetée">Rejetée</option>
                </select>
            </div>

            <table className="donations-table">
                <thead>
                    <tr>
                        <th>Montant</th>
                        <th>Donateur</th>
                        <th>Cause</th>
                        <th>Fréquence</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map((donation) => (
                        <tr key={donation.id}>
                            <td className="amount">{donation.amount} {donation.currency}</td>
                            <td>{donation.email || 'Anonyme'}</td>
                            <td>{donation.cause}</td>
                            <td>{donation.frequency}</td>
                            <td><span className={`status-badge ${donation.status.toLowerCase()}`}>{donation.status}</span></td>
                            <td className="actions">
                                <button className="btn-small">Voir</button>
                                <button className="btn-small edit">Éditer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TransactionVerification = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/admin/transactions?status=pending`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );
                setTransactions(response.data.transactions);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleVerify = async (transactionId, status) => {
        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/admin/transactions/${transactionId}/verify`,
                { verification_status: status },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            // Refresh list
            setTransactions(transactions.filter(t => t.id !== transactionId));
        } catch (err) {
            console.error('Error verifying transaction:', err);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="verification-section">
            <h3>Vérification des Transactions Manuelles</h3>
            
            {transactions.length === 0 ? (
                <div className="empty-state">
                    <p>Aucune transaction en attente de vérification</p>
                </div>
            ) : (
                <div className="transactions-cards">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="transaction-card">
                            <div className="tx-header">
                                <h4>{tx.transaction_type}</h4>
                                <span className="tx-amount">{tx.amount} {tx.currency}</span>
                            </div>
                            <div className="tx-details">
                                <p><strong>Référence:</strong> {tx.transaction_reference}</p>
                                <p><strong>Email:</strong> {tx.email || 'Non fourni'}</p>
                                <p><strong>Date:</strong> {new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="tx-actions">
                                <button 
                                    className="btn-verify"
                                    onClick={() => handleVerify(tx.id, 'verified')}
                                >
                                    ✓ Vérifier
                                </button>
                                <button 
                                    className="btn-reject"
                                    onClick={() => handleVerify(tx.id, 'rejected')}
                                >
                                    ✗ Rejeter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
