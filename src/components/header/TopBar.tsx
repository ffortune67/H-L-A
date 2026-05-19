import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function TopBar() {
  return (
    <div className="text-white text-xs py-2 hidden md:block bg-[#820002]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Mail size={12} /> infocenter@hla.org
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={12} /> +243 (0) 972 339 318
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={12} /> Kinshasa, RDC
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="hover:text-red-300 transition-colors"
          >
            <Facebook size={13} />
          </a>
          <a
            href="#"
            className="hover:text-red-300 transition-colors"
          >
            <Twitter size={13} />
          </a>
          <a
            href="#"
            className="hover:text-red-300 transition-colors"
          >
            <Instagram size={13} />
          </a>
          <a
            href="#"
            className="hover:text-red-300 transition-colors"
          >
            <Youtube size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
