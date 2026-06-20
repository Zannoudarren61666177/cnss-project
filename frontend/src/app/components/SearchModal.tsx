import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { CNSSLogoAnimated } from './CNSSLogoAnimated';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const submitSearch = (q: string) => {
    setLoading(true);
    // simulate async search then navigate to results page
    setTimeout(() => {
      setLoading(false);
      onClose();
      window.location.href = `/search?query=${encodeURIComponent(q)}`;
    }, 800);
  };

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
        className="relative w-full max-w-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-6 animate-in slide-in-from-top-4 duration-400">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recherche intelligente</h2>
              <p className="text-sm text-gray-600">Posez votre question, je vous aide</p>
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(searchQuery); }}
              placeholder="Comment créer mon compte employeur ? Quels sont mes droits à la retraite ?"
              className="w-full pl-14 pr-4 py-3 text-md border border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-200 focus:border-sky-400 transition-all"
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
                onClick={() => { setSearchQuery(suggestion); submitSearch(suggestion); }}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-sky-50 hover:text-sky-600 rounded-xl transition-all text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Notre moteur de recherche intelligent comprend vos questions en langage naturel
            </p>
          </div>
        </div>

        {/* Loading overlay with animated CNSS logo */}
        {loading && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl">
            <div className="flex flex-col items-center gap-4">
              <div>
                <CNSSLogoAnimated size={64} />
              </div>
              <div className="text-gray-600 font-medium">Recherche en cours...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
