import { useState } from "react";
import { FileText, Download, Search, Eye, Calendar, BookOpen, BarChart2, FileSpreadsheet, Presentation } from "lucide-react";

const heroImg = "/downloads-hero.jpeg";

type DocType = "Rapport" | "Brochure" | "Formulaire" | "Présentation" | "Données";

interface Doc {
  id: number;
  title: string;
  description: string;
  type: DocType;
  size: string;
  date: string;
  downloads: number;
  category: string;
  lang: string;
}

const docs: Doc[] = [
  { id: 1, title: "Rapport Annuel 2025", description: "Bilan complet de nos activités, finances et impact pour l'année 2025.", type: "Rapport", size: "4.2 Mo", date: "Jan 2026", downloads: 342, category: "Rapports annuels", lang: "FR" },
  { id: 2, title: "Rapport Annuel 2024", description: "Bilan des activités, résultats des projets et états financiers 2024.", type: "Rapport", size: "3.8 Mo", date: "Jan 2025", downloads: 891, category: "Rapports annuels", lang: "FR" },
  { id: 3, title: "Rapport Annuel 2023", description: "Bilan des activités et impact mesurable pour l'exercice 2023.", type: "Rapport", size: "3.1 Mo", date: "Fév 2024", downloads: 1204, category: "Rapports annuels", lang: "FR" },
  { id: 4, title: "Brochure institutionnelle 2026", description: "Présentation générale de l'ONG, ses missions, valeurs et domaines d'intervention.", type: "Brochure", size: "2.5 Mo", date: "Fév 2026", downloads: 567, category: "Communication", lang: "FR/EN" },
  { id: 5, title: "Rapport projet Eau — Nord Kivu", description: "Rapport final du projet d'accès à l'eau potable au Nord Kivu (2022–2024).", type: "Rapport", size: "5.6 Mo", date: "Déc 2024", downloads: 234, category: "Rapports de projet", lang: "FR" },
  { id: 6, title: "Rapport projet Éducation — Kasaï", description: "Rapport d'avancement semestriel du programme scolaire Kasaï 2024.", type: "Rapport", size: "3.2 Mo", date: "Juil 2024", downloads: 198, category: "Rapports de projet", lang: "FR" },
  { id: 7, title: "Formulaire de demande de partenariat", description: "Formulaire officiel à remplir pour proposer un partenariat institutionnel.", type: "Formulaire", size: "0.4 Mo", date: "Mar 2025", downloads: 445, category: "Formulaires", lang: "FR" },
  { id: 8, title: "Formulaire de candidature bénévole", description: "Postulez comme bénévole en remplissant ce formulaire de candidature.", type: "Formulaire", size: "0.3 Mo", date: "Jan 2025", downloads: 782, category: "Formulaires", lang: "FR" },
  { id: 9, title: "Présentation institutionnelle (PowerPoint)", description: "Deck de présentation de l'ONG pour les réunions et événements.", type: "Présentation", size: "8.1 Mo", date: "Déc 2024", downloads: 156, category: "Communication", lang: "FR" },
  { id: 10, title: "Données d'impact 2020–2025", description: "Jeu de données ouvert sur nos indicateurs de performance 2020–2025.", type: "Données", size: "1.2 Mo", date: "Jan 2026", downloads: 89, category: "Open Data", lang: "FR/EN" },
  { id: 11, title: "Guide méthodologique M&E", description: "Méthodologie de suivi-évaluation utilisée dans nos projets terrain.", type: "Brochure", size: "2.8 Mo", date: "Oct 2024", downloads: 321, category: "Ressources techniques", lang: "FR" },
  { id: 12, title: "Statuts et règlement intérieur", description: "Documents fondateurs : statuts officiels et règlement intérieur de l'ONG.", type: "Rapport", size: "1.1 Mo", date: "Jan 2022", downloads: 634, category: "Documents légaux", lang: "FR" },
];

const typeConfig: Record<DocType, { icon: React.ReactNode; color: string; bg: string }> = {
  "Rapport": { icon: <BarChart2 size={18} />, color: "#16a34a", bg: "#f0fdf4" },
  "Brochure": { icon: <BookOpen size={18} />, color: "#0284c7", bg: "#f0f9ff" },
  "Formulaire": { icon: <FileSpreadsheet size={18} />, color: "#d97706", bg: "#fffbeb" },
  "Présentation": { icon: <Presentation size={18} />, color: "#7c3aed", bg: "#faf5ff" },
  "Données": { icon: <FileText size={18} />, color: "#dc2626", bg: "#fff1f2" },
};

const allCategories = ["Toutes", ...Array.from(new Set(docs.map((d) => d.category)))];
const allTypes: ("Tous" | DocType)[] = ["Tous", "Rapport", "Brochure", "Formulaire", "Présentation", "Données"];

export function Downloads() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const [type, setType] = useState<"Tous" | DocType>("Tous");

  const filtered = docs.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Toutes" || d.category === category;
    const matchType = type === "Tous" || d.type === type;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 flex items-center overflow-hidden">
        <img src={heroImg} alt="Téléchargements" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-white text-4xl font-bold mb-2">Téléchargements</h1>
          <p className="text-gray-300 text-sm">Rapports, brochures, formulaires et ressources</p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-4">
          {/* Search */}
          <div className="relative max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary bg-white"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            {/* Type filter */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-semibold text-gray-500">Type :</span>
              {allTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${type === t ? "bg-primary text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500">Catégorie :</span>
            {allCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${category === c ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Documents */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-500 text-sm mb-6">{filtered.length} document(s) disponible(s)</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc) => {
              const config = typeConfig[doc.type];
              return (
                <div key={doc.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow flex gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: config.bg, color: config.color }}
                  >
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-gray-800 text-sm leading-tight">{doc.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: config.bg, color: config.color }}>
                        {doc.type}
                      </span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{doc.lang}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-3">{doc.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {doc.date}</span>
                        <span>{doc.size}</span>
                        <span className="flex items-center gap-1"><Download size={10} /> {doc.downloads}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors" title="Aperçu">
                          <Eye size={12} />
                        </button>
                        <button
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: config.color }}
                          title="Télécharger"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <FileText size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Aucun document trouvé pour vos critères de recherche.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
