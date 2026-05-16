import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentConfirmation.css';

const CardPaymentConfirmation = () => {
    const { contribution_id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cardData, setCardData] = useState({
        bank_name: '',
        card_last4: '',
        transaction_id: ''
    });
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/payments/confirmation/${contribution_id}`
                );
                setPayment(response.data.contribution);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors du chargement');
                setLoading(false);
            }
        };

        if (contribution_id) {
            fetchPaymentDetails();
        }
    }, [contribution_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCardData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!cardData.bank_name || !cardData.card_last4) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/payments/card`,
                {
                    contribution_id,
                    ...cardData
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

    return (
        <div className="payment-confirmation-container">
            <div className="confirmation-card">
                <div className="success-header">
                    <div className="success-icon">💳</div>
                    <h1>Paiement par Carte Bancaire</h1>
                    <p>Enregistrez les détails de votre transaction</p>
                </div>

                {submitted ? (
                    <div className="submitted-message">
                        <h2>✓ Transaction enregistrée!</h2>
                        <p>Merci! Les détails de votre paiement ont été enregistrés.</p>
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
                            <div className="summary-item">
                                <span className="label">Fréquence:</span>
                                <span className="value">{payment.frequency}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="card-form">
                            <h3>💳 Détails du paiement</h3>

                            <div className="form-group">
                                <label htmlFor="bank_name">Nom de la banque:</label>
                                <input
                                    id="bank_name"
                                    type="text"
                                    name="bank_name"
                                    value={cardData.bank_name}
                                    onChange={handleChange}
                                    placeholder="Ex: Banque Atlantic"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="card_last4">4 derniers chiffres de la carte:</label>
                                <input
                                    id="card_last4"
                                    type="text"
                                    name="card_last4"
                                    value={cardData.card_last4}
                                    onChange={handleChange}
                                    placeholder="Ex: 4242"
                                    maxLength="4"
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="transaction_id">
                                    Numéro de transaction (optionnel):
                                </label>
                                <input
                                    id="transaction_id"
                                    type="text"
                                    name="transaction_id"
                                    value={cardData.transaction_id}
                                    onChange={handleChange}
                                    placeholder="Numéro de confirmation de votre banque"
                                    className="form-input"
                                />
                            </div>

                            {error && <div className="form-error">{error}</div>}

                            <button type="submit" className="btn-primary">
                                Enregistrer le paiement
                            </button>
                        </form>

                        <div className="security-notice">
                            <h4>🔒 Sécurité</h4>
                            <p>Vos données de carte bancaire sont sécurisées et chiffrées.</p>
                            <p>Nous ne stockons jamais vos numéros de carte complets.</p>
                        </div>

                        <div className="instructions">
                            <h3>📋 Prochaines étapes</h3>
                            <ol>
                                <li>Remplissez le formulaire ci-dessus avec vos informations</li>
                                <li>Vérifiez que le montant correspond à votre donation</li>
                                <li>Cliquez sur "Enregistrer le paiement"</li>
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

export default CardPaymentConfirmation;
