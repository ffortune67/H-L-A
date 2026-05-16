# Manuel des Paiements Manuels & Admin Dashboard

## Vue d'ensemble

Ce système permet aux utilisateurs de faire des donations via 3 méthodes de paiement manuel:
1. **Virement Bancaire** - Avec code de référence unique généré
2. **Mobile Money** - Orange Money, M-Pesa, Airtel Money
3. **Carte Bancaire** - Enregistrement manuel des transactions

L'administrateur peut vérifier et confirmer les paiements via le dashboard.

---

## Architecture Backend

### Nouveaux Fichiers Créés

#### 1. **paymentsController.js** - Gestion des paiements
Fonctionnalités:
- `getBankAccounts()` - Liste les comptes bancaires
- `getMobileMoneyAccounts()` - Liste les numéros mobile
- `createBankTransferPayment()` - Initie un virement avec code unique
- `createMobileMoneyPayment()` - Enregistre une transaction mobile
- `createCardPayment()` - Enregistre un paiement carte
- `getPaymentConfirmation()` - Récupère les détails de paiement
- `submitPaymentProof()` - Soumission de la preuve de paiement
- `getOrganizationContacts()` - Infos publiques de l'orga

**Endpoints API:**
```
GET  /api/payments/methods/bank         - Comptes bancaires
GET  /api/payments/methods/mobile       - Numéros mobile money
GET  /api/payments/contacts             - Contacts organisation
POST /api/payments/bank-transfer        - Créer virement
POST /api/payments/mobile-money         - Enregistrer mobile
POST /api/payments/card                 - Enregistrer carte
GET  /api/payments/confirmation/:id     - Détails paiement
POST /api/payments/proof                - Soumettre preuve
```

#### 2. **adminController.js** - Gestion administrateur
Fonctionnalités:
- `getDashboardOverview()` - Vue globale des donations
- `getDonations()` - Liste avec filtrage
- `getManualTransactions()` - Transactions en attente
- `verifyTransaction()` - Vérifier/Rejeter transaction
- `updateDonationStatus()` - Changer le statut

**Endpoints API:**
```
GET  /api/admin/dashboard              - Vue d'ensemble
GET  /api/admin/donations              - Liste donations
PUT  /api/admin/donations/:id/status   - Modifier statut
GET  /api/admin/transactions           - Transactions manuelles
POST /api/admin/transactions/:id/verify - Vérifier transaction
```

#### 3. **paymentsRoutes.js** - Routes paiements
- Routes publiques (pas d'authentification obligatoire)
- Authentification optionnelle avec `optionalAuth`

#### 4. **adminRoutes.js** - Routes admin
- Toutes les routes protégées par `checkAdminAccess`
- Vérifie que l'utilisateur est admin dans la table `admin_users`

---

## Architecture Frontend

### Pages de Confirmation Créées

#### 1. **BankTransferConfirmation.tsx**
Affiche:
- RIB/IBAN du bénéficiaire
- Code de référence unique (REF-HLA-XXXX)
- Instructions claires
- Bouton "Copier" pour chaque champ
- Avertissement en rouge pour le code

Flux:
1. Utilisateur remplit le formulaire de donation
2. Sélectionne "Virement Bancaire"
3. Reçoit une page de confirmation avec tous les détails
4. Copie le code et l'IBAN
5. Effectue le virement manuellement
6. Le code doit être écrit dans le motif du virement

#### 2. **MobileMoneyConfirmation.tsx**
Affiche:
- Sélecteur d'opérateur (Orange Money, M-Pesa, Airtel Money)
- Numéro de téléphone pour chaque opérateur
- Formulaire pour saisir l'ID de transaction
- Instructions détaillées

Flux:
1. Utilisateur sélectionne Mobile Money
2. Choisit son opérateur
3. Voit le numéro à utiliser
4. Effectue le transfert depuis son téléphone
5. Reçoit un SMS avec l'ID de transaction
6. Soumet l'ID dans le formulaire

#### 3. **CardPaymentConfirmation.tsx**
Affiche:
- Formulaire pour saisir les détails de la carte
- Nom de la banque
- 4 derniers chiffres de la carte
- Numéro de transaction (optionnel)

Flux:
1. Utilisateur sélectionne Carte Bancaire
2. Remplit le formulaire de confirmation
3. Soumet les informations
4. L'admin vérifiepuis confirme

#### 4. **AdminDashboard.tsx**
Onglets:
- 📊 **Vue d'ensemble** - Statistiques globales
  - Total donations + montant
  - Donations en attente vs vérifiées
  - 10 dernières transactions
  
- 💰 **Donations** - Liste complète
  - Filtrer par statut/cause
  - Voir montant, donateur, cause
  - Actions: Voir, Éditer
  
- ✓ **Vérification** - Transactions manuelles
  - Cartes de transaction
  - Boutons Vérifier/Rejeter
  - Détails: montant, référence, email, date
  
- 📝 **Blog** - À venir
- 📄 **Documents** - À venir

---

## Tables de Base de Données

### Tables Existantes (utilisées)
- `users` - Informations utilisateur
- `contributions` - Donations enregistrées
- `audit_logs` - Logs d'actions

### Nouvelles Tables (dans database-extensions.sql)
- `admin_users` - Utilisateurs administrateurs avec rôles
- `manual_transactions` - Transactions manuelles à vérifier
- `bank_accounts` - Comptes bancaires (IBAN/RIB)
- `mobile_money_accounts` - Numéros mobile money
- `organization_contacts` - Infos publiques organisation
- `blog_posts` - Articles CMS
- `downloadable_documents` - Documents à télécharger
- `organization_settings` - Configuration

### Statuts de Transaction
- `pending` - En attente de vérification
- `verified` - Vérifiée et confirmée
- `rejected` - Rejetée
- `partial` - Paiement partiel

### Rôles Admin
- `viewer` - Accès lecture seule
- `editor` - Peut éditer donations
- `moderator` - Peut vérifier transactions
- `admin` - Accès total

---

## Flux Utilisateur Complet

### 1. Donation par Virement Bancaire
```
1. Utilisateur → Formulaire Donations
2. Remplit montant, cause, fréquence
3. Sélectionne "Virement Bancaire"
4. Clique "Confirmer"
5. ↓ Backend: Crée contribution + manual_transaction
6. Frontend: Affiche BankTransferConfirmation
7. Voir RIB/IBAN + Code unique (REF-HLA-8492)
8. Utilisateur effectue virement avec le code
9. ↓ Admin: Reçoit virement sur compte
10. Admin dashboard → Vérifier la transaction
11. Clique "Vérifier" → Status = "Vérifiée"
12. Contribution confirmée, remerciements envoyés
```

### 2. Donation par Mobile Money
```
1. Utilisateur → Formulaire Donations
2. Remplit montant, cause
3. Sélectionne "Mobile Money"
4. ↓ Frontend: Affiche MobileMoneyConfirmation
5. Choisit opérateur (Orange Money)
6. Voit numéro: +221 77 XXX XXXX
7. Effectue transfert depuis son téléphone
8. Reçoit SMS: "TXN123456789"
9. Rentre ID dans le formulaire
10. ↓ Backend: Enregistre transaction
11. ↓ Admin: Vérifie puis approuve
12. Status = "Vérifiée"
```

### 3. Donation par Carte
```
1. Utilisateur → Formulaire Donations
2. Sélectionne "Carte Bancaire"
3. ↓ Frontend: Affiche CardPaymentConfirmation
4. Remplit: Banque, 4 derniers chiffres, ID transaction
5. Clique "Enregistrer"
6. ↓ Backend: Enregistre les infos
7. ↓ Admin: Vérifie la transaction
8. Approuve si le montant correspond
9. Contribution confirmée
```

---

## Configuration Requise

### Variables d'Environnement (.env)
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hla_db

# JWT
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here

# Server
SERVER_PORT=3000
CORS_ORIGIN=http://localhost:5173

# Payment Settings
ORG_RIB=123456789012345
ORG_IBAN=FR1234567890ABCDEFGHIJ
ORG_ACCOUNT_HOLDER=HLA Organization
```

### Routes Frontend à Ajouter (App.tsx)
```jsx
import BankTransferConfirmation from './pages/BankTransferConfirmation';
import MobileMoneyConfirmation from './pages/MobileMoneyConfirmation';
import CardPaymentConfirmation from './pages/CardPaymentConfirmation';
import AdminDashboard from './pages/AdminDashboard';

<Route path="/payment/bank-transfer/:contribution_id" element={<BankTransferConfirmation />} />
<Route path="/payment/mobile-money/:contribution_id" element={<MobileMoneyConfirmation />} />
<Route path="/payment/card/:contribution_id" element={<CardPaymentConfirmation />} />
<Route path="/admin/dashboard" element={<AdminDashboard />} />
```

---

## Utilisation API

### Créer un Virement Bancaire
```bash
POST /api/payments/bank-transfer
Content-Type: application/json

{
  "contribution_id": 123
}

Response:
{
  "success": true,
  "transaction": { /* ... */ },
  "reference_code": "REF-HLA-8492",
  "amount": 50,
  "currency": "USD"
}
```

### Enregistrer Mobile Money
```bash
POST /api/payments/mobile-money
Content-Type: application/json

{
  "contribution_id": 123,
  "provider": "Orange Money",
  "transaction_id": "TXN123456789",
  "phone_number": "+221771234567"
}

Response:
{
  "success": true,
  "transaction": { /* ... */ },
  "provider": "Orange Money",
  "transaction_reference": "TXN123456789"
}
```

### Vérifier une Transaction (Admin)
```bash
POST /api/admin/transactions/456/verify
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "verification_status": "verified",
  "notes": "Virement reçu et confirmé"
}

Response:
{
  "success": true,
  "message": "Transaction verified",
  "transaction": { /* ... */ }
}
```

### Obtenir Dashboard (Admin)
```bash
GET /api/admin/dashboard
Authorization: Bearer <admin_token>

Response:
{
  "success": true,
  "overview": {
    "total_donations": 42,
    "total_amount": 5250.00,
    "pending_count": 5,
    "verified_count": 37,
    "recent_transactions": [ /* ... */ ]
  }
}
```

---

## Sécurité

### Mesures Implémentées
1. ✓ Authentification JWT pour admin
2. ✓ Middleware `checkAdminAccess` pour vérifier admin
3. ✓ Logs d'audit pour toutes les actions admin
4. ✓ Validation des statuts (enum)
5. ✓ Isolation des données (rôles)
6. ✓ HTTPS requis en production
7. ✓ Rate limiting recommandé

### A Implémenter
1. Email notifications quand transaction vérifiée
2. Two-factor auth pour admin
3. Chiffrement des données sensibles
4. Backup automatique de la base de données

---

## Prochaines Étapes

### À Faire
- [ ] Intégrer payment pages dans Donations.tsx
- [ ] Ajouter admin authentication à App.tsx
- [ ] Créer interface pour configuration (IBAN, numéros)
- [ ] Implémenter CMS Blog
- [ ] Implémenter gestion Documents
- [ ] Ajouter notifications email
- [ ] Tests E2E complets
- [ ] Documentation API Swagger

---

## Dépannage

### Erreur: "Admin access required"
- Vérifier que l'utilisateur existe dans `admin_users`
- Vérifier que `is_active = TRUE`
- Vérifier le token JWT

### Erreur: "Invalid verification status"
- Statuts acceptés: `verified`, `rejected`, `pending`
- Vérifier la casse (minuscules)

### Transaction non trouvée
- Vérifier que `contribution_id` existe dans la donation
- Vérifier que la transaction a bien été créée

