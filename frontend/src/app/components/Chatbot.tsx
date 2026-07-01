import { X, Send, Maximize2, Minimize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ChatbotIcon } from './ChatbotIcon';
import { CNSSLogo } from './CNSSLogo';
import { askChatbot } from '../api';
import { PRESTATIONS } from '../data/prestations';
import { ACTUALITES } from '../data/actualites';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'bot'; text: string }>>([
    { from: 'bot', text: "Bonjour ! Je suis votre assistant virtuel CNSS. Comment puis-je vous aider aujourd'hui ?" },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  const suggestions = [
    'Comment créer mon compte ?',
    'Comment payer mes cotisations ?',
    'Où trouver mon attestation ?',
    'Comment contacter le support ?'
  ];

  useEffect(() => {
    // scroll to bottom when messages change
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const submit = async (text: string) => {
    if (!text.trim()) return;
    const userText = text.trim();
    setMessages((m) => [...m, { from: 'user', text: userText }]);
    setMessage('');
    setLoading(true);

    try {
      const res = await askChatbot(userText);
      if (res && res.reponse) {
        setMessages((m) => [...m, { from: 'bot', text: res.reponse }]);
      } else {
        throw new Error('No response');
      }
    } catch (err) {
      // fallback: simple local search across prestations and actualites
      const q = userText.toLowerCase();
      const p = PRESTATIONS.filter((x) => [x.titre, x.description, x.contenu].join(' ').toLowerCase().includes(q));
      const a = ACTUALITES.filter((x) => [x.titre, x.extrait, x.description, x.contenu].join(' ').toLowerCase().includes(q));
      let reply = '';
      if (p.length || a.length) {
        reply += 'J’ai trouvé ces ressources qui pourraient vous aider:\n';
        p.slice(0,5).forEach((item) => { reply += `- Prestation: ${item.titre}\n`; });
        a.slice(0,5).forEach((item) => { reply += `- Actualité: ${item.titre}\n`; });
        reply += '\nVous pouvez consulter les résultats complets via la recherche.';
      } else {
        reply = "Désolé, je n'ai pas trouvé d'information précise. Veuillez reformuler votre question ou contacter le support.";
      }
      setMessages((m) => [...m, { from: 'bot', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className={`fixed bottom-24 right-4 sm:right-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl shadow-2xl border border-blue-200 flex flex-col z-50 transition-all duration-300 max-w-[calc(100%-2rem)] max-h-[calc(100vh-8rem)] ${
          isExpanded 
            ? 'w-[calc(100%-2rem)] sm:w-[90vw] md:w-[85vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw] h-[calc(100vh-8rem)]' 
            : 'w-[calc(100%-2rem)] sm:w-[420px] md:w-[480px] h-[500px] sm:h-[550px]'
        }`}>
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 border-b border-blue-400 flex justify-between items-center rounded-t-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden border-2 border-white/30 shadow-lg">
                <CNSSLogo size="small" className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Assistant CNSS</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  En ligne - IA activée
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg transition-all duration-200 text-white/80 hover:bg-white/20 hover:text-white"
                title={isExpanded ? "Réduire" : "Agrandir"}
              >
                {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg transition-all duration-200 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white/50 backdrop-blur-sm" ref={listRef}>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.from === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200' 
                    : 'bg-white text-gray-800 shadow-md border border-gray-100'} 
                    p-4 rounded-2xl max-w-[85%] whitespace-pre-wrap text-sm leading-relaxed`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-600 p-4 rounded-2xl shadow-md border border-gray-100 flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500 px-1 font-medium">Suggestions :</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => { setMessage(suggestion); submit(suggestion); }}
                  className="inline-block w-full text-left text-sm bg-white/80 backdrop-blur-sm border border-blue-100 hover:bg-blue-50 hover:border-blue-200 text-blue-700 rounded-xl p-3 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-blue-100 bg-white/80 backdrop-blur-sm rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-blue-400 text-sm bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    submit(message);
                  }
                }}
              />
              <button
                onClick={() => submit(message)}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
                disabled={!message.trim() || loading}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-xl shadow-blue-300 flex items-center justify-center transition-all hover:scale-110 active:scale-95 duration-300 z-50 border-2 border-white/30 hover:border-white/50"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <ChatbotIcon className="w-8 h-8" />
        )}
      </button>
    </>
  );
}
