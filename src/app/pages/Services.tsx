import { Link } from "react-router-dom";
import { BookOpen, Droplets, Stethoscope, Leaf, Users, Home, ArrowRight, CheckCircle } from "lucide-react";

const heroImg = "/services-hero.jpeg";

const services = [
  {
    icon: <BookOpen size={24} />,
    title: "Conseil juridique humanitaire",
    color: "#16a34a",
    bg: "#f0fdf4",
    desc: "Accompagnement des ONG pour la rédaction de contrats, la conformité juridique et la défense devant les juridictions.",
    features: ["Rédaction de contrats et conventions", "Conseil en droit des ONG", "Contentieux administratif", "Droit du travail humanitaire", "Représentation juridique"],
  },
  {
    icon: <Droplets size={24} />,
    title: "Accès humanitaire & visas",
    color: "#0284c7",
    bg: "#f0f9ff",
    desc: "Gestion des autorisations, visas, lettres d'invitation et relations avec les autorités pour faciliter l'intervention sur le terrain.",
    features: ["Démarches de visa", "Autorisations d’accès humanitaire", "Relations institutionnelles", "Suivi réglementaire", "Assistance administrative"],
  },
  {
    icon: <Stethoscope size={24} />,
    title: "Protection et sécurité",
    color: "#dc2626",
    bg: "#fff1f2",
    desc: "Évaluation des risques, procédures de protection du personnel et soutien juridique en cas d’incidents sur le terrain.",
    features: ["Analyse des vulnérabilités", "Plans de protection", "Systèmes de signalement", "Support juridique en cas de crise", "Accompagnement des équipes"],
  },
  {
    icon: <Leaf size={24} />,
    title: "Gestion administrative & conformité",
    color: "#65a30d",
    bg: "#f7fee7",
    desc: "Assistance sur les obligations légales, fiscales et administratives des ONG en République démocratique du Congo.",
    features: ["Registre de commerce et fiscalité", "Conformité réglementaire", "Suivi CNSS et DGI", "Rapports d’activité", "Audit interne"],
  },
  {
    icon: <Users size={24} />,
    title: "Ressources humaines & paie",
    color: "#d97706",
    bg: "#fffbeb",
    desc: "Gestion des recrutements, des contrats de travail, de la paie et des obligations sociales pour les ONG.",
    features: ["Recrutement et sélection", "Contrats de travail", "Gestion de la paie", "Relations avec les administrations", "Formation RH"],
  },
  {
    icon: <Home size={24} />,
    title: "Medical Care for Humanitarian Aid Workers",
    color: "#7c3aed",
    bg: "#faf5ff",
    desc: "Prise en charge médicale et assistance santé pour le personnel humanitaire et ses opérations sur le terrain.",
    features: ["Accompagnement santé", "Centres de consultation", "Gestion des urgences médicales", "Suivi des équipes", "Kits de santé"],
  },
];

export function Services() {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 flex items-center overflow-hidden">
        <img src={heroImg} alt="Services" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-white text-4xl font-bold mb-2">Nos Services</h1>
          <p className="text-gray-300 text-sm">Accueil → Services</p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Ce que nous faisons</span>
          <h2 className="text-gray-800 mt-2 mb-4">Des services intégrés pour un impact durable</h2>
          <p className="text-gray-500 text-sm leading-relaxed">
            Notre approche est holistique : nous intervenons sur plusieurs dimensions du développement humain pour créer des changements systémiques et durables dans les communautés que nous servons.
          </p>
        </div>
      </section>

      {/* Key services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Nos services clés
            </span>
            <h2 className="text-gray-800 mt-2">
              Des prestations juridiques et scientifiques sur mesure
            </h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                title: 'Conseil juridique multidisciplinaire',
                desc: 'Assistance sur toutes les matières juridiques, administratives et opérationnelles des ONG, du contrat au contentieux fiscal, administratif et RH.',
              },
              {
                title: 'Négociation et facilités humanitaires',
                desc: 'Médiation, conventions, dérogations et démarches institutionnelles pour sécuriser l’accès et l’exécution des projets.',
              },
              {
                title: 'Formation et renforcement des compétences',
                desc: 'Programmes adaptés pour les équipes ONG sur la gestion légale, la conformité, les relations avec l’administration et la gouvernance.',
              },
              {
                title: 'Évaluation qualitative des projets',
                desc: 'Mesure de l’impact et des résultats, identification des réussites et des pistes d’amélioration à la fin des cycles projet.',
              },
              {
                title: 'Recherches et enquêtes juridiques',
                desc: 'Études sur le respect des lois, le droit international humanitaire, la prévention des abus et la lutte contre la corruption.',
              },
              {
                title: 'Production documentaire',
                desc: 'Rédaction de manuels, modules, politiques, rapports, modèles d’actes et outils de gestion administrative.',
              },
            ].map((item, index) => (
              <div key={index} className="border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-white" style={{ backgroundColor: s.color }}>
                {s.icon}
              </div>
              <h3 className="text-gray-800 mb-3">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.desc}</p>
              <ul className="space-y-1.5">
                {s.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                    <CheckCircle size={12} style={{ color: s.color }} className="flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">Notre approche</span>
            <h2 className="text-gray-800 mt-2">Comment nous travaillons</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Diagnostic communautaire", desc: "Identification participative des besoins réels avec les populations.", color: "#16a34a" },
              { step: "02", title: "Planification participative", desc: "Co-conception des solutions avec les communautés et partenaires.", color: "#0284c7" },
              { step: "03", title: "Mise en œuvre", desc: "Exécution rigoureuse avec monitoring régulier sur le terrain.", color: "#d97706" },
              { step: "04", title: "Évaluation d'impact", desc: "Mesure des résultats et capitalisation des leçons apprises.", color: "#dc2626" },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                <div className="text-3xl font-bold mb-3" style={{ color: p.color }}>{p.step}</div>
                <h4 className="text-gray-800 mb-2">{p.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white mb-3">Un projet en tête ?</h2>
          <p className="text-white text-sm mb-6">Contactez-nous pour discuter d'un partenariat ou d'une collaboration sur le terrain.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            Contactez-nous <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
