import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { PRESTATIONS as DATA } from '../data/prestations';

const PRESTATIONS = DATA.map(p => ({
  id: p.id, numero: p.numero, titre: p.titre,
  description: p.description, photo: p.photo, tag: p.tag,
}));

export function Prestations() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="py-20 bg-white" id="prestations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* En-tête */}
        <div className="mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-2">Protection sociale</p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
              Nos prestations
            </h2>
            <p className="text-gray-500 text-sm max-w-md text-right">
              Quatre branches de protection sociale pour accompagner les travailleurs béninois à chaque étape de leur vie.
            </p>
          </div>
          <div className="w-12 h-0.5 bg-sky-500 mt-4" />
        </div>

        {/* Grille de cartes */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRESTATIONS.map((p) => (
            <Link
              to={`/prestations/${p.id}`}
              key={p.id}
              className="group rounded-2xl overflow-hidden border border-gray-100 cursor-pointer block"
              style={{
                boxShadow: hovered === p.id
                  ? '0 20px 48px rgba(135,206,235,0.18), 0 2px 8px rgba(0,0,0,0.06)'
                  : '0 2px 12px rgba(0,0,0,0.06)',
                transform: hovered === p.id ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Photo */}
              <div className="relative overflow-hidden h-48">
                <img
                  src={p.photo}
                  alt={p.titre}
                  className="w-full h-full object-cover"
                  style={{
                    transform: hovered === p.id ? 'scale(1.07)' : 'scale(1)',
                    transition: 'transform 0.5s ease',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                {/* Numéro */}
                <span className="absolute top-4 left-4 text-xs font-bold text-white/60 tracking-widest">
                  {p.numero}
                </span>
                {/* Tag */}
                <span className="absolute bottom-4 left-4 right-4 text-xs font-semibold text-white bg-sky-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">
                  {p.tag}
                </span>
              </div>

              {/* Contenu */}
              <div className="p-5 bg-white">
                <h3 className="font-bold text-gray-900 mb-2 leading-snug">{p.titre}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.description}</p>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-sky-500 group-hover:gap-2.5 transition-all">
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
