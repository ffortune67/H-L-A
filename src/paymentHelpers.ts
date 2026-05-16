// Payment Integration Helper
// Utiliser ce fichier pour rediriger les utilisateurs après une donation

export const getPaymentConfirmationPath = (paymentMethod: string, contributionId: string): string => {
    switch(paymentMethod.toLowerCase()) {
        case 'virement':
        case 'bank_transfer':
            return `/payment/bank-transfer/${contributionId}`;
        case 'mobile':
        case 'mobile_money':
            return `/payment/mobile-money/${contributionId}`;
        case 'card':
        case 'carte':
            return `/payment/card/${contributionId}`;
        default:
            return '/donations';
    }
};

// Format payment method for display
export const formatPaymentMethod = (method: string): string => {
    const methodMap: { [key: string]: string } = {
        'virement': 'Virement Bancaire',
        'bank_transfer': 'Virement Bancaire',
        'mobile': 'Mobile Money',
        'mobile_money': 'Mobile Money',
        'card': 'Carte Bancaire',
        'carte': 'Carte Bancaire'
    };
    return methodMap[method.toLowerCase()] || method;
};

// Get payment method icon
export const getPaymentMethodIcon = (method: string): string => {
    const iconMap: { [key: string]: string } = {
        'virement': '🏦',
        'bank_transfer': '🏦',
        'mobile': '📱',
        'mobile_money': '📱',
        'card': '💳',
        'carte': '💳'
    };
    return iconMap[method.toLowerCase()] || '💰';
};

// Get payment method description
export const getPaymentMethodDescription = (method: string): string => {
    const descMap: { [key: string]: string } = {
        'virement': 'Effectuez un virement bancaire avec code de référence unique',
        'bank_transfer': 'Effectuez un virement bancaire avec code de référence unique',
        'mobile': 'Transférez via Orange Money, M-Pesa ou Airtel Money',
        'mobile_money': 'Transférez via Orange Money, M-Pesa ou Airtel Money',
        'card': 'Enregistrez votre paiement par carte bancaire',
        'carte': 'Enregistrez votre paiement par carte bancaire'
    };
    return descMap[method.toLowerCase()] || 'Méthode de paiement';
};
