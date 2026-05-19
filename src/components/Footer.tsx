import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { navLinks } from "../config/navigation";
import image_edd716050066d1607cf7d0a1bc78e0a8890bc95b from "../assets/edd716050066d1607cf7d0a1bc78e0a8890bc95b.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <img
            src={image_edd716050066d1607cf7d0a1bc78e0a8890bc95b}
            alt="Humanitarian Legal Advisor Logo"
            className="h-12 w-auto mb-4"
          />
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Organisation non gouvernementale spécialisée en
            expertise juridique humanitaire, administrative et
            patrimoniale en faveur des ONG en République
            Démocratique du Congo.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#820002] flex items-center justify-center transition-colors"
              >
                <Icon
                  size={14}
                  className="text-gray-400 hover:text-white"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white mb-4">Liens rapides</h4>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-gray-400 hover:text-[#820002] transition-colors"
                >
                  → {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-gray-400">
              <MapPin
                size={14}
                className="text-[#820002] mt-1 flex-shrink-0"
              />

              <div className="flex flex-col gap-1">
                <p className="font-semibold text-white">
                  Coordination de l'Ouest :
                </p>
                <p>
                  63, Av. Col Mondjiba, Basoko, Ngaliema -
                  Kinshasa, RDC
                </p>

                <p className="font-semibold text-white mt-2">
                  Coordination de l'Est :
                </p>
                <p>
                  62, Av. Lynn Lusi, Les Volcans, Goma /
                  Nord-Kivu, RDC
                </p>
              </div>
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <Phone
                size={14}
                className="text-[#820002] flex-shrink-0"
              />
              +243 (0) 972 339 318
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-400">
              <Mail
                size={14}
                className="text-[#820002] flex-shrink-0"
              />
              info.center@h-l-a.org
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white mb-4">Newsletter</h4>
          <p className="text-sm text-gray-400 mb-3">
            Recevez nos actualités et rapports directement
            dans votre boîte mail.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="bg-gray-800 border border-gray-700 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#820002] placeholder:text-gray-500"
            />
            <button
              type="submit"
              className="bg-[#820002] hover:bg-[#660103] text-white text-sm rounded-lg py-2 font-semibold transition-colors"
            >
              S'abonner
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <span>
            © 2026 Humanitarian Legal Advisor. Tous droits
            réservés.
          </span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">
              Politique de confidentialité
            </a>
            <a href="#" className="hover:text-gray-300">
              Mentions légales
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
