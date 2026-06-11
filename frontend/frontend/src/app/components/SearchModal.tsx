import { Search, X, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Backdrop avec effet de flou */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

      {/* Contenu de recherche */}
      <div
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-in slide-in-from-top-4 duration-500">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Recherche Intelligente</h2>
                <p className="text-sm text-gray-600">Posez votre question, je vous aide</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Comment créer mon compte employeur ? Quels sont mes droits à la retraite ?"
              className="w-full pl-14 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              autoFocus
            />
          </div>

          {/* Suggestions */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-600 mb-3">Suggestions populaires :</p>
            {[
              'Comment créer mon compte employeur ?',
              'Quels sont les délais de paiement des cotisations ?',
              'Comment consulter mes droits à la retraite ?',
              'Où trouver mon attestation d\'affiliation ?'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSearchQuery(suggestion)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              💡 Notre moteur de recherche intelligent comprend vos questions en langage naturel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
