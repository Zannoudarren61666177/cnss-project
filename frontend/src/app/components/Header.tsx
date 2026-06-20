import { Search, Menu, X, LogIn, Phone, Mail, User, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { CNSSLogo } from './CNSSLogo';
import { SearchModal } from './SearchModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b-4 border-sky-500 sticky top-0 z-50 shadow-md">
      {/* Bande d'information supérieure */}
      <div className="bg-gradient-to-r from-sky-500 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+22990190000" className="flex items-center gap-2 hover:text-sky-100 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">(+229) 90 19 00 00</span>
              </a>
              <a href="mailto:info@cnss.bj" className="flex items-center gap-2 hover:text-sky-100 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">info@cnss.bj</span>
              </a>
            </div>
            <div className="text-xs hidden md:block">
              République du Bénin - Fraternité, Justice, Travail
            </div>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <CNSSLogo size="large" />
            <div className="border-l-2 border-gray-300 pl-4 hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">CNSS BÉNIN</h1>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Caisse Nationale de Sécurité Sociale</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-4 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors font-medium">Accueil</Link>
            <Link to="/presentations" className="px-4 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors font-medium">Présentation</Link>
            <Link to="/prestations" className="px-4 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors font-medium">Prestations</Link>
            <Link to="/agences" className="px-4 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors font-medium">Agences</Link>
            <Link to="/actualites" className="px-4 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors font-medium">Actualités</Link>
            <Link to="/contact" className="px-4 py-2 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors font-medium">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            {/* Bouton de recherche */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-sky-600 hover:bg-sky-50 rounded-md transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Bouton E-services → page de sélection du profil */}
            <Link
              to="/e-services"
              className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-sky-500 text-white hover:bg-sky-600 rounded-md transition-colors font-semibold shadow-sm whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              E-services
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1 animate-in slide-in-from-top-2">
            <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium transition-colors">Accueil</Link>
            <Link to="/presentations" className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium transition-colors">Présentation</Link>
            <Link to="/prestations" className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium transition-colors">Prestations</Link>
            <Link to="/agences" className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium transition-colors">Agences</Link>
            <Link to="/actualites" className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium transition-colors">Actualités</Link>
            <Link to="/contact" className="block px-4 py-3 text-gray-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg font-medium transition-colors">Contact</Link>
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
              <p className="px-4 text-sm font-semibold text-gray-600 mb-2">E-services — Vous êtes :</p>
              <Link to="/connexion" className="w-full px-4 py-3 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg flex items-center gap-3 font-semibold transition-colors">
                <Briefcase className="w-5 h-5" />
                Employeur
              </Link>
              <Link to="/connexion" className="w-full px-4 py-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg flex items-center gap-3 font-semibold transition-colors">
                <User className="w-5 h-5" />
                Travailleur
              </Link>
              <Link to="/connexion" className="w-full px-4 py-3 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg flex items-center gap-3 font-semibold transition-colors">
                <Users className="w-5 h-5" />
                Agent CNSS
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modal de recherche */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
