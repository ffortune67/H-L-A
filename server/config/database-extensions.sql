-- ============================================
-- Extensions to Database Schema for Admin & CMS
-- ============================================

-- 1. ADMIN USERS (Separate from regular users)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    role VARCHAR(50) DEFAULT 'viewer',
    -- Roles: 'viewer', 'editor', 'moderator', 'admin'
    permissions JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 2. BLOG POSTS (CMS)
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INTEGER NOT NULL,
    featured_image_url VARCHAR(255),
    category VARCHAR(100),
    tags VARCHAR[],
    status VARCHAR(20) DEFAULT 'draft',
    -- Statuses: draft, published, archived
    published_at TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. DOCUMENTS TÉLÉCHARGEABLES (CMS)
CREATE TABLE IF NOT EXISTS downloadable_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    -- Categories: reports, guides, templates, forms, etc.
    file_url VARCHAR(255) NOT NULL,
    file_type VARCHAR(20),
    -- Types: pdf, docx, xlsx, zip, etc.
    file_size INTEGER,
    download_count INTEGER DEFAULT 0,
    uploaded_by INTEGER,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. ORGANIZATION INFO (Pour afficher RIB, numéros, etc.)
CREATE TABLE IF NOT EXISTS organization_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50),
    -- Types: text, number, json, url, etc.
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. TRANSACTION MANUALLY VERIFIED (Pour les paiements manuels)
CREATE TABLE IF NOT EXISTS manual_transactions (
    id SERIAL PRIMARY KEY,
    contribution_id INTEGER NOT NULL,
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    -- Ex: REF-HLA-8492
    transaction_type VARCHAR(50),
    -- Types: bank_transfer, mobile_money, card
    mobile_provider VARCHAR(50),
    -- Orange Money, M-Pesa, Airtel Money, etc.
    payment_proof_url VARCHAR(255),
    -- URL du justificatif (SMS screenshot, etc.)
    verified BOOLEAN DEFAULT FALSE,
    verified_by INTEGER,
    verified_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contribution_id) REFERENCES contributions(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. BANK ACCOUNT INFO (RIB/IBAN)
CREATE TABLE IF NOT EXISTS bank_accounts (
    id SERIAL PRIMARY KEY,
    account_name VARCHAR(255) NOT NULL,
    -- Ex: "Compte Principal HLA"
    rib VARCHAR(23),
    -- 23 caractères pour le RIB
    iban VARCHAR(34),
    -- Jusqu'à 34 caractères pour l'IBAN
    swift_code VARCHAR(11),
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. MOBILE MONEY ACCOUNTS (Orange Money, M-Pesa, etc.)
CREATE TABLE IF NOT EXISTS mobile_money_accounts (
    id SERIAL PRIMARY KEY,
    provider_name VARCHAR(100) NOT NULL,
    -- Orange Money, M-Pesa, Airtel Money, etc.
    phone_number VARCHAR(20) NOT NULL,
    account_holder VARCHAR(255),
    -- Nom du titulaire du compte
    country VARCHAR(100),
    currency VARCHAR(3) DEFAULT 'USD',
    instructions TEXT,
    -- Instructions spécifiques pour ce provider
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. CONTACT INFO (Numéros, emails, adresses)
CREATE TABLE IF NOT EXISTS organization_contacts (
    id SERIAL PRIMARY KEY,
    contact_type VARCHAR(50),
    -- Types: phone, email, address, office
    value VARCHAR(255) NOT NULL,
    label VARCHAR(100),
    -- Ex: "Bureau Principal", "Téléphone Support", etc.
    is_public BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_author_id ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_downloadable_documents_category ON downloadable_documents(category);
CREATE INDEX idx_downloadable_documents_uploaded_by ON downloadable_documents(uploaded_by);
CREATE INDEX idx_manual_transactions_contribution_id ON manual_transactions(contribution_id);
CREATE INDEX idx_manual_transactions_reference ON manual_transactions(transaction_reference);
CREATE INDEX idx_manual_transactions_verified ON manual_transactions(verified);
CREATE INDEX idx_bank_accounts_active ON bank_accounts(is_active);
CREATE INDEX idx_mobile_money_accounts_active ON mobile_money_accounts(is_active);
CREATE INDEX idx_organization_contacts_public ON organization_contacts(is_public);

-- ============================================
-- INSERT DEFAULT ORGANIZATION SETTINGS
-- ============================================

-- RIB/IBAN
INSERT INTO bank_accounts (account_name, rib, iban, swift_code, is_primary, is_active) VALUES
('Compte Principal HLA', '501000000001000000000123', 'CD94BCCO0501000000001000000', 'BCCORDLA', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Mobile Money Accounts
INSERT INTO mobile_money_accounts (provider_name, phone_number, account_holder, country, is_primary, is_active) VALUES
('Orange Money', '+243 81 2345678', 'Humanitarian & Legal Aid', 'DRC', TRUE, TRUE),
('M-Pesa', '+254 123 456789', 'Humanitarian & Legal Aid', 'Kenya', FALSE, FALSE),
('Airtel Money', '+243 82 1234567', 'Humanitarian & Legal Aid', 'DRC', FALSE, TRUE)
ON CONFLICT DO NOTHING;

-- Contact Information
INSERT INTO organization_contacts (contact_type, value, label, is_public, is_primary) VALUES
('phone', '+243 81 2345678', 'Téléphone Principal', TRUE, TRUE),
('email', 'contact@hla.org', 'Email Principal', TRUE, TRUE),
('email', 'support@hla.org', 'Support', TRUE, FALSE),
('address', 'Kinshasa, DRC', 'Bureau Principal', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Organization Settings
INSERT INTO organization_settings (setting_key, setting_value, setting_type, is_public) VALUES
('organization_name', 'Humanitarian & Legal Aid', 'text', TRUE),
('organization_logo_url', '/images/logo.png', 'url', TRUE),
('organization_description', 'Organisation humanitaire dédiée à l''aide juridique et l''assistance humanitaire', 'text', TRUE),
('tax_id', 'XX-XXX-XXXX', 'text', FALSE),
('registration_number', '123456/HLA/2020', 'text', FALSE)
ON CONFLICT DO NOTHING;
