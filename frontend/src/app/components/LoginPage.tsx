import { LogIn, CreditCard, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { CNSSLogo } from './CNSSLogo';

export function LoginPage() {
  const navigate = useNavigate();
  const [numeroImmatriculation, setNumeroImmatriculation] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { numeroImmatriculation, password });

    // Déterminer le type d'utilisateur en fonction du numéro d'immatriculation
    if (numeroImmatriculation.startsWith('AGT-')) {
      // Agents : AGT-IMMAT, AGT-EMP, AGT-COT, AGT-PREST, AGT-SUP, AGT-ADMIN
      if (numeroImmatriculation.includes('IMMAT')) {
        navigate('/agent/immatriculation');
      } else if (numeroImmatriculation.includes('EMP')) {
        navigate('/agent/employeur');
      } else if (numeroImmatriculation.includes('COT')) {
        navigate('/agent/cotisation');
      } else if (numeroImmatriculation.includes('PREST')) {
        navigate('/agent/prestations');
      } else if (numeroImmatriculation.includes('SUP')) {
        navigate('/agent/support');
      } else if (numeroImmatriculation.includes('ADMIN')) {
        navigate('/admin');
      }
    } else if (numeroImmatriculation.startsWith('BJ-EMP-')) {
      // Employeurs : BJ-EMP-XXXXXXXX-XXX
      navigate('/employeur/tableau-de-bord');
    } else if (numeroImmatriculation.startsWith('BJ-') && numeroImmatriculation.includes('-T')) {
      // Travailleurs : BJ-XXXX-XXXXX-T
      navigate('/travailleur/tableau-de-bord');
    } else {
      alert('Numéro d\'immatriculation non reconnu');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-500 hover:gap-3 mb-8 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center mb-8">
            <CNSSLogo size="large" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Connexion
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Accédez à votre espace personnel
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro d'immatriculation CNSS
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={numeroImmatriculation}
                  onChange={(e) => setNumeroImmatriculation(e.target.value)}
                  placeholder="BJ-EMP-20260503-0010"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Exemples : BJ-EMP-... (Employeur), BJ-...-T (Travailleur), AGT-... (Agent)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:scale-110 active:scale-95 transition-all duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500" />
                <span className="text-gray-600">Se souvenir de moi</span>
              </label>
              <Link to="/mot-de-passe-oublie" className="text-blue-500 hover:text-blue-600 font-medium">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-95 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Se connecter
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-3">
            <div>
              <p className="text-gray-600 text-sm mb-2">
                Vous avez votre numéro d'immatriculation CNSS ?
              </p>
              <Link
                to="/creer-compte"
                className="inline-block w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-md hover:scale-105 active:scale-95 font-semibold transition-all duration-200"
              >
                Créer mon compte
              </Link>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">
                Première fois à la CNSS ?
              </p>
              <Link
                to="/inscription"
                className="inline-block w-full py-3 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 hover:shadow-md hover:scale-105 active:scale-95 font-semibold transition-all duration-200"
              >
                Demander mon adhésion
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          En vous connectant, vous acceptez nos{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            conditions d'utilisation
          </a>
          {' '}et notre{' '}
          <a href="#" className="text-blue-500 hover:text-blue-600">
            politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
}