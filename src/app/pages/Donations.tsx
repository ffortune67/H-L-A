import { useState } from "react";
import { Heart, CreditCard, Smartphone, Building, CheckCircle, Shield, Globe, Users, Zap, Copy, Check } from "lucide-react";

const donationImg = "/donations-hero.jpeg";

const presetAmounts = [10, 25, 50, 100, 250, 500];

const causes = [
  { id: "general", label: "Don général", color: "#16a34a", icon: <Globe size={16} /> },
  { id: "education", label: "Éducation", color: "#0284c7", icon: <Users size={16} /> },
  { id: "eau", label: "Eau potable", color: "#06b6d4", icon: <Zap size={16} /> },
  { id: "sante", label: "Santé", color: "#dc2626", icon: <Heart size={16} /> },
];

const paymentMethods = [
  { id: "card", label: "Carte bancaire", icon: <CreditCard size={18} /> },
  { id: "mobile", label: "Mobile Money", icon: <Smartphone size={18} /> },
  { id: "virement", label: "Virement bancaire", icon: <Building size={18} /> },
];

const impacts = [
  { amount: 10, impact: "Fournitures scolaires pour 2 enfants pendant 1 mois" },
  { amount: 25, impact: "Vaccination complète d'un enfant contre 5 maladies" },
  { amount: 50, impact: "Formation d'une femme à une activité génératrice de revenus" },
  { amount: 100, icon: <></>, impact: "Construction d'un point d'eau dans un village rural" },
  { amount: 250, impact: "Scolarisation de 5 enfants pour toute une année scolaire" },
  { amount: 500, impact: "Équipement complet d'une salle de classe en matériel pédagogique" },
];

export function Donations() {
  const [amount, setAmount] = useState<number | "">(50);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"unique" | "mensuel">("unique");
  const [cause, setCause] = useState("general");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", anonymous: false });
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  
  // États additionnels pour la déclaration manuelle
  const [txRef, setTxRef] = useState("");
  const [mobileProvider, setMobileProvider] = useState("Orange Money");
  const [notes, setNotes] = useState("");
  const [declareSuccess, setDeclareSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const finalAmount = customAmount ? Number(customAmount) : (amount || 0);
  const matchingImpact = impacts.slice().reverse().find((i) => finalAmount >= i.amount);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/donations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('accessToken') || ''}`
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: "USD",
          frequency,
          cause,
          paymentMethod,
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Impossible de lancer le paiement.");
      }

      setPaymentResult(data);
      setStep(3);
    } catch (error: any) {
      setApiError(error?.message ?? "Erreur lors de l'appel au serveur. Assurez-vous que le backend est en cours d'exécution.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclareTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/payments/declare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contribution_id: paymentResult.id,
          transaction_reference: txRef,
          transaction_type: paymentMethod,
          mobile_provider: paymentMethod === 'mobile' ? mobileProvider : null,
          notes: notes
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la déclaration.");
      }

      setDeclareSuccess(data.message);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero */}
      <section className="relative h-72 flex items-center overflow-hidden">
        <img src={donationImg} alt="Faire un don" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/40" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <Heart size={18} fill="#f97316" className="text-orange-400" />
              <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">Faire un don</span>
            </div>
            <h1 className="text-white text-4xl font-bold mb-3">Votre générosité change des vies</h1>
            <p className="text-gray-200 text-sm leading-relaxed">Chaque dollar donné est utilisé directement sur le terrain, avec une transparence totale sur son usage.</p>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <div className="bg-red-800 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-white text-sm">
          {[
            { icon: <Shield size={14} />, label: "Paiement 100% sécurisé" },
            { icon: <CheckCircle size={14} />, label: "Reçu fiscal émis" },
            { icon: <Globe size={14} />, label: "Impact transparent" },
            { icon: <Heart size={14} />, label: "95% des fonds sur le terrain" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5">
              {t.icon} {t.label}
            </div>
          ))}
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
          {/* Donation form */}
          <div className="lg:col-span-2">
            {step === 3 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart size={28} fill="#820002" className="text-red-800" />
                </div>
                <h2 className="text-xl font-bold text-center text-gray-900 mb-1">Promesse enregistrée !</h2>
                <p className="text-gray-500 text-sm text-center mb-6">
                  Montant préparé : <strong className="text-red-800">{finalAmount} $</strong>
                </p>

                {apiError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4 text-center">{apiError}</div>}
                {declareSuccess && <div className="p-4 bg-green-50 text-green-700 font-medium rounded-xl text-sm mb-4 text-center border border-green-200">✅ {declareSuccess}</div>}

                {/* --- BLOC VIREMENT BANCAIRE --- */}
                {paymentResult?.type === 'bank-transfer' && !declareSuccess && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                      <h3 className="font-semibold text-gray-800 text-sm border-b pb-2">📋 Coordonnées de Virement</h3>
                      <p className="text-xs text-gray-600">{paymentResult.instructions.texte}</p>
                      
                      <div className="space-y-2 pt-2 text-sm">
                        <div className="flex justify-between items-center bg-white p-2.5 rounded border border-gray-100">
                          <span className="text-gray-500 font-medium text-xs">Banque</span>
                          <span className="text-gray-900 font-bold">{paymentResult.instructions.banque}</span>
                        </div>
                        <div className="flex justify-between items-center bg-yellow-50/50 p-2.5 rounded border border-yellow-200">
                          <span className="text-gray-600 font-medium text-xs">Motif à copier obligatoirement</span>
                          <button 
                            type="button"
                            onClick={() => handleCopy(paymentResult.instructions.motif)}
                            className="flex items-center gap-1 text-red-800 hover:text-red-900 font-mono font-bold text-sm bg-white px-2 py-1 rounded border shadow-xs"
                          >
                            {paymentResult.instructions.motif}
                            {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleDeclareTransaction} className="border-t pt-6 space-y-4">
                      <h4 className="text-sm font-semibold text-gray-800">Étape 2 : Confirmez votre virement</h4>
                      <p className="text-xs text-gray-500">Dès que vous avez fait le virement sur votre application bancaire, écrivez la référence de transaction ou le nom de votre compte ici :</p>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: N° de transaction ou Nom de l'émetteur" 
                        value={txRef}
                        onChange={(e) => setTxRef(e.target.value)}
                        className="w-full border p-2.5 rounded-lg text-sm focus:ring-1 focus:ring-red-800 focus:outline-hidden"
                      />
                      <button type="submit" disabled={isSubmitting} className="w-full bg-red-800 hover:bg-red-900 text-white p-2.5 rounded-lg font-medium text-sm transition-colors">
                        {isSubmitting ? "Envoi..." : "Déclarer mon virement"}
                      </button>
                    </form>
                  </div>
                )}

                {/* --- BLOC MOBILE MONEY --- */}
                {paymentResult?.type === 'mobile-money' && !declareSuccess && (
                  <div className="space-y-6">
                    <div className="bg-orange-50/50 border border-orange-200 rounded-xl p-5 text-left">
                      <h3 className="font-semibold text-orange-800 text-sm mb-2">📱 Instructions Mobile Money</h3>
                      <p className="text-xs text-orange-950 mb-4">{paymentResult.instructions.texte}</p>
                      
                      <div className="space-y-1.5 text-xs text-gray-700">
                        <p>🔹 <strong>Orange Money :</strong> +243 81 2345678</p>
                        <p>🔹 <strong>Airtel Money :</strong> +243 82 1234567</p>
                      </div>
                    </div>

                    <form onSubmit={handleDeclareTransaction} className="border-t pt-6 space-y-4">
                      <h4 className="text-sm font-semibold text-gray-800">Étape 2 : Saisissez la référence du transfert</h4>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Réseau utilisé</label>
                          <select 
                            value={mobileProvider} 
                            onChange={(e) => setMobileProvider(e.target.value)}
                            className="w-full border p-2 rounded-lg text-sm bg-white"
                          >
                            <option value="Orange Money">Orange Money</option>
                            <option value="Airtel Money">Airtel Money</option>
                            <option value="M-Pesa">M-Pesa</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">ID de transaction (Reçu par SMS)</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ex: TXN849204" 
                            value={txRef}
                            onChange={(e) => setTxRef(e.target.value)}
                            className="w-full border p-2 rounded-lg text-sm"
                          />
                        </div>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="w-full bg-red-800 hover:bg-red-900 text-white p-2.5 rounded-lg font-medium text-sm transition-colors">
                        {isSubmitting ? "Validation..." : "Valider mon paiement mobile"}
                      </button>
                    </form>
                  </div>
                )}

                <button 
                  onClick={() => { setStep(1); setPaymentResult(null); setDeclareSuccess(""); setTxRef(""); }} 
                  className="w-full mt-4 border border-gray-200 hover:bg-gray-50 text-gray-700 p-2.5 rounded-lg text-xs font-medium transition-colors"
                >
                  Retourner à l'accueil des dons
                </button>
              </div>
            ) : (
              /* Étape 1 & 2 d'origine (Formulaire de saisie standard) */
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {/* [Insérez ici votre logique d'étape 1 et 2 existante pour collecter les infos] */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Moyen de paiement</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethods.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-4 border rounded-xl flex flex-col items-center gap-2 text-xs font-medium transition-all ${paymentMethod === m.id ? 'border-red-800 bg-red-50 text-red-800 shadow-xs' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                        {m.icon}
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Prénom" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="border p-2.5 rounded-lg text-sm" />
                  <input type="text" placeholder="Nom" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="border p-2.5 rounded-lg text-sm" />
                  <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="border p-2.5 rounded-lg text-sm col-span-2" />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-red-800 hover:bg-red-900 text-white p-3 rounded-xl font-semibold transition-colors text-sm">
                  {isSubmitting ? "Traitement..." : "Continuer"}
                </button>
              </form>
            )}
          </div>

          {/* Sidebar Impact à droite */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Votre impact concret</h3>
              {matchingImpact ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-800 bg-red-50 px-2 py-1 rounded">Pour {finalAmount} $</span>
                  <p className="text-gray-600 text-xs leading-relaxed font-medium">{matchingImpact.impact}</p>
                </div>
              ) : (
                <p className="text-gray-400 text-xs italic">Sélectionnez ou entrez un montant pour voir l'impact de votre don.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
