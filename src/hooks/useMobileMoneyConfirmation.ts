import { useState, useEffect } from "react";
import {
  getPaymentConfirmation,
  getMobileMoneyProviders,
  submitMobileMoneyPayment,
} from "../services/payments";

interface PaymentData {
  amount: number;
  currency: string;
  cause: string;
  frequency: string;
}

interface MobileAccount {
  id: string;
  provider_name: string;
  phone_number: string;
  instructions: string;
}

export function useMobileMoneyConfirmation(
  contributionId: string | undefined
) {
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [mobileAccounts, setMobileAccounts] = useState<MobileAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!contributionId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const paymentData = await getPaymentConfirmation(contributionId);
        setPayment(paymentData.contribution);

        const providersData = await getMobileMoneyProviders();
        setMobileAccounts(providersData.accounts);

        if (providersData.accounts.length > 0) {
          setSelectedProvider(providersData.accounts[0].provider_name);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contributionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId.trim()) {
      setError("Veuillez entrer l'ID de votre transaction");
      return;
    }

    if (!selectedProvider) {
      setError("Veuillez sélectionner un fournisseur");
      return;
    }

    try {
      await submitMobileMoneyPayment({
        contribution_id: contributionId || "",
        provider: selectedProvider,
        transaction_id: transactionId,
      });
      setSubmitted(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la soumission");
    }
  };

  return {
    payment,
    mobileAccounts,
    loading,
    error,
    selectedProvider,
    setSelectedProvider,
    transactionId,
    setTransactionId,
    submitted,
    handleSubmit,
  };
}
