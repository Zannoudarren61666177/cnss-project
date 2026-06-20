import { useParams, Link } from 'react-router';
import { ArrowLeft, CheckCircle, FileText, Phone } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { PRESTATIONS } from '../data/prestations';

export function PrestationDetailPage() {
  const { id } = useParams();
  const prestation = PRESTATIONS.find(p => p.id === id);

  if (!prestation) {
    return (
      <PublicLayout>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Prestation introuvable.</p>
            <Link to="/prestations" className="text-[#4A90E2] font-semibold hover:underline">Retour aux prestations</Link>
          </div>
        </div>
        <Footer />
      </PublicLayout>
    );
  }

  const currentIndex = PRESTATIONS.findIndex(p => p.id === id);
  const prev = currentIndex > 0 ? PRESTATIONS[currentIndex - 1] : null;
  const next = currentIndex < PRESTATIONS.length - 1 ? PRESTATIONS[currentIndex + 1] : null;

  return (
    <PublicLayout>
      <Header />

      {/* Hero photo */}
      <div className="relative h-80 md:h-[420px] mt-20 overflow-hidden">
        <img src={prestation.photo} alt={prestation.titre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f38] via-[#0d1f38]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 max-w-5xl mx-auto left-0 right-0">
          <Link to="/prestations" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Toutes les prestations
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A90E2] mb-2">{prestation.numero} / 04</span>
          <h1 className="text-4xl md:text-5xl font-black text-white" style={{ fontFamily: 'Georgia, serif' }}>
            {prestation.titre}
          </h1>
          <div className="mt-3 inline-block">
            <span className="text-xs font-semibold text-white bg-[#4A90E2]/80 backdrop-blur-sm rounded-full px-4 py-1.5">
              {prestation.tag}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Texte principal */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                Présentation
              </h2>
              <div className="w-10 h-0.5 bg-[#4A90E2] mb-6" />
              {prestation.contenu.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-600 leading-relaxed mb-4 text-[15px]">{para}</p>
              ))}

              {/* Conditions */}
              <div className="mt-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Conditions d'éligibilité</h3>
                <div className="space-y-3">
                  {prestation.conditions.map((c, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="mt-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Documents requis</h3>
                <div className="space-y-2">
                  {prestation.documents.map((d, i) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100">
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Avantages */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Ce que vous obtenez</h3>
                <div className="space-y-3">
                  {prestation.avantages.map((a, i) => (
                    <div key={i} className="flex justify-between items-start gap-3">
                      <span className="text-sm text-gray-600 flex-1">{a.label}</span>
                      <span className="text-xs font-bold text-[#4A90E2] text-right flex-shrink-0">{a.valeur}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-[#0d1f38] rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-3">Besoin d'information ?</h3>
                <p className="text-white/60 text-sm mb-4">Nos conseillers sont disponibles pour vous accompagner dans vos démarches.</p>
                <a href={`tel:${prestation.contact}`} className="flex items-center gap-2 text-[#4A90E2] font-semibold text-sm hover:underline">
                  <Phone className="w-4 h-4" /> {prestation.contact}
                </a>
                <Link to="/connexion" className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-[#4A90E2] rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors">
                  Accéder à mon espace
                </Link>
              </div>

              {/* Autres prestations */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Autres prestations</h3>
                <div className="space-y-2">
                  {PRESTATIONS.filter(p => p.id !== id).map(p => (
                    <Link key={p.id} to={`/prestations/${p.id}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                      <span className="text-xs font-bold text-[#4A90E2]">{p.numero}</span>
                      <span className="text-sm text-gray-700 group-hover:text-[#4A90E2] transition-colors">{p.titre}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation prev/next */}
          <div className="mt-14 pt-8 border-t border-gray-100 flex justify-between gap-4">
            {prev ? (
              <Link to={`/prestations/${prev.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#4A90E2] transition-colors">
                <ArrowLeft className="w-4 h-4" /> {prev.titre}
              </Link>
            ) : <div />}
            {next && (
              <Link to={`/prestations/${next.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#4A90E2] transition-colors">
                {next.titre} <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </PublicLayout>
  );
}
