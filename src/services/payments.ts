import { API_URL } from "../config/api";

interface PaymentConfirmation {
  contribution: {
    amount: number;
    currency: string;
    cause: string;
    frequency: string;
    transaction?: {
      transaction_reference: string;
    };
  };
  bank_account: {
    account_holder_name: string;
    iban: string;
    rib?: string;
  };
}

export async function getPaymentConfirmation(
  contributionId: string
): Promise<PaymentConfirmation> {
  const response = await fetch(
    `${API_URL}/api/payments/confirmation/${contributionId}`
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || "Erreur lors du chargement des détails de paiement"
    );
  }

  return response.json();
}

export async function getMobileMoneyProviders() {
  const response = await fetch(
    `${API_URL}/api/payments/methods/mobile`
  );

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des fournisseurs");
  }

  return response.json();
}

export async function submitMobileMoneyPayment(data: {
  contribution_id: string;
  provider: string;
  transaction_id: string;
}) {
  const response = await fetch(`${API_URL}/api/payments/mobile-money`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || "Erreur lors de la soumission du paiement"
    );
  }

  return response.json();
}

export async function submitCardPayment(data: {
  contribution_id: string;
  bank_name: string;
  card_last4: string;
  transaction_id: string;
}) {
  const response = await fetch(`${API_URL}/api/payments/card`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || "Erreur lors de la soumission du paiement"
    );
  }

  return response.json();
}

export async function getCardPaymentDetails(contributionId: string) {
  const response = await fetch(
    `${API_URL}/api/payments/card/${contributionId}`
  );

  if (!response.ok) {
    throw new Error("Erreur lors du chargement des détails du paiement par carte");
  }

  return response.json();
}


