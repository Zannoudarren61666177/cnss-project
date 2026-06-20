import { Building2, UserCheck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { CNSSLogo } from './CNSSLogo';

export function EServicesPage() {
  const roles = [
    {
      icon: Building2,
      label: 'Employeur',
      description: 'Déclarez vos travailleurs, gérez vos cotisations et accédez à vos documents',
      color: '#4A90E2',
      lightBg: '#EBF4FF',
      badge: 'Espace Entreprise',
    },
    {
      icon: UserCheck,
      label: 'Travailleur',
      description: 'Consultez vos droits, suivez vos prestations et téléchargez vos attestations',
      color: '#4A90E2',
      lightBg: '#EBF4FF',
      badge: 'Espace Personnel',
    },
    {
      icon: ShieldCheck,
      label: 'Agent CNSS',
      description: 'Accès réservé aux agents et administrateurs de la CNSS Bénin',
      color: '#4A90E2',
      lightBg: '#EBF4FF',
      badge: 'Accès Interne',
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-sky-100/40 blur-3xl" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-50/60 blur-3xl" />
      </div>

      {/* Back link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4A90E2] transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>
      </div>

      {/* Logo */}
      <div className="mb-12 relative z-10">
        <CNSSLogo size="large" />
      </div>

      {/* Heading */}
      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Qui êtes-vous ?
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Sélectionnez votre profil pour accéder à votre espace personnalisé
        </p>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl relative z-10">
        {roles.map(({ icon: Icon, label, description, color, lightBg, badge }) => (
          <Link
            key={label}
            to="/connexion"
            className="group relative flex flex-col items-center text-center p-10 rounded-3xl border-2 border-gray-200 bg-white cursor-pointer transition-all duration-300 hover:border-[#4A90E2] hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2"
          >
            {/* Badge */}
            <span className="absolute top-5 right-5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-[#4A90E2] border border-sky-200">
              {badge}
            </span>

            {/* Icon circle */}
            <div 
              className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg"
              style={{ backgroundColor: lightBg }}
            >
              <Icon className="w-12 h-12" style={{ color }} />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">{label}</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">{description}</p>

            {/* Arrow indicator */}
            <div className="mt-auto w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center group-hover:border-[#4A90E2] group-hover:bg-sky-50 transition-all duration-300">
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-[#4A90E2] transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-16 text-gray-400 text-sm text-center relative z-10">
        © {new Date().getFullYear()} CNSS Bénin — Caisse Nationale de Sécurité Sociale · Fraternité, Justice, Travail
      </p>
    </div>
  );
}