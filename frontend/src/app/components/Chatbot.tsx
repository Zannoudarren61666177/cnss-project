import { X, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ChatbotIcon } from './ChatbotIcon';
import { askChatbot } from '../api';
import { PRESTATIONS } from '../data/prestations';
import { ACTUALITES } from '../data/actualites';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
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
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100%-2rem)] sm:w-96 bg-white rounded-md shadow-lg border border-gray-200 flex flex-col z-50 max-h-[600px]">
          <div className="bg-white p-4 border-b border-sky-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-50 rounded-sm flex items-center justify-center overflow-hidden border border-sky-100">
                <ChatbotIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Assistant CNSS</h3>
                <p className="text-xs text-sky-600">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-sm transition-all duration-200 text-gray-500 hover:bg-gray-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={listRef}>
            <div className="space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`${m.from === 'user' ? 'bg-sky-600 text-white' : 'bg-gray-100 text-gray-900'} p-3 rounded-md max-w-[80%] whitespace-pre-wrap`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-600 p-3 rounded-md">...</div>
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500 px-1">Suggestions :</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => { setMessage(suggestion); submit(suggestion); }}
                  className="inline-block w-full text-left text-sm bg-white border border-gray-100 hover:bg-sky-50 text-sky-600 rounded-sm p-2 transition-colors duration-150"
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
                className="flex-1 px-4 py-2 border border-gray-200 rounded-sm focus:ring-2 focus:ring-sky-200 focus:border-transparent text-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && message.trim()) {
                    submit(message);
                  }
                }}
              />
              <button
                className="px-4 py-2 bg-sky-600 text-white rounded-sm hover:bg-sky-700 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-white text-sky-600 rounded-sm shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95 duration-200 z-50 border border-sky-100"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <ChatbotIcon className="w-8 h-8" />
        )}
      </button>
    </>
  );
}
