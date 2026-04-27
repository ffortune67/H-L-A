import { Link } from "react-router-dom";
import { ArrowRight, Globe, Award } from "lucide-react";

const partnerImg = "/partners-hero.jpeg";

const partners = [
  { name: "PNUD", category: "ONU / Multilatéral", description: "Programme des Nations Unies pour le Développement — financement de projets de développement durable.", color: "#0284c7", initials: "PNUD" },
  { name: "UNICEF", category: "ONU / Multilatéral", description: "Fonds des Nations Unies pour l'enfance — partenaire pour les programmes d'éducation et nutrition.", color: "#00aeef", initials: "UNI" },
  { name: "Union Européenne", category: "Bailleur institutionnel", description: "Financement de projets eau, assainissement et résilience communautaire.", color: "#003399", initials: "UE" },
  { name: "AFD", category: "Coopération bilatérale", description: "Agence Française de Développement — appui au développement agricole et rural.", color: "#e30513", initials: "AFD" },
  { name: "GIZ", category: "Coopération bilatérale", description: "Deutsche Gesellschaft für Internationale Zusammenarbeit — renforcement des capacités institutionnelles.", color: "#009f3c", initials: "GIZ" },
  { name: "USAID", category: "Coopération bilatérale", description: "Financement américain pour la santé communautaire et sécurité alimentaire.", color: "#002868", initials: "USA" },
  { name: "Oxfam", category: "ONG internationale", description: "Partenariat dans la réponse humanitaire et les projets de droits des femmes.", color: "#e70052", initials: "OXF" },
  { name: "Save the Children", category: "ONG internationale", description: "Collaboration sur la protection de l'enfance et l'éducation en situations d'urgence.", color: "#f47721", initials: "STC" },
  { name: "Croix-Rouge", category: "Mouvement humanitaire", description: "Coordination des interventions médicales d'urgence et secours aux populations.", color: "#ce1126", initials: "CR" },
  { name: "WFP", category: "ONU / Multilatéral", description: "Programme Alimentaire Mondial — lutte contre la malnutrition et insécurité alimentaire.", color: "#ee8a00", initials: "WFP" },
  { name: "Bill & Melinda Gates Foundation", category: "Fondation privée", description: "Financement des programmes de santé maternelle et infantile.", color: "#0078d4", initials: "BMG" },
  { name: "Ministère Affaires Sociales RDC", category: "Gouvernement", description: "Partenariat public pour la mise en œuvre des politiques sociales nationales.", color: "#1a5276", initials: "MAS" },
];

const categoryColors: Record<string, string> = {
  "ONU / Multilatéral": "#0284c7",
  "Bailleur institutionnel": "#7c3aed",
  "Coopération bilatérale": "#16a34a",
  "ONG internationale": "#d97706",
  "Mouvement humanitaire": "#dc2626",
  "Fondation privée": "#db2777",
  "Gouvernement": "#1a5276",
};

const categories = ["Tous", ...Array.from(new Set(partners.map((p) => p.category)))];

import { useState } from "react";

export function Partners() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = partners.filter((p) => activeCategory === "Tous" || p.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 flex items-center overflow-hidden">
        <img src={partnerImg} alt="Partenaires" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-white text-4xl font-bold mb-2">Nos Partenaires</h1>
          <p className="text-gray-300 text-sm">Accueil → Partenaires</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Ensemble, nous sommes plus forts</span>
          <h2 className="text-gray-800 mt-2 mb-4">Un réseau de partenaires engagés</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Nos partenariats avec des organisations internationales, des bailleurs de fonds, des ONG et des institutions gouvernementales sont au cœur de notre capacité à créer un impact durable et à grande échelle.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-primary">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { value: "12", label: "Partenaires actifs" },
            { value: "8", label: "Pays couverts" },
            { value: "7", label: "Types d'organisation" },
            { value: "14", label: "Années de collaboration" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-white text-3xl font-bold">{s.value}</div>
              <div className="text-white text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === c ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Partners grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex gap-4 items-start">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: p.color }}
              >
                {p.initials}
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-gray-800">{p.name}</h4>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-2"
                  style={{ backgroundColor: (categoryColors[p.category] || "#16a34a") + "20", color: categoryColors[p.category] || "#16a34a" }}
                >
                  {p.category}
                </span>
                <p className="text-gray-500 text-xs leading-relaxed">{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Become partner */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-primary rounded-2xl p-10 text-center text-white">
            <Award size={40} className="mx-auto mb-4 text-white" />
            <h2 className="text-white mb-3">Devenez notre partenaire</h2>
            <p className="text-white text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              Vous êtes une institution, une entreprise ou une organisation souhaitant soutenir notre mission ? Nous sommes ouverts à tout type de collaboration.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              Proposer un partenariat <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
