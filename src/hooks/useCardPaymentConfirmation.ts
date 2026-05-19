import { useState, useEffect } from "react";
import {
  getPaymentConfirmation,
  submitCardPayment,
} from "../services/payments";

interface PaymentData {
  amount: number;
  currency: string;
  cause: string;
  frequency: string;
}

interface CardData {
  bank_name: string;
  card_last4: string;
  transaction_id: string;
}

export function useCardPaymentConfirmation(contributionId: string | undefined) {
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData>({
    bank_name: "",
    card_last4: "",
    transaction_id: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!contributionId) {
      setLoading(false);
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const data = await getPaymentConfirmation(contributionId);
        setPayment(data.contribution);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [contributionId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cardData.bank_name || !cardData.card_last4) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      await submitCardPayment({
        contribution_id: contributionId || "",
        ...cardData,
      });
      setSubmitted(true);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la soumission");
    }
  };

  return {
    payment,
    loading,
    error,
    cardData,
    setCardData,
    submitted,
    handleChange,
    handleSubmit,
  };
}
