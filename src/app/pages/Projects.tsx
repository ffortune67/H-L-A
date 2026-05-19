import { Link } from "react-router-dom";

export function Projects() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Projets désactivés</h1>
        <p className="text-gray-600 text-sm mb-8">La page projets n'est plus active. Pour le moment, seules les informations financières de don sont affichées sur la page de dons.</p>
        <Link to="/donations" className="inline-flex items-center justify-center gap-2 bg-red-800 hover:bg-red-900 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors">
          Retour à la page de dons
        </Link>
      </div>
    </div>
  );
}
