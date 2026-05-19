import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationsService } from '../services/donations';

export interface DonationFormState {
  amount: number | '';
  customAmount: string;
  frequency: 'unique' | 'mensuel';
  cause: string;
  paymentMethod: string;
  step: 1 | 2 | 3;
  form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    anonymous: boolean;
    motivation: string;
  };
  paymentResult: any;
  bankAccount: any;
  isSubmitting: boolean;
  apiError: string;
  copied: boolean;
}

export interface UseDonationFormReturn extends DonationFormState {
  setAmount: (amount: number | '') => void;
  setCustomAmount: (amount: string) => void;
  setFrequency: (frequency: 'unique' | 'mensuel') => void;
  setCause: (cause: string) => void;
  setPaymentMethod: (method: string) => void;
  setStep: (step: 1 | 2 | 3) => void;
  setForm: (form: DonationFormState['form']) => void;
  setPaymentResult: (result: any) => void;
  setBankAccount: (account: any) => void;
  setCopied: (copied: boolean) => void;
  finalAmount: number;
  handleCopy: (text: string) => void;
  getMailLink: () => string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export function useDonationForm(): UseDonationFormReturn {
  const [amount, setAmount] = useState<number | ''>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'unique' | 'mensuel'>('unique');
  const [cause, setCause] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('virement');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    anonymous: false,
    motivation: '',
  });
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [bankAccount, setBankAccount] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [copied, setCopied] = useState(false);

  const navigate = useNavigate();

  const finalAmount = customAmount ? Number(customAmount) : (amount || 0);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getMailLink = () => {
    const recipient = form.email || 'finance@hla-rdc.org';
    const subject = `Récapitulatif de dotation budgétaire - HLA RDC`;
    const body = `Bonjour,%0D%0A%0D%0AVoici le récapitulatif de votre contribution financière :%0D%0A- Montant : ${finalAmount} USD%0D%0A- Projet / Ligne budgétaire : ${cause || 'Fonds général d'appui'}%0D%0A- Objectif / Contexte : ${form.motivation || 'Non spécifié'}%0D%0A- Mode de règlement : ${paymentMethod === 'virement' ? 'Virement bancaire' : paymentMethod === 'mobile' ? 'Mobile Money' : 'Carte bancaire'}%0D%0A- Référence de transaction : ${paymentResult?.reference_code || paymentResult?.transaction?.transaction_reference || 'N/A'}%0D%0A%0D%0ACoridialement,%0D%0AL'équipe administrative HLA RDC.%0D%0A`;
    return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setIsSubmitting(true);

    try {
      const data = await donationsService.createDonation({
        amount: finalAmount,
        currency: 'USD',
        frequency,
        cause: cause || "Fonds général d'appui",
        paymentMethod,
        motivation: form.motivation,
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
      });

      const contributionId = data.id || data.contribution?.id;
      if (!contributionId) {
        throw new Error(
          'Erreur de protocole : Identifiant de contribution introuvable.'
        );
      }

      if (paymentMethod === 'virement') {
        const paymentData = await donationsService.requestBankTransfer(
          contributionId
        );

        setPaymentResult({
          type: 'bank-transfer',
          amount: paymentData.amount,
          currency: paymentData.currency,
          reference_code: paymentData.reference_code,
          transaction: paymentData.transaction,
        });

        const bankData = await donationsService.getBankAccounts();
        if (
          Array.isArray(bankData.accounts) &&
          bankData.accounts.length > 0
        ) {
          setBankAccount(bankData.accounts[0]);
        }

        setStep(3);
        return;
      }

      if (paymentMethod === 'mobile') {
        navigate(`/payment/mobile-money/${contributionId}`);
        return;
      }

      navigate(`/payment/card/${contributionId}`);
    } catch (error: any) {
      setApiError(
        error?.message ??
          'Erreur de liaison avec le serveur financier. Vérifiez votre connectivité réseau.'
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    amount,
    setAmount,
    customAmount,
    setCustomAmount,
    frequency,
    setFrequency,
    cause,
    setCause,
    paymentMethod,
    setPaymentMethod,
    step,
    setStep,
    form,
    setForm,
    paymentResult,
    setPaymentResult,
    bankAccount,
    setBankAccount,
    isSubmitting,
    apiError,
    copied,
    setCopied,
    finalAmount,
    handleCopy,
    getMailLink,
    handleSubmit,
  };
}
