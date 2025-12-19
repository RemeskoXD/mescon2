import React from 'react';
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

interface FooterProps {
    onVerifyClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onVerifyClick }) => {
  return (
    <footer className="bg-[#05080f] text-white border-t border-gray-900" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="font-bold text-2xl tracking-tight">MESCON<span className="text-blue-500">ACADEMY</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Vaše cesta k online úspěchu začíná zde. Budujeme komunitu, která mění pravidla hry v online podnikání.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition"><Linkedin size={18} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Rychlé odkazy</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-500 text-sm transition flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Domů</a></li>
              <li><a href="#mission" className="text-gray-400 hover:text-blue-500 text-sm transition flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> O nás</a></li>
              <li><a href="#programs" className="text-gray-400 hover:text-blue-500 text-sm transition flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Kurzy</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-blue-500 text-sm transition flex items-center gap-2"><span className="w-1 h-1 bg-blue-500 rounded-full"></span> Ceník</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Podpora</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-blue-500 text-sm transition">Obchodní podmínky</a></li>
              <li><a href="#" className="text-gray-400 hover:text-blue-500 text-sm transition">Ochrana osobních údajů</a></li>
              {onVerifyClick && (
                  <li>
                      <button onClick={onVerifyClick} className="text-gray-400 hover:text-green-500 text-sm transition flex items-center gap-2">
                          <ShieldCheck size={14}/> Ověřit certifikát
                      </button>
                  </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-white">Kontaktujte nás</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">Praha, Česká republika</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+420 777 888 999</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@mesconacademy.clone</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-900 mt-16 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Mescon Academy Clone. Všechna práva vyhrazena.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;