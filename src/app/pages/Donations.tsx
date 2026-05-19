import { useNavigate } from "react-router-dom";
import { ShieldCheck, CreditCard, Smartphone, Building, CheckCircle, Shield, Copy, Check, Mail, Briefcase } from "lucide-react";
import { useDonationForm } from "../../hooks/useDonationForm";

const donationImg = "/donations-hero.jpeg";
const presetAmounts = [100, 250, 500, 1000, 2500, 5000]; // Montants adaptés à des budgets professionnels ou institutionnels

const paymentMethods = [
  { id: "virement", label: "Virement bancaire (Recommandé)", icon: <Building size={18} /> },
  { id: "card", label: "Carte bancaire / Corporate", icon: <CreditCard size={18} /> },
  { id: "mobile", label: "Mobile Money", icon: <Smartphone size={18} /> },
];

export function Donations() {
  const {
    amount,
    setAmount,
    customAmount,
    setCustomAmount,
    frequency,
    setFrequency,
    cause,
    setCause,
    paymentMethod,
    setPaymentMethod,
    step,
    setStep,
    form,
    setForm,
    paymentResult,
    setBankAccount,
    bankAccount,
    isSubmitting,
    apiError,
    copied,
    setCopied,
    finalAmount,
    handleCopy,
    getMailLink,
    handleSubmit,
  } = useDonationForm();

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Professionnel */}
      <section className="relative h-72 flex items-center overflow-hidden">
        <img src={donationImg} alt="Financement de projets" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase size={18} className="text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-wider">Financement et Partenariats</span>
            </div>
            <h1 className="text-white text-4xl font-bold mb-3">Allocation de Fonds & Appui aux Projets</h1>
            <p className="text-gray-200 text-sm leading-relaxed">Garantissez le déploiement de vos ressources en RDC grâce à notre cadre d'exécution sécurisé et transparent conforme aux standards internationaux.</p>
          </div>
        </div>
      </section>

      {/* Critères de conformité réglementaire */}
      <div className="bg-slate-800 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-white text-sm">
          {[
            { icon: <ShieldCheck size={14} />, label: "Sécurisation des flux financiers" },
            { icon: <CheckCircle size={14} />, label: "Reporting de conformité fourni" },
            { icon: <Briefcase size={14} />, label: "Auditabilité complète des allocations" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 font-medium tracking-wide">
              {t.icon} {t.label}
            </div>
          ))}
        </div>
      </div>

      <section className="py-14">
        <div className="max-w-5xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
          {/* Formulaire Opérationnel */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">1. Paramètres de l'allocation</h2>
                  
                  {/* Type d'engagement */}
                  <div className="flex gap-4 p-1 bg-gray-100 rounded-xl">
                    <button type="button" onClick={() => setFrequency("unique")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${frequency === "unique" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>Versement ponctuel</button>
                    <button type="button" onClick={() => setFrequency("mensuel")} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${frequency === "mensuel" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}>Dotation périodique</button>
                  </div>

                  {/* Volume de Financement */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sélectionnez le montant de la dotation (USD)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {presetAmounts.map((amt) => (
                        <button key={amt} type="button" onClick={() => { setAmount(amt); setCustomAmount(""); }} className={`py-3 text-sm font-bold rounded-xl border transition-all ${amount === amt && !customAmount ? "border-blue-700 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{amt} $</button>
                      ))}
                    </div>
                    <div className="mt-3 relative rounded-xl shadow-sm">
                      <input type="number" placeholder="Saisir un autre montant" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); setAmount(""); }} className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent text-sm" />
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 font-medium text-sm">USD</div>
                    </div>
                  </div>

                  {/* Ligne budgétaire ou Projet cible écrit par l'utilisateur */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Code projet ou Intitulé de l'affectation</label>
                    <input type="text" placeholder="Ex: Projet de riposte Ébola, Construction infrastructures Goma, Appui technique..." value={cause} onChange={(e) => setCause(e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent" />
                  </div>

                  {/* Coordonnées Institutionnelles */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-900">Coordonnées du Point Focal / Représentant</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Prénom" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                      <input type="text" placeholder="Nom" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="email" placeholder="Adresse email professionnelle" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                      <input type="tel" placeholder="Ligne téléphonique" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm" />
                    </div>
                  </div>

                  {/* Note ou Motivation contextuelle */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-sm font-medium text-gray-700">Notes d'accompagnement ou Contexte de l'allocation (Optionnel)</label>
                    <textarea rows={3} placeholder="Précisez ici les modalités d'affectation ou les termes de référence associés si nécessaire..." value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-none" />
                  </div>

                  <button type="button" disabled={!finalAmount || !form.email || !form.firstName} onClick={() => setStep(2)} className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">Valider les paramètres d'allocation</button>
                </div>
              )}

              {step === 2 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">2. Mode de transfert réglementaire</h2>
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline">Ajuster les paramètres</button>
                  </div>

                  <div className="space-y-2">
                    {paymentMethods.map((m) => (
                      <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${paymentMethod === m.id ? "border-blue-700 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                        <div className="flex items-center gap-3">{m.icon} <span className="text-sm font-medium">{m.label}</span></div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === m.id ? "border-blue-700 bg-blue-700 text-white" : "border-gray-300"}`}>{paymentMethod === m.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}</div>
                      </button>
                    ))}
                  </div>

                  {apiError && <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">{apiError}</div>}

                  <button type="submit" disabled={isSubmitting} className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-medium shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 text-sm">
                    {isSubmitting ? "Traitement de l'ordre en cours..." : `Confirmer l'allocation de ${finalAmount} $`}
                  </button>
                </div>
              )}

              {step === 3 && paymentResult && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-blue-800" />
                  </div>
                  <h2 className="text-xl font-bold text-center text-gray-900 mb-1">Ordre d'allocation enregistré !</h2>
                  <p className="text-gray-500 text-sm text-center mb-6">Montant ordonnancé : <strong className="text-slate-800">{finalAmount} $</strong></p>

                  {bankAccount && (
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200/60 space-y-3 mb-6 text-sm">
                      <h3 className="font-semibold text-gray-800 border-b pb-2 mb-2">Informations bancaires institutionnelles :</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Banque émettrice :</span>
                        <strong className="text-gray-800">{bankAccount.bank_name}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Intitulé du compte :</span>
                        <strong className="text-gray-800">{bankAccount.account_name}</strong>
                      </div>
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-gray-500 shrink-0">Numéro de compte (IBAN/Rapprochement) :</span>
                        <div className="flex items-center gap-1 min-w-0">
                          <strong className="text-gray-800 truncate">{bankAccount.account_number}</strong>
                          <button type="button" onClick={() => handleCopy(bankAccount.account_number)} className="p-1 hover:bg-gray-200 rounded text-gray-500 shrink-0">{copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}</button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Code de Référence Obligatoire :</span>
                        <div className="flex items-center gap-1">
                          <strong className="text-blue-800 font-mono">{paymentResult.reference_code}</strong>
                          <button type="button" onClick={() => handleCopy(paymentResult.reference_code)} className="p-1 hover:bg-gray-200 rounded text-gray-500">{copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}</button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <a href={getMailLink()} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium text-sm text-center flex items-center justify-center gap-2"><Mail size={16} /> Générer l'avis de transfert par email</a>
                    <button type="button" onClick={() => { setStep(1); setPaymentResult(null); setBankAccount(null); setCustomAmount(""); setCause(""); setForm({ firstName: "", lastName: "", email: "", phone: "", anonymous: false, motivation: "" }); }} className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl font-medium text-sm text-center">Enregistrer une nouvelle ligne budgétaire</button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Fiche de Synthèse Budgétaire */}
          {step < 3 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 self-start space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Synthèse d'allocation</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between"><span>Montant ordonné :</span><strong className="text-gray-900">{finalAmount} $</strong></div>
                <div className="flex justify-between"><span>Type de flux :</span><span className="capitalize text-gray-900">{frequency === "unique" ? "Ponctuel" : "Périodique"}</span></div>
                <div className="flex justify-between"><span>Affectation :</span><span className="text-gray-900 truncate max-w-[120px] font-medium">{cause || "Fonds d'appui général"}</span></div>
                {form.motivation && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className="block text-xs text-gray-400 font-medium">Notes associées :</span>
                    <p className="text-xs text-gray-700 italic bg-gray-50 p-2 rounded mt-1 max-h-20 overflow-y-auto">"{form.motivation}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
