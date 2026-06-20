import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import AkpakpaImg from '../../imports/Agence Akpakpa.jpeg';
import CotonouImg from '../../imports/Agence Cotonou.jpeg';
import PortoImg from '../../imports/Agence Porto-Novo.jpeg';
import AbomeyImg from '../../imports/Agence Abomey.jpeg';
import ParakouImg from '../../imports/Agence parakou.jpeg';
import LokossaImg from '../../imports/Agence Lokossa.jpeg';
import NatitingouImg from '../../imports/Agence Natitingou.jpeg';
import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router';

const AGENCES = [
  { ville: 'Cotonou', nom: 'Agence de Cotonou — Akpakpa', adresse: 'Akpakpa, face stade René Pleven', telephone: '(+229) 90 19 00 00', horaires: 'Lun-Ven : 8h00 – 17h30', photo: AkpakpaImg },
  { ville: 'Porto-Novo', nom: 'Agence de Porto-Novo', adresse: 'Face BIBE', telephone: '+229 20 21 26 85', horaires: 'Lun-Ven : 8h00 – 17h30', photo: PortoImg },
  { ville: 'Abomey', nom: "Agence d'Abomey", adresse: 'Place Goho', telephone: '+229 22 50 01 23', horaires: 'Lun-Ven : 8h00 – 17h30', photo: AbomeyImg },
  { ville: 'Parakou', nom: 'Agence de Parakou', adresse: 'Centre-ville', telephone: '+229 23 61 04 12', horaires: 'Lun-Ven : 8h00 – 17h30', photo: ParakouImg },
  { ville: 'Lokossa', nom: 'Agence de Lokossa', adresse: 'Centre-ville', telephone: '+229 21 41 00 45', horaires: 'Lun-Ven : 8h00 – 17h30', photo: LokossaImg },
  { ville: 'Natitingou', nom: 'Agence de Natitingou', adresse: 'Centre-ville', telephone: '+229 23 82 11 54', horaires: 'Lun-Ven : 8h00 – 17h30', photo: NatitingouImg },
];

function AgencyCarousel({ agences, initialIndex = 0 }: { agences: typeof AGENCES, initialIndex?: number }) {
  const [index, setIndex] = useState(initialIndex);

  const prev = () => setIndex((s) => (s === 0 ? agences.length - 1 : s - 1));
  const next = () => setIndex((s) => (s === agences.length - 1 ? 0 : s + 1));

  const a = agences[index];

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <img src={a.photo} alt={a.nom} className="w-full h-64 md:h-80 object-cover" />
          <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:bg-white">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900">{a.nom}</h3>
          <p className="text-sm text-gray-600 mb-3">{a.ville} — {a.adresse}</p>

          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{a.adresse}, {a.ville}</span>
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-700">
              <Phone className="w-4 h-4 text-gray-500" />
              <a href={'tel:' + a.telephone.replace(/[^0-9+]/g, '')} className="text-sky-600">{a.telephone}</a>
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-700">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{a.horaires}</span>
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.adresse + ' ' + a.ville)}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              Voir la localisation
            </a>
            <div className="ml-auto flex items-center gap-2">
              {agences.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full ${i === index ? 'bg-sky-600' : 'bg-gray-300'}`}></button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgencesPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selected = parseInt(params.get('selected') || '0', 10);
  const initialIndex = selected && selected > 0 ? Math.max(0, selected - 1) : 0;

  return (
    <PublicLayout>
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0d1f38] to-[#1a3a6e] pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4A90E2] mb-3">CNSS Bénin</p>
          <h1 className="text-5xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Nos Agences
          </h1>
          <div className="w-12 h-0.5 bg-[#4A90E2] mx-auto mb-6" />
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            12 agences régionales pour vous accompagner partout au Bénin. Retrouvez celle la plus proche de chez vous.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto space-y-12">

          {/* Carousel agences (remplace la carte) */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900">Nos agences</h2>
                <p className="text-sm text-gray-500 mt-0.5">Parcourez les agences une par une pour voir toutes les informations.</p>
              </div>
            </div>

            <AgencyCarousel agences={AGENCES} initialIndex={initialIndex} />
          </div>

          {/* Liste compacte des agences (thumbnails) */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Toutes les agences
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {AGENCES.map((a, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-100">
                  <img src={a.photo} alt={a.nom} className="w-full h-20 object-cover rounded-md mb-2" />
                  <div className="text-xs font-medium text-gray-900">{a.ville}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Infos pratiques */}
          <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
              Informations pratiques
            </h2>
            <div className="grid md:grid-cols-3 gap-8 text-sm">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <Clock className="w-4 h-4 text-[#4A90E2]" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Horaires d'ouverture</h3>
                <p className="text-gray-500 leading-relaxed">Toutes nos agences sont ouvertes du lundi au vendredi de 8h00 à 17h30, sans interruption méridienne.</p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <MapPin className="w-4 h-4 text-[#4A90E2]" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Documents à apporter</h3>
                <p className="text-gray-500 leading-relaxed">Munissez-vous de votre pièce d'identité, de votre numéro d'immatriculation CNSS et des documents spécifiques à votre demande.</p>
              </div>
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                  <Mail className="w-4 h-4 text-[#4A90E2]" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Contact général</h3>
                <p className="text-gray-500 leading-relaxed">Pour toute question générale, contactez notre standard au (+229) 90 19 00 00 ou par email à info@cnss.bj.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PublicLayout>
  );
}
