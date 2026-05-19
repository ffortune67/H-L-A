import React from 'react';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { overview, loading, error, activeTab, setActiveTab } = useAdminDashboard();

    if (loading) return <div className="admin-loading">Chargement du dashboard...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="admin-dashboard-container">
            <header className="admin-header">
                <h1>🔐 Tableau de Bord Administrateur</h1>
                <p>Gestion des donations et vérification des paiements</p>
            </header>

            <div className="admin-nav">
                <button 
                    className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📊 Vue d'ensemble
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'donations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('donations')}
                >
                    💰 Donations
                </button>
                <button 
                    className={`nav-tab ${activeTab === 'transactions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('transactions')}
                >
                    ✓ Vérification
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'overview' && overview && (
                    <div className="overview-section">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-content">
                                    <h3>Total Donations</h3>
                                    <p className="stat-value">{overview.total_donations}</p>
                                    <p className="stat-amount">{overview.total_amount.toFixed(2)} USD</p>
                                </div>
                            </div>

                            <div className="stat-card pending">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-content">
                                    <h3>En Attente</h3>
                                    <p className="stat-value">{overview.pending_count}</p>
                                    <p className="stat-label">À vérifier</p>
                                </div>
                            </div>

                            <div className="stat-card verified">
                                <div className="stat-icon">✓</div>
                                <div className="stat-content">
                                    <h3>Vérifiées</h3>
                                    <p className="stat-value">{overview.verified_count}</p>
                                    <p className="stat-label">Confirmées</p>
                                </div>
                            </div>
                        </div>

                        <div className="recent-transactions">
                            <h3>Transactions Récentes</h3>
                            <table className="transactions-table">
                                <thead>
                                    <tr>
                                        <th>Montant</th>
                                        <th>Email</th>
                                        <th>Type</th>
                                        <th>Référence</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {overview.recent_transactions.map((tx, idx) => (
                                        <tr key={idx}>
                                            <td className="amount">{tx.amount} {tx.currency}</td>
                                            <td>{tx.email || 'Anonyme'}</td>
                                            <td><span className="badge">{tx.transaction_type || 'Card'}</span></td>
                                            <td className="reference">{tx.transaction_reference || '-'}</td>
                                            <td className="date">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'donations' && (
                    <DonationsList />
                )}

                {activeTab === 'transactions' && (
                    <TransactionVerification />
                )}

            </div>
        </div>
    );
};

const DonationsList = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', cause: '' });
    const [pagination, setPagination] = useState({ page: 1, limit: 20 });

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/admin/donations`,
                    {
                        params: { ...filters, ...pagination },
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );
                setDonations(response.data.donations);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching donations:', err);
                setLoading(false);
            }
        };

        fetchDonations();
    }, [filters, pagination]);

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="donations-section">
            <h3>Gestion des Donations</h3>
            
            <div className="filters">
                <select 
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="filter-input"
                >
                    <option value="">Tous les statuts</option>
                    <option value="Vérifiée">Vérifiée</option>
                    <option value="En attente">En attente</option>
                    <option value="Rejetée">Rejetée</option>
                </select>
            </div>

            <table className="donations-table">
                <thead>
                    <tr>
                        <th>Montant</th>
                        <th>Donateur</th>
                        <th>Cause</th>
                        <th>Fréquence</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {donations.map((donation) => (
                        <tr key={donation.id}>
                            <td className="amount">{donation.amount} {donation.currency}</td>
                            <td>{donation.email || 'Anonyme'}</td>
                            <td>{donation.cause}</td>
                            <td>{donation.frequency}</td>
                            <td><span className={`status-badge ${donation.status.toLowerCase()}`}>{donation.status}</span></td>
                            <td className="actions">
                                <button className="btn-small">Voir</button>
                                <button className="btn-small edit">Éditer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const TransactionVerification = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/admin/transactions?status=pending`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                );
                setTransactions(response.data.transactions);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching transactions:', err);
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleVerify = async (transactionId, status) => {
        try {
            await axios.post(
                `${API_URL}/api/admin/transactions/${transactionId}/verify`,
                { verification_status: status },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                }
            );
            setTransactions(transactions.filter(t => t.id !== transactionId));
        } catch (err) {
            console.error('Error verifying transaction:', err);
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;

    return (
        <div className="verification-section">
            <h3>Vérification des Transactions Manuelles</h3>
            
            {transactions.length === 0 ? (
                <div className="empty-state">
                    <p>Aucune transaction en attente de vérification</p>
                </div>
            ) : (
                <div className="transactions-cards">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="transaction-card">
                            <div className="tx-header">
                                <h4>{tx.transaction_type}</h4>
                                <span className="tx-amount">{tx.amount} {tx.currency}</span>
                            </div>
                            <div className="tx-details">
                                <p><strong>Référence:</strong> {tx.transaction_reference}</p>
                                <p><strong>Email:</strong> {tx.email || 'Non fourni'}</p>
                                <p><strong>Date:</strong> {new Date(tx.created_at).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="tx-actions">
                                <button 
                                    className="btn-verify"
                                    onClick={() => handleVerify(tx.id, 'verified')}
                                >
                                    ✓ Vérifier
                                </button>
                                <button 
                                    className="btn-reject"
                                    onClick={() => handleVerify(tx.id, 'rejected')}
                                >
                                    ✗ Rejeter
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const BlogAdmin = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: '', tags: '' });

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/blog/admin/posts`, { params: { limit: 50 }, headers });
            setPosts(response.data.posts);
        } catch (err) {
            console.error('Error fetching blog posts:', err);
            setError('Impossible de charger les articles du blog.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            await axios.post(
                `${API_URL}/api/blog`,
                {
                    title: form.title,
                    excerpt: form.excerpt,
                    content: form.content,
                    category: form.category,
                    tags: form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
                },
                { headers }
            );
            setForm({ title: '', excerpt: '', content: '', category: '', tags: '' });
            fetchPosts();
        } catch (err) {
            console.error('Error creating blog post:', err);
            setError(err.response?.data?.message || 'Impossible de créer le post.');
        } finally {
            setSaving(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post(`${API_URL}/api/blog/${id}/${action}`, {}, { headers });
            fetchPosts();
        } catch (err) {
            console.error(`Error ${action} blog post:`, err);
            setError(`Impossible de ${action} l'article.`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/blog/${id}`, { headers });
            fetchPosts();
        } catch (err) {
            console.error('Error deleting blog post:', err);
            setError('Impossible de supprimer l article.');
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="blog-admin-section">
            <h3>Administration du Blog</h3>
            <div className="admin-grid">
                <div className="admin-card">
                    <h4>Créer un nouvel article</h4>
                    <form onSubmit={handleSave} className="admin-form">
                        <input type="text" placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        <input type="text" placeholder="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                        <input type="text" placeholder="Extrait" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                        <textarea placeholder="Contenu" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={6} />
                        <input type="text" placeholder="Tags (séparés par des virgules)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Enregistrement...' : 'Créer post'}</button>
                    </form>
                </div>

                <div className="admin-card">
                    <h4>Articles existants</h4>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id}>
                                        <td>{post.title}</td>
                                        <td>{post.status}</td>
                                        <td>{new Date(post.created_at).toLocaleDateString('fr-FR')}</td>
                                        <td className="admin-actions">
                                            <button type="button" onClick={() => handleAction(post.id, 'publish')} className="btn-small">Publier</button>
                                            <button type="button" onClick={() => handleAction(post.id, 'archive')} className="btn-small">Archiver</button>
                                            <button type="button" onClick={() => handleDelete(post.id)} className="btn-small delete">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DocumentsAdmin = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', category: '', file: null });

    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    };

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/documents/admin/list`, { params: { limit: 50 }, headers });
            setDocuments(response.data.documents);
        } catch (err) {
            console.error('Error fetching documents:', err);
            setError('Impossible de charger les documents.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setError(null);
        setUploading(true);

        if (!form.file) {
            setError('Veuillez sélectionner un fichier.');
            setUploading(false);
            return;
        }

        const data = new FormData();
        data.append('title', form.title);
        data.append('description', form.description);
        data.append('category', form.category);
        data.append('file', form.file);

        try {
            await axios.post(`${API_URL}/api/documents`, data, {
                headers: {
                    ...headers,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setForm({ title: '', description: '', category: '', file: null });
            fetchDocuments();
        } catch (err) {
            console.error('Error uploading document:', err);
            setError(err.response?.data?.message || 'Téléversement échoué.');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/api/documents/${id}`, { headers });
            fetchDocuments();
        } catch (err) {
            console.error('Error deleting document:', err);
            setError('Impossible de supprimer le document.');
        }
    };

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="admin-error">{error}</div>;

    return (
        <div className="documents-admin-section">
            <h3>Administration des Documents</h3>
            <div className="admin-grid">
                <div className="admin-card">
                    <h4>Uploader un document</h4>
                    <form onSubmit={handleUpload} className="admin-form" encType="multipart/form-data">
                        <input type="text" placeholder="Titre" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        <input type="text" placeholder="Catégorie" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                        <input type="text" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} required />
                        <button type="submit" disabled={uploading} className="btn-primary">{uploading ? 'Téléversement...' : 'Uploader'}</button>
                    </form>
                </div>

                <div className="admin-card">
                    <h4>Documents disponibles</h4>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Catégorie</th>
                                    <th>Taille</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((doc) => (
                                    <tr key={doc.id}>
                                        <td>{doc.title}</td>
                                        <td>{doc.category}</td>
                                        <td>{(doc.file_size / 1024).toFixed(1)} KB</td>
                                        <td className="admin-actions">
                                            <button type="button" onClick={() => handleDelete(doc.id)} className="btn-small delete">Supprimer</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectsAdmin = () => (
    <div className="coming-soon">
        <p>🚧 Gestion des projets : actuellement, les projets sont rendus via une page statique frontend.</p>
        <p>Pour la prochaine étape, ajoutez un backend de projets et exposez des routes d'administration.</p>
    </div>
);

export default AdminDashboard;
