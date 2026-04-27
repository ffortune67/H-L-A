import { Link } from "react-router-dom";
import { Heart, Users, Globe, Sprout, ArrowRight, ChevronRight, Quote, Star } from "lucide-react";

const heroImg = "/home-hero.jpeg";
const donationImg = "/home-hero-alt.jpeg";

const stats = [
  { value: "15 000+", label: "Personnes accompagnées", icon: <Users size={22} /> },
  { value: "12", label: "Années d’expérience", icon: <Heart size={22} /> },
  { value: "125+", label: "Organisations soutenues", icon: <Globe size={22} /> },
  { value: "4", label: "Provinces desservies", icon: <Sprout size={22} /> },
];

const testimonials = [
  { name: "Marie Lukasa", role: "Bénéficiaire, Kinshasa", text: "Humanitarian Legal Advisor nous a aidés à sécuriser notre activité et à obtenir les autorisations nécessaires pour travailler sereinement.", stars: 5 },
  { name: "Jean-Pierre Kaba", role: "Partenaire, PNUD", text: "Une organisation fiable, professionnelle et engagée pour les ONG en RDC.", stars: 5 },
  { name: "Amina Diallo", role: "Volontaire", text: "Travailler avec HLA m'a permis de contribuer à des projets qui ont un réel impact sur le terrain.", stars: 5 },
];

export function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <span className="inline-block bg-[#820002] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-5 tracking-wider uppercase"> ONG Humanitaire depuis 2010</span>
            <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-6">
              Ensemble, <span className="text-[#820002]">construisons</span> un monde meilleur
            </h1>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed">
              Humanitarian Legal Advisor accompagne les ONG et acteurs humanitaires en RDC avec des solutions juridiques, administratives et humaines adaptées.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/donations" className="flex items-center gap-2 bg-[#820002] hover:bg-[#660103] text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                <Heart size={16} fill="white" /> Faire un don
              </Link>
              <Link to="/projects" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/40 text-white px-6 py-3 rounded-xl font-semibold transition-colors backdrop-blur-sm">
                Nos projets <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-[#820002]">
                  {s.icon}
                </div>
                <div>
                  <div className="text-[#820002] font-bold text-xl leading-none">{s.value}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission band */}
      <section className="bg-[#820002] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-red-200 text-sm font-semibold uppercase tracking-wider">Notre mission</p>
          <h2 className="text-white text-3xl md:text-4xl font-bold mt-4 mb-6">Soutenir les ONG avec des actions concrètes</h2>
          <p className="text-red-100 text-sm leading-relaxed max-w-3xl mx-auto mb-10">
            Un engagement clair : rendre les opérations humanitaires plus sûres, plus efficaces et mieux accompagnées.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 text-left">
              <h3 className="text-white font-semibold mb-3">Assistance juridique</h3>
              <p className="text-red-100 text-sm leading-relaxed">Support sur mesure pour les contrats, la conformité et la défense des droits.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 text-left">
              <h3 className="text-white font-semibold mb-3">Accès humanitaire</h3>
              <p className="text-red-100 text-sm leading-relaxed">Médiation et facilitation pour les autorisations et les relations institutionnelles.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 text-left">
              <h3 className="text-white font-semibold mb-3">Formation</h3>
              <p className="text-red-100 text-sm leading-relaxed">Renforcement des capacités en gestion juridique et opérationnelle.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 text-left">
              <h3 className="text-white font-semibold mb-3">Évaluation</h3>
              <p className="text-red-100 text-sm leading-relaxed">Mesure de l’impact et amélioration continue des projets humanitaires.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 text-left">
              <h3 className="text-white font-semibold mb-3">Recherche</h3>
              <p className="text-red-100 text-sm leading-relaxed">Analyses juridiques et enquêtes pour appuyer les stratégies de terrain.</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 text-left">
              <h3 className="text-white font-semibold mb-3">Documentation</h3>
              <p className="text-red-100 text-sm leading-relaxed">Production de manuels, politiques internes et outils de gouvernance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img src={donationImg} alt="About" className="rounded-2xl w-full h-80 object-cover shadow-lg" />
            <div className="absolute -bottom-5 -right-5 bg-[#820002] text-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-bold">14+</div>
              <div className="text-xs text-red-100">années d'expérience</div>
            </div>
          </div>
          <div>
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">À propos de nous</span>
            <h2 className="text-gray-800 mt-2 mb-4">Une organisation au service de l'humanité</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Fondée en 2010 à Kinshasa, Humanitarian Legal Advisor est une organisation non gouvernementale spécialisée en expertise juridique humanitaire et administrative pour les ONG en République démocratique du Congo.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Notre approche est centrée sur les acteurs humanitaires : nous travaillons avec les ONG pour sécuriser leurs opérations, protéger leurs équipes et garantir l'impact durable de leurs projets.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {["Vision inclusive", "Transparence totale", "Impact mesurable", "Présence locale"].map((v, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <ChevronRight size={14} className="text-[#820002] flex-shrink-0" />
                  {v}
                </div>
              ))}
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 bg-[#820002] hover:bg-[#660103] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              En savoir plus <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#820002]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-red-200 text-sm font-semibold uppercase tracking-wider">Témoignages</span>
            <h2 className="text-white mt-2">Ce que disent nos partenaires</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Quote size={28} className="text-white mb-3" />
                <p className="text-white text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} size={12} fill="#ffffff" className="text-white" />
                  ))}
                </div>
                <div className="font-semibold text-white text-sm">{t.name}</div>
                <div className="text-red-200 text-xs">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-red-50 border-y border-red-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-gray-800 mb-4">Prêt à faire la différence ?</h2>
          <p className="text-gray-500 text-sm mb-8">Chaque contribution, grande ou petite, change une vie. Rejoignez notre communauté de donateurs et de bénévoles.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/donations" className="flex items-center gap-2 bg-[#820002] hover:bg-[#660103] text-white px-6 py-3 rounded-xl font-semibold transition-colors">
              <Heart size={16} fill="white" /> Faire un don maintenant
            </Link>
            <Link to="/contact" className="flex items-center gap-2 bg-white border border-gray-200 hover:border-[#820002] text-gray-700 px-6 py-3 rounded-xl font-semibold transition-colors">
              Devenir bénévole
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}