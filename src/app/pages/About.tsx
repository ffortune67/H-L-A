import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Target,
  Eye,
  Heart,
  ArrowRight,
  CheckCircle,
  Users,
  Scale,
  ShieldCheck,
  GraduationCap,
  FileCheck,
  Search,
  FileText,
} from "lucide-react";

const teamImg = "/about-team.jpeg";
const heroImg = "/about-hero.jpeg";

const team = [
  {
    name: "Maitre ALEX MURHI",
    role: "Directeur General du Departement",
    initials: "AM",
    color: "#16a34a",
  },
  {
    name: "Maitre YVES KAJANGU YENGA",
    role: "Fondateur associe",
    initials: "YK",
    color: "#0284c7",
  },
  {
    name: "Maitre JOSEPH BREHAM",
    role: "Directeur de la Recherche juridique",
    initials: "JB",
    color: "#d97706",
  },
  {
    name: "Maitre FARADJA SAKANO",
    role: "Directrice des operations",
    initials: "FS",
    color: "#db2777",
  },
  {
    name: "Maitre DINA KAFARHIRA",
    role: "consultante",
    initials: "DK",
    color: "#7c3aed",
  },
  {
    name: "FORTUNE MIAGUE",
    role: "consultant IT",
    initials: "FM",
    color: "#dc2626",
  },
];

const values = [
  {
    icon: <Heart size={20} />,
    title: "Solidarité",
    desc: "Nous plaçons l'humain au cœur de chaque action, sans discrimination.",
    color: "#ef4444",
  },
  {
    icon: <Eye size={20} />,
    title: "Transparence",
    desc: "Nos finances et activités sont accessibles à tous nos partenaires.",
    color: "#0284c7",
  },
  {
    icon: <Target size={20} />,
    title: "Impact",
    desc: "Nous mesurons et évaluons rigoureusement les résultats de nos projets.",
    color: "#16a34a",
  },
  {
    icon: <Users size={20} />,
    title: "Participation",
    desc: "Les communautés sont actrices de leur propre développement.",
    color: "#d97706",
  },
];

const milestones = [
  {
    year: "2010",
    event:
      "Création de Humanitarian Legal Advisor à Kinshasa pour accompagner les ONG.",
  },
  {
    year: "2012",
    event:
      "Lancement du Programme Avocats Humanitaires pour la représentation légale.",
  },
  {
    year: "2015",
    event:
      "Développement du Programme Accès Humanitaire et relations gouvernementales.",
  },
  {
    year: "2018",
    event:
      "Reconnaissance officielle comme ONG d'expertise juridique humanitaire.",
  },
  {
    year: "2021",
    event:
      "Lancement du Programme MCHAW pour la prise en charge médicale du personnel humanitaire.",
  },
  {
    year: "2024",
    event:
      "Plus de 150 ONG accompagnées et 200+ dossiers juridiques traités avec succès.",
  },
];

const missions = [
  {
    icon: <Scale size={20} />,
    title: "Assistance juridique sur mesure",
    desc: "pour les ONG et leurs partenaires",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Conseil et médiation",
    desc: "en accès humanitaire et relations institutionnelles",
  },
  {
    icon: <GraduationCap size={20} />,
    title: "Formation et renforcement",
    desc: "des capacités en gestion légale et opérationnelle",
  },
  {
    icon: <FileCheck size={20} />,
    title: "Évaluation juridique",
    desc: "et finale des projets humanitaires",
  },
  {
    icon: <Search size={20} />,
    title: "Recherches et enquêtes",
    desc: "juridiques sur les politiques de sauvegarde, corruption, abus, etc.",
  },
  {
    icon: <FileText size={20} />,
    title: "Production de documents",
    desc: "manuels, modules, logiciels RH, rapports et politiques internes",
  },
];

const programmes = [
  {
    title: "Programme Avocats Humanitaires",
    desc: "Plaidoiries et représentation devant cours et tribunaux",
    color: "#820002",
  },
  {
    title: "Programme OraLabora",
    desc: "Gestion des ressources humaines et de la paie externalisées",
    color: "#0284c7",
  },
  {
    title: "Programme Accès Humanitaire",
    desc: "Démarches administratives, visas, relations gouvernementales, fournisseurs agréés, protection juridique",
    color: "#16a34a",
  },
  {
    title: "Programme MCHAW",
    desc: "Medical Care for Humanitarian Aid Workers - Prise en charge médicale du personnel humanitaire",
    color: "#d97706",
  },
];

const aboutSections = [
  { id: "qui-sommes-nous", label: "Qui sommes-nous ?" },
  { id: "presentation", label: "Présentation" },
  { id: "mission-vision", label: "Mission & Vision" },
  { id: "valeurs", label: "Valeurs" },
];

export function About() {
  const [activeSection, setActiveSection] = useState("qui-sommes-nous");

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = aboutSections[0].id;
      const offset = window.innerHeight * 0.25;

      aboutSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        if (rect.top <= offset) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Page Hero */}
      <section id="hero" className="relative h-64 flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="À propos"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-white text-4xl font-bold mb-2">
            À Propos de Nous
          </h1>
          <p className="text-gray-300 text-sm">
            Accueil → À Propos
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-wrap gap-4 text-sm">
          {aboutSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`anchor-link ${activeSection === section.id ? "active" : ""}`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </a>
          ))}
        </div>
      </section>

      {/* Who we are */}
      <section id="qui-sommes-nous" className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Qui sommes-nous ?
            </span>
            <h2 className="text-gray-800 mt-2 mb-5">
              Une ONG à caractère scientifique et philanthropique
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Humanitarian Legal Advisor est une organisation scientifique et philanthropique, en procédure de reconnaissance d'utilité publique en République démocratique du Congo. Elle s'inscrit dans le cadre de l'Établissement d'Utilité Publique régi par la loi n° 004/2001 du 20 juillet 2001, articles 58 et suivants.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Issue du Cabinet KAJANGU & Associés 1984, Avocats Experts, l'organisation apporte une expertise juridique humanitaire multidisciplinaire sur mesure, afin de réduire les difficultés juridiques, administratives et opérationnelles rencontrées par les ONG internationales et nationales, leurs partenaires et leurs bénéficiaires en RDC.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Nos actions visent la promotion et la protection des droits humains, l'aide au développement national et la sensibilisation communautaire aux questions de droit. Nous produisons des solutions adaptées aux contextes des provinces touchées par la crise humanitaire et aux enjeux des zones urbaines et rurales.
            </p>
            <ul className="space-y-2">
              {[
                "Conseil juridique multidisciplinaire en ligne et en présentiel",
                "Négociation, médiation et obtention de dérogations institutionnelles",
                "Formation et renforcement des compétences des équipes ONG",
                "Recherches juridiques, enquêtes et analyses pour améliorer l'accès à la justice",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <CheckCircle
                    size={14}
                    className="text-[#820002] flex-shrink-0"
                  />{" "}
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-sm leading-relaxed mt-4">
              En attendant l'indépendance juridique complète de Humanitarian Legal Advisor, l'organisation opère sous la direction du Département des Organisations Humanitaires du Cabinet KAJANGU & Associés, tout en développant ses propres services scientifiques, juridiques et sociaux destinés aux acteurs humanitaires en RDC.
            </p>
          </div>
          <div className="relative">
            <img
              src={teamImg}
              alt="Notre équipe"
              className="rounded-2xl w-full h-80 object-cover shadow-lg"
            />
            <div className="absolute -bottom-5 -left-5 bg-[#820002] text-white rounded-2xl p-5 shadow-xl">
              <div className="text-3xl font-bold">2010</div>
              <div className="text-xs text-red-100">
                Année de création
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation détaillée */}
      <section id="presentation" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Présentation
            </span>
            <h2 className="text-gray-800 mt-2">
              Conseiller Juridique Humanitaire
            </h2>
          </div>
          <div className="space-y-6 text-gray-600 text-sm leading-relaxed">
            <p>
              Conseiller Juridique Humanitaire est une organisation non gouvernementale à caractère scientifique et philanthropique d'expertise juridique humanitaire, administrative et patrimoniale en faveur des organisations non gouvernementales internationales et nationales en République Démocratique du Congo.
            </p>
            <p>
              Numéro d'enregistrement : BA.17.862/023<br />
              Registre de Commerce : CD/KNG/RCCM/25-A-08078<br />
              Identification Nationale : 01-G4301-N66396I<br />
              Numéro d'Impôt : A2533105J
            </p>
            <p>
              Contact : <a href="mailto:info.center@h-l-a.org" className="text-[#820002] hover:underline">info.center@h-l-a.org</a><br />
              Adresses : 63 Avenue Col Mondjiba, Basoko, Ngaliema, Kinshasa (Coordination Centrale) et 62 Avenue Lynn Lusi, Les Volcans, Goma, Nord-Kivu (Coordination Provinciale).
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Programme Avocats Humanitaires</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Section Judiciaire : en charge de toute affaire portée devant les juridictions civiles ou militaires (cours, tribunaux et parquets) dans l'intérêt de votre organisation et de ses partenaires. Notre section mobilise les meilleurs avocats, formés aux principes humanitaires et aux litiges rencontrés par les ONG, notamment le contentieux fiscal, le droit du travail et le droit des contrats.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Les prestations comprennent la comparution à l'audience et au parquet, les plaidoiries éventuelles, la rédaction des conclusions, notes de plaidoirie, recours et oppositions, du premier degré de juridiction à la plus haute instance.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:avocats.humanitaires@h-l-a.org" className="text-[#820002] hover:underline">avocats.humanitaires@h-l-a.org</a>
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Section Juridique</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  En charge des conseils sur mesure, interventions spéciales, négociations et suivis personnalisés. Cette section prend en charge les aspects administratifs, la conformité légale, la fiscalité, le contentieux fiscal, les pratiques financières, la gestion des ressources humaines et le droit du travail.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:expertise.juridique@h-l-a.org" className="text-[#820002] hover:underline">expertise.juridique@h-l-a.org</a>
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Section d'Évaluation et de Recherche</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Section Évaluation Projet : nous analysons la performance du projet, la conformité juridique, les risques contractuels, les normes de gouvernance et les droits humains. L'objectif est d'optimiser la durabilité juridique de vos actions.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:evaluation.projet@h-l-a.org" className="text-[#820002] hover:underline">evaluation.projet@h-l-a.org</a>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Programme Ora Labora</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Section Recherche et Enquêtes : vérification de la conformité des projets aux cadres juridiques locaux et internationaux, collecte de données sur le terrain, analyse des impacts et détection des risques juridiques, fraudes ou abus.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:recherches.enquetes@h-l-a.org" className="text-[#820002] hover:underline">recherches.enquetes@h-l-a.org</a>
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Section Ressources Humaines</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nous externalisons la gestion RH : recrutement, sélection, entretiens, gestion des candidatures et placement des meilleurs profils, pour optimiser l'efficacité des ONG.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:hr.labora@h-l-a.org" className="text-[#820002] hover:underline">hr.labora@h-l-a.org</a>
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Section Gestion de la Paie</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gestion complète de la paie selon le Code du travail congolais, les conventions collectives et les obligations fiscales et sociales auprès de la CNSS, DGI, Office National de l'Emploi et INPP.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:pay.labora@h-l-a.org" className="text-[#820002] hover:underline">pay.labora@h-l-a.org</a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Programme d'Accès Humanitaire</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Section Visa : gestion des démarches de déplacements internationaux des expatriés, préparation des lettres d'invitation, demandes de visa, rapatriement et suivi des passeports.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:visa.section@h-l-a.org" className="text-[#820002] hover:underline">visa.section@h-l-a.org</a>
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Section Administrative</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Coordination des relations entre le gouvernement central et les ONG, gestion des démarches administratives, autorisations et supervision des partenariats institutionnels.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:administrative.section@h-l-a.org" className="text-[#820002] hover:underline">administrative.section@h-l-a.org</a>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Banking Support Section</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Assistance aux ONG pour la gestion de leurs relations bancaires, l'accès aux services bancaires, la constitution de dossiers et la médiation avec les institutions financières.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:banking.support@h-l-a.org" className="text-[#820002] hover:underline">banking.support@h-l-a.org</a>
                </p>
              </div>

              <div>
                <h3 className="text-gray-800 font-semibold mb-3">Authorized Suppliers Section</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Gestion des prestataires agréés, sélection basée sur la qualité, la conformité légale et la fiabilité, pour simplifier les achats et les procédures internes des ONG.</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contact : <a href="mailto:authorized.suppliers@h-l-a.org" className="text-[#820002] hover:underline">authorized.suppliers@h-l-a.org</a>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="rounded-3xl bg-white border border-gray-200 p-8 shadow-sm">
              <h3 className="text-gray-800 font-semibold mb-4">Protection Section</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Évaluation des risques, mise en place de systèmes de signalement, sensibilisation, réaction aux incidents et suivi des cas pour protéger votre organisation et ses équipes.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Contact : <a href="mailto:protection.section@h-l-a.org" className="text-[#820002] hover:underline">protection.section@h-l-a.org</a>
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-[#f8fafc] border border-gray-200 p-8">
            <h3 className="text-gray-800 font-semibold mb-4">Programme de Prise en charge Médicale</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Medical Care for Humanitarian Aid Workers (MC HAW) offre une prise en charge médicale adaptée pour les travailleurs humanitaires, y compris un centre d'appel, des consultations à distance, des kits de secours et un réseau de soins pour les urgences.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Contact : <a href="mailto:mc-haw@h-l-a.org" className="text-[#820002] hover:underline">mc-haw@h-l-a.org</a>
            </p>
          </div>

          <div className="mt-12 rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-gray-800 font-semibold mb-4">Bureau de Gestion des Contributions</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Les contributions désignent les transactions financières liées à nos services. Elles sont définies en fonction du service demandé et peuvent être annuelles ou occasionnelles. Les tarifs sont en dollars américains et adaptés à chaque organisation.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pour recevoir notre barème contributif, envoyez une demande à <a href="mailto:finance.officer@h-l-a.org" className="text-[#820002] hover:underline">finance.officer@h-l-a.org</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision */}
      <section id="mission-vision" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6">
          <div className="bg-[#820002] rounded-2xl p-8 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Target size={22} />
            </div>
            <h3 className="text-white mb-3">Notre Mission</h3>
            <p className="text-red-100 text-sm leading-relaxed">
              Promouvoir le développement humain durable en
              renforçant les capacités des communautés
              vulnérables à travers des projets innovants,
              participatifs et pérennes en éducation, santé, eau
              et autonomisation.
            </p>
          </div>
          <div className="bg-[#820002] rounded-2xl p-8 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Eye size={22} />
            </div>
            <h3 className="text-white mb-3">Notre Vision</h3>
            <p className="text-red-100 text-sm leading-relaxed">
              Un monde où chaque individu, quels que soient sa
              situation géographique et son statut social,
              bénéficie d'un accès équitable à l'éducation, à la
              santé, à l'eau potable et aux opportunités
              économiques.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="valeurs" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Nos valeurs
            </span>
            <h2 className="text-gray-800 mt-2">
              Ce qui guide chacune de nos actions
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow text-center"
              >
                <div
                  className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white"
                  style={{ backgroundColor: v.color }}
                >
                  {v.icon}
                </div>
                <h4 className="text-gray-800 mb-2">
                  {v.title}
                </h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Nos missions
            </span>
            <h2 className="text-gray-800 mt-2">
              Comment nous servons les ONG humanitaires
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#820002] mb-4">
                  {m.icon}
                </div>
                <h4 className="text-gray-800 mb-2 font-semibold">
                  {m.title}
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programmes */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Nos programmes
            </span>
            <h2 className="text-gray-800 mt-2">
              Des services spécialisés pour chaque besoin
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {programmes.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl p-8 text-white"
                style={{ backgroundColor: p.color }}
              >
                <h3 className="text-white mb-3 font-semibold">
                  {p.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Notre parcours
            </span>
            <h2 className="text-gray-800 mt-2">
              Jalons historiques
            </h2>
          </div>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-[#820002] rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                  {m.year}
                </div>
                <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[#820002] text-sm font-semibold uppercase tracking-wider">
              Notre équipe
            </span>
            <h2 className="text-gray-800 mt-2">
              Les visages derrière notre mission
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {team.map((m, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold"
                  style={{ backgroundColor: m.color }}
                >
                  {m.initials}
                </div>
                <div className="text-gray-800 text-sm font-semibold leading-tight">
                  {m.name}
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  {m.role}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-[#820002]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-white mb-3">
            Rejoignez notre mission
          </h2>
          <p className="text-red-100 text-sm mb-6">
            Bénévole, donateur ou partenaire institutionnel — il
            y a une place pour vous dans notre action.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#820002] font-semibold px-6 py-3 rounded-xl hover:bg-red-50 transition-colors"
          >
            Nous contacter <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}