import { useState } from "react";
import { Heart, CreditCard, Smartphone, Building, CheckCircle, Shield, Globe, Users, Zap } from "lucide-react";

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
  { amount: 100, impact: "Construction d'un point d'eau dans un village rural" },
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

  const finalAmount = customAmount ? Number(customAmount) : (amount || 0);
  const matchingImpact = impacts.slice().reverse().find((i) => finalAmount >= i.amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: finalAmount,
          currency: "usd",
          frequency,
          cause,
          paymentMethod,
          customer: form,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Impossible de lancer le paiement.");
      }

      setPaymentResult(data);
      setStep(3);
    } catch (error: any) {
      setApiError(error?.message ?? "Erreur lors de l'appel au serveur.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
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
      <div className="bg-primary py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-white text-sm">
          {[
            { icon: <Shield size={14} />, label: "Paiement 100% sécurisé" },
            { icon: <CheckCircle size={14} />, label: "Reçu fiscal émis" },
            { icon: <Globe size={14} />, label: "Impact transparent" },
            { icon: <Heart size={14} />, label: "95% des fonds sur le terrain" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 text-white">
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
                  <Heart size={36} fill="#820002" className="text-primary" />
                </div>
                <h2 className="text-gray-800 mb-3">Étape paiement</h2>
                <p className="text-gray-500 text-sm mb-2">
                  Montant préparé : <strong className="text-primary">{finalAmount} $</strong>
                </p>
                {apiError ? (
                  <div className="text-red-600 text-sm mb-4">{apiError}</div>
                ) : paymentResult?.type === 'card' ? (
                  <>
                    <p className="text-gray-500 text-sm mb-4">Vous allez être redirigé vers un paiement sécurisé par carte bancaire.</p>
                    <a
                      href={paymentResult.checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                    >
                      Payer par carte
                    </a>
                  </>
                ) : paymentResult?.type === 'mock-card' ? (
                  <>
                    <p className="text-gray-500 text-sm mb-4">Paiement carte mocké en local.</p>
                    <div className="mt-4 p-4 bg-primary-50 rounded-xl text-sm text-primary">
                      {paymentResult.message || 'Transaction simulée avec succès.'}
                    </div>
                  </>
                ) : paymentResult?.type === 'mobile' ? (
                  <>
                    <p className="text-gray-500 text-sm mb-4">
                      Paiement mobile lancé.
                    </p>
                    {paymentResult.paymentUrl ? (
                      <a
                        href={paymentResult.paymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                      >
                        Ouvrir le paiement mobile
                      </a>
                    ) : null}
                    <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-left text-sm text-gray-700">
                      {paymentResult.instructions || 'Suivez les instructions de votre fournisseur mobile pour finaliser le paiement.'}
                    </div>
                  </>
                ) : paymentResult?.type === 'mock-mobile' ? (
                  <div className="mt-4 p-4 bg-primary-50 rounded-xl text-sm text-primary">
                    {paymentResult.instructions || 'Paiement mobile simulé en local. Aucune transaction réelle n’est effectuée.'}
                  </div>
                ) : paymentResult?.type === 'bank-transfer' ? (
                  <div className="text-left text-sm text-gray-700 space-y-3">
                    <p>Suivez ces instructions pour effectuer un virement bancaire :</p>
                    <pre className="whitespace-pre-wrap bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm">{paymentResult.instructions}</pre>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-4">Votre paiement est en cours de traitement.</p>
                )}
                <div className="mt-6">
                  <button
                    onClick={() => {
                      setStep(1);
                      setAmount(50);
                      setCustomAmount("");
                      setPaymentResult(null);
                      setApiError("");
                    }}
                    className="bg-primary hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Revenir au formulaire
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Steps indicator */}
                <div className="flex border-b border-gray-100">
                  {["Montant & cause", "Vos informations"].map((label, i) => (
                    <div
                      key={i}
                      className={`flex-1 py-4 text-center text-sm font-semibold transition-colors ${step === i + 1 ? "bg-primary text-white" : step > i + 1 ? "bg-primary-50 text-primary" : "text-gray-400"}`}
                    >
                      <span className="mr-2">{i + 1}.</span>{label}
                    </div>
                  ))}
                </div>

                <div className="p-7">
                  {step === 1 && (
                    <div className="space-y-6">
                      {/* Frequency */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Fréquence du don</label>
                        <div className="flex bg-gray-100 rounded-xl p-1">
                          {[{ v: "unique", l: "Don unique" }, { v: "mensuel", l: "Don mensuel" }].map((f) => (
                            <button
                              key={f.v}
                              onClick={() => setFrequency(f.v as typeof frequency)}
                              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${frequency === f.v ? "bg-white shadow text-primary" : "text-gray-500 hover:text-gray-700"}`}
                            >
                              {f.l}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Amount presets */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Montant ($)</label>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {presetAmounts.map((a) => (
                            <button
                              key={a}
                              onClick={() => { setAmount(a); setCustomAmount(""); }}
                              className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${amount === a && !customAmount ? "border-primary bg-primary text-white" : "border-gray-200 text-gray-700 hover:border-primary"}`}
                            >
                              {a} $
                            </button>
                          ))}
                        </div>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                          <input
                            type="number"
                            placeholder="Montant personnalisé"
                            value={customAmount}
                            onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }}
                            className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      {/* Cause */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Affecter mon don à</label>
                        <div className="grid grid-cols-2 gap-2">
                          {causes.map((c) => (
                            <button
                              key={c.id}
                              onClick={() => setCause(c.id)}
                              className={`flex items-center gap-2 py-2.5 px-3 rounded-xl border-2 text-sm transition-all ${cause === c.id ? "text-white border-transparent" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                              style={cause === c.id ? { backgroundColor: c.color, borderColor: c.color } : {}}
                            >
                              {c.icon} {c.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Payment method */}
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Mode de paiement</label>
                        <div className="grid grid-cols-3 gap-2">
                          {paymentMethods.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => setPaymentMethod(m.id)}
                              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs transition-all ${paymentMethod === m.id ? "border-primary bg-primary-50 text-primary" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                            >
                              {m.icon} {m.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        disabled={!finalAmount || finalAmount <= 0}
                        onClick={() => setStep(2)}
                        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Heart size={16} fill="white" />
                        Continuer — {finalAmount ? `${finalAmount} $` : "Saisir un montant"}
                        {frequency === "mensuel" ? "/mois" : ""}
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Prénom *</label>
                          <input required type="text" placeholder="Jean" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-1 block">Nom *</label>
                          <input required type="text" placeholder="Dupont" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Email * (pour le reçu fiscal)</label>
                        <input required type="email" placeholder="jean@exemple.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Téléphone</label>
                        <input type="tel" placeholder="+243 800 000 000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm({ ...form, anonymous: e.target.checked })} className="w-4 h-4 accent-primary rounded" />
                        <span className="text-sm text-gray-600">Faire un don anonyme</span>
                      </label>

                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm">
                        <div className="font-semibold text-orange-700 mb-1">Récapitulatif :</div>
                        <div className="text-orange-600 text-xs space-y-1">
                          <div>Montant : <strong>{finalAmount} $</strong>{frequency === "mensuel" ? "/mois" : ""}</div>
                          <div>Cause : <strong>{causes.find(c => c.id === cause)?.label}</strong></div>
                          <div>Paiement : <strong>{paymentMethods.find(m => m.id === paymentMethod)?.label}</strong></div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                          Retour
                        </button>
                        <button type="submit" className="flex-2 flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                          <Shield size={14} /> Confirmer le don
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Impact */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-gray-800 mb-4">Impact de votre don</h3>
              <div className="space-y-3">
                {impacts.map((imp, i) => (
                  <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${finalAmount >= imp.amount ? "bg-primary-50 border border-primary-100" : "opacity-50"}`}>
                    <div className={`w-10 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${finalAmount >= imp.amount ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                      {imp.amount}$
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{imp.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparency */}
            <div className="bg-primary rounded-2xl p-5 text-white">
              <Shield size={24} className="text-primary-200 mb-3" />
              <h4 className="text-white mb-2">Utilisation des fonds</h4>
              <div className="space-y-2">
                {[
                  { label: "Projets terrain", pct: 75, color: "#86efac" },
                  { label: "Fonctionnement", pct: 15, color: "#fde68a" },
                  { label: "Communication", pct: 10, color: "#c4b5fd" },
                ].map((f, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-primary-100">{f.label}</span>
                      <span className="font-bold">{f.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${f.pct}%`, backgroundColor: f.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wire transfer */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h4 className="text-gray-800 mb-3">Virement bancaire</h4>
              <div className="space-y-1.5 text-xs text-gray-500">
                <div><span className="font-semibold text-gray-700">Banque :</span> Rawbank RDC</div>
                <div><span className="font-semibold text-gray-700">IBAN :</span> CD89 0001 1234 5678 9012</div>
                <div><span className="font-semibold text-gray-700">BIC :</span> RAWBCDKIXXX</div>
                <div><span className="font-semibold text-gray-700">Bénéficiaire :</span> Humanitarian Legal Advisor ASBL</div>
                <div className="text-xs text-gray-400 mt-2">Communication : votre nom + "DON"</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
