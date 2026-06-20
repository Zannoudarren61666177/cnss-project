import { useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ nom: '', email: '', telephone: '', sujet: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <PublicLayout>
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0d1f38] to-[#1a3a6e] pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4A90E2] mb-3">CNSS Bénin</p>
          <h1 className="text-5xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Nous contacter
          </h1>
          <div className="w-12 h-0.5 bg-[#4A90E2] mx-auto mb-6" />
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Infos de contact */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0d1f38] rounded-3xl p-8 text-white">
                <h2 className="text-xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>Coordonnées</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-[#4A90E2]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Siège social</p>
                      <p className="text-white/60 text-sm mt-0.5 leading-relaxed">Boulevard Saint-Michel, Cotonou<br />République du Bénin</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-[#4A90E2]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Téléphone</p>
                      <a href="tel:+22990190000" className="text-white/60 text-sm hover:text-white transition-colors">(+229) 90 19 00 00</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-[#4A90E2]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Email</p>
                      <a href="mailto:info@cnss.bj" className="text-white/60 text-sm hover:text-white transition-colors">info@cnss.bj</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-[#4A90E2]/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-[#4A90E2]" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Horaires</p>
                      <p className="text-white/60 text-sm mt-0.5">Lun – Ven : 8h00 – 17h30<br />Sam – Dim : Fermé</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Délais de réponse</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { type: 'Questions générales', delai: '24 à 48h' },
                    { type: 'Dossiers de prestations', delai: '5 jours ouvrables' },
                    { type: 'Réclamations', delai: '15 jours ouvrables' },
                  ].map((d, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                      <span className="text-gray-600">{d.type}</span>
                      <span className="font-semibold text-[#4A90E2]">{d.delai}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Message envoyé</h3>
                    <p className="text-gray-500 text-sm max-w-sm">Votre message a bien été transmis. Nous vous répondrons dans les meilleurs délais.</p>
                    <button onClick={() => { setSent(false); setForm({ nom: '', email: '', telephone: '', sujet: '', message: '' }); }}
                      className="mt-6 px-6 py-2.5 bg-[#4A90E2] text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors">
                      Envoyer un autre message
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                      Envoyer un message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet <span className="text-red-500">*</span></label>
                          <input type="text" name="nom" value={form.nom} onChange={handleChange} required
                            placeholder="Votre nom et prénom"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                          <input type="email" name="email" value={form.email} onChange={handleChange} required
                            placeholder="votre@email.com"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
                        <input type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                          placeholder="+229 XX XX XX XX"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Objet <span className="text-red-500">*</span></label>
                        <select name="sujet" value={form.sujet} onChange={handleChange} required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none bg-white">
                          <option value="">Sélectionnez un objet</option>
                          <option value="immatriculation">Immatriculation</option>
                          <option value="cotisations">Cotisations</option>
                          <option value="prestations">Prestations</option>
                          <option value="retraite">Retraite</option>
                          <option value="reclamation">Réclamation</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                        <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                          placeholder="Décrivez votre demande en détail..."
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent outline-none resize-none" />
                      </div>
                      <button type="submit"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-[#4A90E2] text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                        <Send className="w-4 h-4" /> Envoyer le message
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PublicLayout>
  );
}
