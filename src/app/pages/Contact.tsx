import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const heroImg = "/contact-hero.jpeg";

const contactInfo = [
  { icon: <MapPin size={20} />, title: "Adresse", content: "63 Avenue Col Mondjiba, Basoko, Ngaliema, Kinshasa, République Démocratique du Congo", color: "#16a34a" },
  { icon: <Phone size={20} />, title: "Téléphone", content: "+243 972 339 318\n+243 815 123 456", color: "#0284c7" },
  { icon: <Mail size={20} />, title: "Email", content: "info.center@h-l-a.org\navocats.humanitaires@h-l-a.org", color: "#d97706" },
  { icon: <Clock size={20} />, title: "Horaires", content: "Lun – Ven : 8h00 – 17h00\nSam : 9h00 – 13h00", color: "#7c3aed" },
];

export function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", type: "information", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 flex items-center overflow-hidden">
        <img src={heroImg} alt="Contact" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-white text-4xl font-bold mb-2">Contactez-nous</h1>
          <p className="text-gray-300 text-sm">Nous sommes à votre écoute</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <div className="space-y-4">
            <div>
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Informations de contact</span>
              <h2 className="text-gray-800 mt-2 mb-2">Parlons ensemble</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Un projet d'appui juridique ou humanitaire ? Contactez-nous pour obtenir une réponse rapide et un accompagnement concret.
              </p>
            </div>

            {contactInfo.map((c, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: c.color }}>
                  {c.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 mb-1">{c.title}</div>
                  <div className="text-xs text-gray-500 whitespace-pre-line leading-relaxed">{c.content}</div>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-primary rounded-2xl p-5 text-white">
              <div className="font-semibold mb-3">Suivez-nous</div>
              <div className="flex gap-3">
                {[
                  { icon: <Facebook size={16} />, label: "Facebook" },
                  { icon: <Twitter size={16} />, label: "Twitter" },
                  { icon: <Instagram size={16} />, label: "Instagram" },
                  { icon: <Youtube size={16} />, label: "YouTube" },
                ].map((s, i) => (
                  <a key={i} href="#" title={s.label} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-primary" />
                </div>
                <h3 className="text-gray-800 mb-2">Message envoyé !</h3>
                <p className="text-gray-500 text-sm max-w-sm">Merci pour votre message. Notre équipe vous répondra dans les 48 heures.</p>
                <button onClick={() => setSent(false)} className="mt-6 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-gray-800 mb-4">Envoyez-nous un message</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Nom complet *</label>
                    <input
                      required
                      type="text"
                      placeholder="Jean Dupont"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="jean@exemple.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Type de demande</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white"
                  >
                    <option value="information">Demande d'information</option>
                    <option value="partenariat">Proposition de partenariat</option>
                    <option value="benevole">Devenir bénévole</option>
                    <option value="don">Question sur les dons</option>
                    <option value="media">Demande média / presse</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Sujet *</label>
                  <input
                    required
                    type="text"
                    placeholder="Sujet de votre message"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Message *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Décrivez votre demande en détail..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  <Send size={16} />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl overflow-hidden h-64 bg-gray-200 flex items-center justify-center border border-gray-200">
            <div className="text-center text-gray-500">
              <MapPin size={32} className="mx-auto mb-2 text-primary" />
              <p className="text-sm font-semibold">123, Avenue de la Paix — Kinshasa, RDC</p>
              <p className="text-xs mt-1">Google Maps intégré ici en production</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
