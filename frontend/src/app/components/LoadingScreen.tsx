import { CNSSLogo } from './CNSSLogo';

interface LoadingScreenProps {
  isVisible: boolean;
}

export function LoadingScreen({ isVisible }: LoadingScreenProps) {
  return (
    <div
      className={`fixed inset-0 bg-white flex items-center justify-center z-[9999] transition-opacity duration-500 ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="text-center">
        <div className="mb-8 animate-bounce flex justify-center">
          <CNSSLogo size="large" />
        </div>
        <div className="flex gap-2 justify-center mb-6">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Chargement...</p>
        <p className="text-gray-500 text-sm mt-2">Caisse Nationale de Sécurité Sociale</p>
      </div>
    </div>
  );
}
