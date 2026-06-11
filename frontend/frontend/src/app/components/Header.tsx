import { Search, Menu, X, LogIn, Phone, Mail, ChevronDown, User, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { CNSSLogo } from './CNSSLogo';
import { SearchModal } from './SearchModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEServicesOpen, setIsEServicesOpen] = useState(false);

  return (
    <header className="bg-white border-b-4 border-blue-600 sticky top-0 z-50 shadow-md">
      {/* Bande d'information supérieure */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+22921313009" className="flex items-center gap-2 hover:text-blue-100 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">+229 21 31 30 09</span>
              </a>
              <a href="mailto:contact@cnss.bj" className="flex items-center gap-2 hover:text-blue-100 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden sm:inline">contact@cnss.bj</span>
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
            <Link to="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">Accueil</Link>
            <Link to="/presentations" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">Présentation</Link>
            <a href="/#prestations" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">Prestations</a>
            <a href="/#agences" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">Agences</a>
            <a href="/#actualites" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">Actualités</a>
            <a href="/#contact" className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors font-medium">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Bouton de recherche */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* E-services dropdown */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsEServicesOpen(!isEServicesOpen)}
                onBlur={() => setTimeout(() => setIsEServicesOpen(false), 200)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors font-semibold shadow-sm whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                E-services
                <ChevronDown className={`w-4 h-4 transition-transform ${isEServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isEServicesOpen && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <p className="text-white font-bold text-lg">Services en ligne CNSS</p>
                    <p className="text-blue-100 text-sm">Accédez à votre espace personnel</p>
                  </div>

                  <div className="p-2">
                    <Link
                      to="/connexion"
                      className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all group mb-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Briefcase className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">Espace Employeur</p>
                          <p className="text-xs text-gray-600">Déclarez vos travailleurs, payez vos cotisations</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/connexion"
                      className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 transition-all group mb-2"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <User className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">Espace Travailleur</p>
                          <p className="text-xs text-gray-600">Consultez vos droits et prestations</p>
                        </div>
                      </div>
                    </Link>

                    <Link
                      to="/connexion"
                      className="block p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-purple-100 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Users className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-1">Espace Agent</p>
                          <p className="text-xs text-gray-600">Accès réservé aux agents CNSS</p>
                        </div>
                      </div>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <Link
                      to="/inscription"
                      className="block w-full py-3 bg-blue-600 text-white text-center rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Créer un compte
                    </Link>
                    <p className="text-xs text-gray-500 text-center mt-2">Première visite ? Inscrivez-vous gratuitement</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden pb-4 space-y-1 animate-in slide-in-from-top-2">
            <Link to="/" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Accueil</Link>
            <Link to="/presentations" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Présentation</Link>
            <a href="/#prestations" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Prestations</a>
            <a href="/#agences" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Agences</a>
            <a href="/#actualites" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Actualités</a>
            <a href="/#contact" className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg font-medium transition-colors">Contact</a>
            <div className="pt-3 mt-3 border-t border-gray-200 space-y-2">
              <p className="px-4 text-sm font-semibold text-gray-600 mb-2">E-services - Vous êtes :</p>
              <Link to="/connexion" className="w-full px-4 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-3 font-semibold transition-colors">
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
              <Link to="/inscription" className="w-full px-4 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors mt-2">
                Créer un compte
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