import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, ArrowRight, Tag } from "lucide-react";

const blogHeroImg = "/blog-hero.jpeg";
const educImg = "/blog-image-1.jpeg";
const waterImg = "/blog-image-2.jpeg";
const womenImg = "/blog-image-3.jpeg";
const agriImg = "/blog-image-4.jpeg";
const teamImg = "/blog-image-5.jpeg";
const healthImg = "/blog-image-6.jpeg";

const posts = [
  { id: 1, img: educImg, title: "L'éducation des filles, levier de développement en RDC", category: "Éducation", author: "Dr. Cécile Nzinga", date: "12 Février 2026", readTime: "5 min", excerpt: "Scolariser les filles dans les zones rurales est l'un des investissements les plus rentables pour le développement d'un pays. Notre programme a prouvé que des résultats concrets sont possibles.", tags: ["Éducation", "Genre", "Développement"], featured: true },
  { id: 2, img: waterImg, title: "Rapport de terrain : 8 puits forés au Nord Kivu", category: "Eau", author: "Serge Lufwankenda", date: "28 Janvier 2026", readTime: "4 min", excerpt: "Après 18 mois de travail intense, notre équipe terrain a réussi à forer et équiper 8 puits artésiens dans les villages les plus reculés du Nord Kivu.", tags: ["Eau", "Terrain", "Rapport"], featured: false },
  { id: 3, img: womenImg, title: "Microcrédit : 850 femmes reprennent leur destin en main", category: "Autonomisation", author: "Aminata Kouyaté", date: "15 Janvier 2026", readTime: "6 min", excerpt: "Le programme Femmes Entrepreneures a déjà accordé plus de 500 microcrédits à des femmes de Kinshasa. Les résultats sont au-delà de toutes nos espérances.", tags: ["Femmes", "Microcrédit", "Économie"], featured: false },
  { id: 4, img: agriImg, title: "L'agroécologie, une réponse au changement climatique en Afrique", category: "Agriculture", author: "Marc Tshiamala", date: "3 Janvier 2026", readTime: "7 min", excerpt: "Face aux aléas climatiques croissants, nos équipes forment les agriculteurs du Rwanda à des techniques durables qui augmentent les rendements tout en préservant les sols.", tags: ["Agriculture", "Climat", "Rwanda"], featured: false },
  { id: 5, img: teamImg, title: "Bilan 2025 : une année de transformations", category: "Rapport", author: "Emmanuel Mbala", date: "20 Décembre 2025", readTime: "10 min", excerpt: "L'année 2025 a été marquée par l'extension de nos activités à 3 nouveaux pays, le renforcement de notre équipe et l'atteinte de nos objectifs de bénéficiaires.", tags: ["Bilan", "Impact", "2025"], featured: false },
  { id: 6, img: healthImg, title: "Lutte contre la malnutrition infantile : nos nouvelles stratégies", category: "Santé", author: "Brigitte Mwamba", date: "5 Décembre 2025", readTime: "5 min", excerpt: "La malnutrition touche encore des millions d'enfants en Afrique centrale. Notre approche combinant nutrition, hygiène et sensibilisation montre des résultats encourageants.", tags: ["Santé", "Nutrition", "Enfants"], featured: false },
];

const categories = ["Tous", "Éducation", "Eau", "Santé", "Agriculture", "Autonomisation", "Rapport"];
const categoryColors: Record<string, string> = {
  "Éducation": "#16a34a", "Eau": "#0284c7", "Autonomisation": "#d97706",
  "Agriculture": "#65a30d", "Rapport": "#7c3aed", "Santé": "#dc2626",
};

export function Blog() {
  const [activeCategory, setActiveCategory] = useState("Tous");

  const filtered = posts.filter((p) => activeCategory === "Tous" || p.category === activeCategory);
  const featured = posts.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 flex items-center overflow-hidden">
        <img src={blogHeroImg} alt="Blog" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-white text-4xl font-bold mb-2">Notre Blog</h1>
          <p className="text-gray-300 text-sm">Actualités, rapports de terrain et analyses</p>
        </div>
      </section>

      {/* Featured post */}
      {featured && activeCategory === "Tous" && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Article à la une</span>
            <div className="mt-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto overflow-hidden">
                <img src={featured.img} alt={featured.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {featured.category}
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {featured.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {featured.readTime} de lecture</span>
                </div>
                <h2 className="text-gray-800 mb-3">{featured.title}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {featured.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{featured.author}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filter */}
      <section className="py-5 border-b border-gray-100">
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

      {/* Posts grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-44 overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div
                  className="absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: categoryColors[post.category] || "#16a34a" }}
                >
                  {post.category}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                </div>
                <h3 className="text-gray-800 mb-2 leading-snug">{post.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.map((t) => (
                    <span key={t} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Tag size={9} /> {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: categoryColors[post.category] || "#16a34a" }}>
                      {post.author.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </div>
                    <span className="text-xs text-gray-600">{post.author}</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs text-primary hover:text-primary font-semibold">
                    Lire <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h2 className="text-gray-800 mb-3">Restez informé</h2>
          <p className="text-gray-500 text-sm mb-6">Abonnez-vous à notre newsletter pour recevoir nos derniers articles et rapports de terrain.</p>
          <form className="flex gap-2">
            <input type="email" placeholder="Votre adresse email" className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <button type="submit" className="bg-primary hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
