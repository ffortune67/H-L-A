import { useState, useEffect } from "react";
import { getPaymentConfirmation } from "../services/payments";

interface PaymentData {
  amount: number;
  currency: string;
  cause: string;
  frequency: string;
  transaction?: {
    transaction_reference: string;
  };
}

interface BankAccountData {
  account_holder_name: string;
  iban: string;
  rib?: string;
}

export function usePaymentConfirmation(contributionId: string | undefined) {
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contributionId) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getPaymentConfirmation(contributionId);
        setPayment(data.contribution);
        setBankAccount(data.bank_account);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contributionId]);

  return { payment, bankAccount, loading, error };
}
