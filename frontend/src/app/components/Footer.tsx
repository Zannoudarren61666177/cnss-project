import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { CNSSLogo } from './CNSSLogo';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CNSSLogo size="small" />
              <span className="font-bold text-white">CNSS Bénin</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Caisse Nationale de Sécurité Sociale du Bénin - Votre protection sociale, notre engagement.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-500 hover:scale-110 active:scale-95 rounded-lg flex items-center justify-center transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-500 hover:scale-110 active:scale-95 rounded-lg flex items-center justify-center transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-blue-500 hover:scale-110 active:scale-95 rounded-lg flex items-center justify-center transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Immatriculation</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Déclarations</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Cotisations</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Prestations</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Documents</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Informations</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">À propos</a></li>
              <li><a href="#actualites" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Actualités</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Ressources</a></li>
              <li><a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">FAQ</a></li>
              <li><a href="#agences" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-all duration-200">Agences</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-400" />
                <span>Avenue Clozel, face à la RTB, Cotonou, Bénin</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>+229 21 31 30 09</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-blue-400" />
                <span>info@cnss.bj</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © 2026 CNSS Bénin. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-blue-400 hover:underline transition-all duration-200">Mentions légales</a>
            <a href="#" className="hover:text-blue-400 hover:underline transition-all duration-200">Politique de confidentialité</a>
            <a href="#" className="hover:text-blue-400 hover:underline transition-all duration-200">Conditions d'utilisation</a>
          </div>
        </div>
      </div>
    </footer>
  );
}