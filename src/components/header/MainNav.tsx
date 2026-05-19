import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";
import { navLinks } from "../../config/navigation";
import image_edd716050066d1607cf7d0a1bc78e0a8890bc95b from "../../../assets/edd716050066d1607cf7d0a1bc78e0a8890bc95b.png";

interface MainNavProps {
  scrolled: boolean;
}

export function MainNav({ scrolled }: MainNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={image_edd716050066d1607cf7d0a1bc78e0a8890bc95b}
            alt="Humanitarian Legal Advisor Logo"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-red-50 text-[#820002] font-semibold"
                    : "text-gray-600 hover:text-[#820002] hover:bg-red-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/donations"
            className="flex items-center gap-2 bg-[#820002] hover:bg-[#660103] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Heart size={14} fill="white" />
            Faire un don
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm ${
                  isActive
                    ? "bg-red-50 text-[#820002] font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/donations"
            className="flex items-center justify-center gap-2 bg-[#820002] hover:bg-[#660103] text-white px-4 py-2.5 rounded-xl text-sm font-semibold mt-3"
          >
            <Heart size={14} fill="white" />
            Faire un don
          </Link>
        </div>
      )}
    </header>
  );
}
