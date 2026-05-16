import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PaymentConfirmation.css';

const BankTransferConfirmation = () => {
    const { contribution_id } = useParams();
    const navigate = useNavigate();
    const [payment, setPayment] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/payments/confirmation/${contribution_id}`
                );
                setPayment(response.data.contribution);
                setPayment(prev => ({
                    ...response.data.contribution,
                    transaction: response.data.transaction
                }));
                setBankAccount(response.data.bank_account);
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

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!payment || !bankAccount) return <div className="error">Données non disponibles</div>;

    return (
        <div className="payment-confirmation-container">
            <div className="confirmation-card">
                <div className="success-header">
                    <div className="success-icon">✓</div>
                    <h1>Virement Bancaire Initié</h1>
                    <p>Veuillez compléter le virement selon les détails ci-dessous</p>
                </div>

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

                <div className="bank-details">
                    <h3>📋 Détails du Virement</h3>
                    
                    <div className="detail-section">
                        <label>Bénéficiaire</label>
                        <input 
                            type="text" 
                            value={bankAccount.account_holder_name}
                            readOnly
                            className="readonly-field"
                        />
                    </div>

                    <div className="detail-section">
                        <label>IBAN</label>
                        <div className="copy-field">
                            <input 
                                type="text" 
                                value={bankAccount.iban}
                                readOnly
                                className="readonly-field"
                            />
                            <button 
                                className="copy-btn"
                                onClick={() => copyToClipboard(bankAccount.iban, 'iban')}
                            >
                                {copied === 'iban' ? '✓ Copié' : 'Copier'}
                            </button>
                        </div>
                    </div>

                    {bankAccount.rib && (
                        <div className="detail-section">
                            <label>RIB</label>
                            <div className="copy-field">
                                <input 
                                    type="text" 
                                    value={bankAccount.rib}
                                    readOnly
                                    className="readonly-field"
                                />
                                <button 
                                    className="copy-btn"
                                    onClick={() => copyToClipboard(bankAccount.rib, 'rib')}
                                >
                                    {copied === 'rib' ? '✓ Copié' : 'Copier'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="detail-section">
                        <label>Code de Référence Unique (⚠️ IMPORTANT)</label>
                        <div className="reference-code-box">
                            <input 
                                type="text" 
                                value={payment.transaction?.transaction_reference || 'N/A'}
                                readOnly
                                className="reference-code"
                            />
                            <button 
                                className="copy-btn large"
                                onClick={() => copyToClipboard(payment.transaction?.transaction_reference, 'ref')}
                            >
                                {copied === 'ref' ? '✓ Copié' : 'Copier le code'}
                            </button>
                        </div>
                        <p className="warning">
                            ⚠️ <strong>IMPORTANT:</strong> Vous DEVEZ écrire ce code dans le motif de votre virement bancaire!
                        </p>
                    </div>
                </div>

                <div className="instructions">
                    <h3>📝 Instructions</h3>
                    <ol>
                        <li>Copiez ou notez le code de référence unique ci-dessus</li>
                        <li>Effectuez un virement bancaire vers l'IBAN spécifié</li>
                        <li>
                            <strong>Dans le motif du virement, écrivez:</strong> 
                            <code>{payment.transaction?.transaction_reference}</code>
                        </li>
                        <li>Conservez votre justificatif de virement</li>
                        <li>Votre donation sera vérifiée et confirmée une fois le virement reçu</li>
                    </ol>
                </div>

                <div className="contact-support">
                    <p>Besoin d'aide? Contactez notre équipe à: <strong>support@hla.org</strong></p>
                </div>

                <button 
                    className="btn-primary"
                    onClick={() => navigate('/donations')}
                >
                    Retour aux donations
                </button>
            </div>
        </div>
    );
};

export default BankTransferConfirmation;
