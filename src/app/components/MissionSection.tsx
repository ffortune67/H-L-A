import { ArrowRight } from "lucide-react";

export default function MissionSection() {
  const missions = [
    "Assistance juridique sur mesure pour les ONG et leurs partenaires",
    "Conseil et médiation en accès humanitaire et relations institutionnelles",
    "Formation et renforcement des capacités en gestion légale",
    "Évaluation des projets humanitaires",
    "Recherches et enquêtes juridiques",
    "Production de manuels et politiques internes",
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-[#820002] mb-8">Missions</h2>

        <ul className="space-y-5">
          {missions.map((mission, index) => (
            <li key={index} className="flex items-start gap-4 group">
              <div className="bg-primary p-2 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                <ArrowRight className="text-white w-4 h-4" />
              </div>
              <p className="text-gray-700 leading-relaxed">{mission}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
