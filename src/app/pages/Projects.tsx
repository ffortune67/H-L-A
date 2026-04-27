import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight, Users } from "lucide-react";

const educImg = "/projects-image-1.jpeg";
const waterImg = "/projects-image-2.jpeg";
const womenImg = "/projects-image-3.jpeg";
const agriImg = "/projects-image-4.jpeg";
const healthImg = "/projects-image-5.jpeg";
const heroImg = "/projects-hero.jpeg";

const projects = [
  { id: 1, img: educImg, title: "École du Futur — Kasaï", category: "Éducation", location: "Kasaï, RDC", date: "2023–2025", beneficiaries: "1 200", status: "En cours", progress: 65, color: "#16a34a", desc: "Construction de 3 classes, recrutement d'enseignants qualifiés et distribution de kits scolaires pour 1 200 enfants." },
  { id: 2, img: waterImg, title: "Eau Pour Tous — Nord Kivu", category: "Eau", location: "Nord Kivu, RDC", date: "2022–2024", beneficiaries: "3 400", status: "Terminé", progress: 100, color: "#0284c7", desc: "Forage de 8 puits artésiens, installation de pompes solaires et formation de comités de gestion locaux." },
  { id: 3, img: womenImg, title: "Femmes Entrepreneures", category: "Autonomisation", location: "Kinshasa, RDC", date: "2024–2026", beneficiaries: "850", status: "En cours", progress: 40, color: "#d97706", desc: "Programme de microcrédit et de formation professionnelle ciblant 850 femmes chefs de ménage." },
  { id: 4, img: agriImg, title: "Agri-Résilience Rwanda", category: "Agriculture", location: "Kigali, Rwanda", date: "2023–2025", beneficiaries: "2 100", status: "En cours", progress: 55, color: "#65a30d", desc: "Promotion de l'agroécologie, organisation de coopératives et accès aux marchés locaux pour 2 100 agriculteurs." },
  { id: 5, img: healthImg, title: "Santé Mère-Enfant", category: "Santé", location: "Bujumbura, Burundi", date: "2021–2023", beneficiaries: "4 500", status: "Terminé", progress: 100, color: "#dc2626", desc: "Formation de 80 agents de santé communautaires et vaccination de 4 500 enfants contre les maladies évitables." },
  { id: 6, img: heroImg, title: "Villages Solidaires", category: "Habitat", location: "Goma, RDC", date: "2024–2027", beneficiaries: "600", status: "Nouveau", progress: 10, color: "#7c3aed", desc: "Programme intégré de reconstruction d'habitats pour les familles déplacées par les conflits armés." },
];

const categories = ["Tous", "Éducation", "Eau", "Santé", "Agriculture", "Autonomisation", "Habitat"];
const statuses = ["Tous", "En cours", "Terminé", "Nouveau"];

export function Projects() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activeStatus, setActiveStatus] = useState("Tous");

  const filtered = projects.filter((p) => {
    const catOk = activeCategory === "Tous" || p.category === activeCategory;
    const statOk = activeStatus === "Tous" || p.status === activeStatus;
    return catOk && statOk;
  });

  const statusColor = (s: string) => {
    if (s === "Terminé") return "bg-primary-100 text-primary";
    if (s === "En cours") return "bg-blue-100 text-blue-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 flex items-center overflow-hidden">
        <img src={heroImg} alt="Projets" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-white text-4xl font-bold mb-2">Nos Projets</h1>
          <p className="text-gray-300 text-sm">Accueil → Projets</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1 self-center">Catégorie :</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === c ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-primary"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-semibold text-gray-500 mr-1 self-center">Statut :</span>
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeStatus === s ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-500 text-sm mb-6">{filtered.length} projet(s) trouvé(s)</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative h-44 overflow-hidden">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  <div className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(p.status)}`}>{p.status}</div>
                  <div className="absolute top-3 right-3 bg-white/90 text-xs font-semibold px-2 py-1 rounded-full" style={{ color: p.color }}>{p.category}</div>
                </div>
                <div className="p-5">
                  <h3 className="text-gray-800 mb-2">{p.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4">{p.desc}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {p.location}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> {p.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                    <Users size={11} /> <strong style={{ color: p.color }}>{p.beneficiaries}</strong>&nbsp;bénéficiaires
                  </div>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-gray-400">Avancement</span>
                    <span className="font-semibold" style={{ color: p.color }}>{p.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white mb-3">Soutenez nos projets</h2>
          <p className="text-white text-sm mb-6">Chaque contribution finance directement les communautés sur le terrain.</p>
          <Link to="/donations" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            Faire un don <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
