// Donations API service
// Handles all donation and payment-related API calls
import { apiClient } from './api';

export interface DonationPayload {
  amount: number;
  currency: string;
  frequency: 'unique' | 'mensuel';
  cause: string;
  paymentMethod: string;
  motivation?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface DonationResponse {
  id: string;
  contribution?: {
    id: string;
  };
}

export interface BankTransferResponse {
  amount: number;
  currency: string;
  reference_code: string;
  transaction: {
    transaction_reference: string;
  };
}

export interface BankAccount {
  account_number: string;
  bank_name: string;
  swift_code?: string;
}

export interface BankAccountResponse {
  accounts: BankAccount[];
}

export const donationsService = {
  async createDonation(payload: DonationPayload): Promise<DonationResponse> {
    const response = await fetch('/api/donations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message || "Échec de l'initialisation de la transaction financière."
      );
    }

    const contributionId = data.id || data.contribution?.id;
    if (!contributionId) {
      throw new Error(
        'Erreur de protocole : Identifiant de contribution introuvable.'
      );
    }

    return data;
  },

  async requestBankTransfer(
    contributionId: string
  ): Promise<BankTransferResponse> {
    const response = await fetch('/api/payments/bank-transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
      },
      body: JSON.stringify({ contribution_id: contributionId }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.message ||
          "Impossible d'enregistrer l'ordre de virement bancaire."
      );
    }

    return data;
  },

  async getBankAccounts(): Promise<BankAccountResponse> {
    const response = await fetch('/api/payments/methods/bank');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Impossible de récupérer les comptes bancaires');
    }

    return data;
  },
};
