import { MessageCircle, X, Send } from 'lucide-react';
import { useState } from 'react';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const suggestions = [
    'Comment créer mon compte ?',
    'Comment payer mes cotisations ?',
    'Où trouver mon attestation ?',
    'Comment contacter le support ?'
  ];

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 max-h-[600px]">
          <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant CNSS</h3>
                <p className="text-xs text-blue-100">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 hover:scale-110 active:scale-95 p-1 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <p className="text-sm text-gray-800">
                Bonjour ! 👋 Je suis votre assistant virtuel CNSS. Comment puis-je vous aider aujourd'hui ?
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500 px-1">Suggestions :</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(suggestion)}
                  className="block w-full text-left text-sm bg-blue-50 hover:bg-blue-100 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 text-blue-600 rounded-lg p-2 transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    console.log('Message:', message);
                    setMessage('');
                  }
                }}
              />
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 duration-200 z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </>
  );
}
