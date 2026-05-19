import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Scale, ShieldCheck, GraduationCap, FileCheck, ArrowRight, Briefcase } from "lucide-react";

const heroImg = "/about-hero.jpeg";

const team = [
  { name: "Maître ALEX MURHI", role: "Directeur Général du Département", initials: "AM", color: "#16a34a" },
  { name: "Maître YVES KAJANGU YENGA", role: "Fondateur Associé", initials: "YK", color: "#0284c7" },
  { name: "Maître JOSEPH BREHAM", role: "Directeur de la Recherche Juridique", initials: "JB", color: "#d97706" },
  { name: "Maître FARADJA SAKANO", role: "Directrice des Opérations", initials: "FS", color: "#db2777" },
  { name: "Maître DINA KAFARHIRA", role: "Consultante", initials: "DK", color: "#7c3aed" },
  { name: "FORTUNE MIAGUE", role: "Consultant IT", initials: "FM", color: "#dc2626" },
];

const milestones = [
  { year: "2010", event: "Fondation à Kinshasa pour l'accompagnement légal des organisations." },
  { year: "2012", event: "Lancement du réseau d'Avocats Humanitaires pour la défense devant les tribunaux." },
  { year: "2015", event: "Déploiement du volet Accès Humanitaire auprès des administrations publiques." },
  { year: "2021", event: "Intégration du volet MCHAW pour la gestion de la couverture médicale des équipes." },
  { year: "2024", event: "Cap des 150+ institutions et ONG partenaires accompagnées sur le territoire national." },
];

// Fusion stricte des anciennes "missions" et "programmes" pour éviter les doublons
const coreProgrammes = [
  {
    icon: <Scale size={20} />,
    title: "Avocats Humanitaires",
    desc: "Assistance, plaidoiries et représentation légale stratégique devant les cours et tribunaux de la RDC pour les organisations et leurs partenaires.",
    color: "#820002",
  },
  {
    icon: <FileCheck size={20} />,
    title: "OraLabora (Solutions RH)",
    desc: "Externalisation globale de la paie, gestion des contrats de travail, conformité sociale et intermédiation lors des contrôles de l'Inspection du Travail.",
    color: "#0284c7",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Accès & Relations Institutionnelles",
    desc: "Sécurisation administrative complète : obtention des visas d'établissement, agréments, gestion des exonérations fiscales et facilitation de l'accès terrain.",
    color: "#16a34a",
  },
  {
    icon: <GraduationCap size={20} />,
    title: "MCHAW & Renforcement des Capacités",
    desc: "Structuration de la couverture médicale du personnel (Medical Care for Humanitarian Aid Workers) et formations certifiantes en gouvernance légale.",
    color: "#d97706",
  },
];

const aboutSections = [
  { id: "profil", label: "Profil Institutionnel" },
  { id: "programmes", label: "Programmes & Expertises" },
  { id: "historique", label: "Historique & Équipe" },
];

export function About() {
  const [activeSection, setActiveSection] = useState("profil");

  useEffect(() => {
    const handleScroll = () => {
      let currentSection = aboutSections[0].id;
      const offset = window.innerHeight * 0.3;

      aboutSections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= offset && rect.bottom >= offset) {
            currentSection = section.id;
          }
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Hero */}
      <section className="relative h-60 flex items-center overflow-hidden">
        <img src={heroImg} alt="À propos" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/85" />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="flex items-center gap-2 mb-2 text-blue-400 text-xs font-semibold uppercase tracking-wider">
            <Briefcase size={14} /> Cadre opérationnel
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">À Propos de HLA</h1>
          <p className="text-slate-300 text-sm mt-1">Cabinet-conseil en ingénierie juridique humanitaire et conformité réglementaire en RDC.</p>
        </div>
      </section>

      {/* Sticky Menu */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-8 text-sm font-medium">
          {aboutSections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`pb-1 border-b-2 transition-all ${
                activeSection === section.id ? "border-slate-900 text-slate-900 font-bold" : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid lg:grid-cols-3 gap-12">
        
        {/* Left/Center Content */}
        <div className="lg:col-span-2 space-y-16">
          
          {/* Section 1: Profil */}
          <section id="profil" className="scroll-mt-24 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Profil Institutionnel</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>Humanitarian Legal Advisor (HLA)</strong> est un établissement d'utilité publique opérant en République Démocratique du Congo (conformément à la Loi n° 004/2001). 
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Inspiré de l'expertise historique du <em>Cabinet KAJANGU & Associés (1984)</em>, HLA apporte des solutions juridiques et d'ingénierie documentaire de pointe. Notre mission exclusive est de réduire les risques légaux, fiscaux, sociaux et administratifs rencontrés par les ONG locales et internationales dans l'exercice de leurs fonctions.
            </p>
          </section>

          {/* Section 2: Programmes & Expertises (ZÉRO DOUBLONS) */}
          <section id="programmes" className="scroll-mt-24 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Programmes Métiers & Expertises</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {coreProgrammes.map((prog, index) => (
                <div key={index} className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:shadow-md">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                      <span style={{ color: prog.color }}>{prog.icon}</span>
                      {prog.title}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{prog.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Historique & Équipe */}
          <section id="historique" className="scroll-mt-24 space-y-10">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Chronologie Institutionnelle</h2>
              <div className="relative border-l border-slate-300 ml-2 pl-4 space-y-5">
                {milestones.map((m, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2 h-2 rounded-full bg-slate-900 border border-white" />
                    <span className="text-xs font-bold text-slate-400 font-mono">{m.year}</span>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{m.event}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 border-b pb-2">Direction du Département & Consultants</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {team.map((member, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/60 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner" style={{ backgroundColor: member.color }}>
                      {member.initials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight">{member.name}</h4>
                      <span className="text-[11px] text-slate-400 block font-medium mt-0.5">{member.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-md font-bold mb-2 tracking-tight">Sécurisation légale</h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Garantissez la conformité de vos interventions en RDC. Nos juristes effectuent vos diagnostics fiduciaires, contractuels et sectoriels.
            </p>
            <Link to="/donations" className="inline-flex items-center gap-2 bg-white text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors w-full justify-center">
              Allouer une dotation budgétaire <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl text-center">
            <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Statut légal</span>
            <span className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Utilité Publique (Loi 004/2001)
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
