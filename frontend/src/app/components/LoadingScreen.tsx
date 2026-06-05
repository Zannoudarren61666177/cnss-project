import { CNSSLogo } from './CNSSLogo';

interface LoadingScreenProps {
  isVisible: boolean;
}

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-center">
        <div className="mb-8 animate-bounce">
          <CNSSLogo size="large" />
        </div>
        <div className="flex gap-2 justify-center mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-300"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Chargement...</p>
        <p className="text-gray-500 text-sm mt-2">Caisse Nationale de Sécurité Sociale</p>
      </div>
    </div>
  );
}
