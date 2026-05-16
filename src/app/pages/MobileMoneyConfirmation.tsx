import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentConfirmation.css';

const MobileMoneyConfirmation = () => {
    const { contribution_id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [mobileAccounts, setMobileAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [transactionId, setTransactionId] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const paymentRes = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/payments/confirmation/${contribution_id}`
                );
                setPayment(paymentRes.data.contribution);

                const accountsRes = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/payments/methods/mobile`
                );
                setMobileAccounts(accountsRes.data.accounts);
                
                if (accountsRes.data.accounts.length > 0) {
                    setSelectedProvider(accountsRes.data.accounts[0].provider_name);
                }
                
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du chargement');
                setLoading(false);
            }
        };

        if (contribution_id) {
            fetchData();
        }
    }, [contribution_id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!transactionId.trim()) {
            setError('Veuillez entrer l\'ID de votre transaction');
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/payments/mobile-money`,
                {
                    contribution_id,
                    provider: selectedProvider,
                    transaction_id: transactionId
                }
            );
            setSubmitted(true);
            setTimeout(() => navigate('/donations'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la soumission');
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error && !submitted) return <div className="error">{error}</div>;
    if (!payment) return <div className="error">Données non disponibles</div>;

    const selectedAccount = mobileAccounts.find(acc => acc.provider_name === selectedProvider);

    return (
        <div className="payment-confirmation-container">
            <div className="confirmation-card">
                <div className="success-header">
                    <div className="success-icon">📱</div>
                    <h1>Paiement par Mobile Money</h1>
                    <p>Effectuez le transfert vers le numéro spécifié</p>
                </div>

                {submitted ? (
                    <div className="submitted-message">
                        <h2>✓ Transaction enregistrée!</h2>
                        <p>Merci! Votre transaction a été enregistrée et sera vérifiée sous peu.</p>
                        <p>Redirection vers les donations...</p>
                    </div>
                ) : (
                    <>
                        <div className="payment-summary">
                            <h3>Détails de votre donation</h3>
                            <div className="summary-item">
                                <span className="label">Montant:</span>
                                <span className="value">{payment.amount} {payment.currency}</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">Cause:</span>
                                <span className="value">{payment.cause}</span>
                            </div>
                        </div>

                        <div className="mobile-money-section">
                            <h3>📞 Numéros de Mobile Money</h3>
                            
                            <div className="provider-selector">
                                <label>Sélectionnez votre opérateur:</label>
                                <select 
                                    value={selectedProvider || ''}
                                    onChange={(e) => setSelectedProvider(e.target.value)}
                                    className="provider-select"
                                >
                                    {mobileAccounts.map(account => (
                                        <option key={account.id} value={account.provider_name}>
                                            {account.provider_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedAccount && (
                                <div className="provider-details">
                                    <div className="phone-box">
                                        <label>Numéro pour {selectedAccount.provider_name}:</label>
                                        <div className="phone-number">
                                            <strong>{selectedAccount.phone_number}</strong>
                                        </div>
                                        <p className="provider-instructions">
                                            {selectedAccount.instructions}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="all-providers">
                                <h4>Tous les numéros disponibles:</h4>
                                <ul className="providers-list">
                                    {mobileAccounts.map(account => (
                                        <li key={account.id} className="provider-item">
                                            <span className="provider-name">{account.provider_name}:</span>
                                            <span className="provider-phone">{account.phone_number}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="transaction-form">
                            <h3>📝 Enregistrer votre transaction</h3>
                            
                            <div className="form-group">
                                <label htmlFor="transactionId">
                                    Numéro de transaction (reçu par SMS):
                                </label>
                                <input
                                    id="transactionId"
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="Ex: TXN123456789"
                                    className="form-input"
                                />
                                <small>Vous trouverez ce numéro dans le SMS de confirmation reçu</small>
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <button type="submit" className="btn-primary">
                                Enregistrer la transaction
                            </button>
                        </form>

                        <div className="instructions">
                            <h3>📋 Étapes</h3>
                            <ol>
                                <li>Effectuez un transfert mobile money du montant <strong>{payment.amount} {payment.currency}</strong></li>
                                <li>Sélectionnez votre opérateur ci-dessus et utilisez le numéro fourni</li>
                                <li>Vous recevrez un numéro de transaction par SMS</li>
                                <li>Entrez ce numéro dans le formulaire ci-dessus</li>
                                <li>Votre donation sera vérifiée et confirmée</li>
                            </ol>
                        </div>
                    </>
                )}

                <button 
                    className="btn-secondary"
                    onClick={() => navigate('/donations')}
                >
                    Retour aux donations
                </button>
            </div>
        </div>
    );
};

export default MobileMoneyConfirmation;
