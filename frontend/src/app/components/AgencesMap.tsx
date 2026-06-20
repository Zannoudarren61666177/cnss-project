import { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import AkpakpaImg from '../../imports/Agence Akpakpa.jpeg';
import CotonouImg from '../../imports/Agence Cotonou.jpeg';
import PortoImg from '../../imports/Agence Porto-Novo.jpeg';
import AbomeyImg from '../../imports/Agence Abomey.jpeg';
import ParakouImg from '../../imports/Agence parakou.jpeg';
import LokossaImg from '../../imports/Agence Lokossa.jpeg';
import NatitingouImg from '../../imports/Agence Natitingou.jpeg';
import 'leaflet/dist/leaflet.css';
import type L from 'leaflet';

interface Agence {
  id: number;
  nom: string;
  ville: string;
  adresse: string;
  telephone: string;
  horaires: string;
  latitude: number;
  longitude: number;
}

const agences: Agence[] = [
  {
    id: 1,
    nom: 'Agence de Cotonou - Akpakpa',
    ville: 'Cotonou',
    adresse: 'Akpakpa, face stade René Pleven',
    telephone: '(+229) 90 19 00 00',
    horaires: 'Lun-Ven: 8h00 - 17h30',
    latitude: 6.3654,
    longitude: 2.4183,
    // use logo for marker
    logo: AkpakpaImg as unknown as string,
  },
  {
    id: 2,
    nom: 'Agence de Porto-Novo',
    ville: 'Porto-Novo',
    adresse: 'Face BIBE',
    telephone: '+229 20 21 26 85',
    horaires: 'Lun-Ven: 8h00 - 17h30',
    latitude: 6.4969,
    longitude: 2.6289,
    logo: PortoImg as unknown as string,
  },
  {
    id: 3,
    nom: 'Agence d\'Abomey',
    ville: 'Abomey',
    adresse: 'Place Goho',
    telephone: '+229 22 50 01 23',
    horaires: 'Lun-Ven: 8h00 - 17h30',
    latitude: 7.1826,
    longitude: 1.9913,
    logo: AbomeyImg as unknown as string,
  },
  {
    id: 4,
    nom: 'Agence de Parakou',
    ville: 'Parakou',
    adresse: 'Centre-ville',
    telephone: '+229 23 61 04 12',
    horaires: 'Lun-Ven: 8h00 - 17h30',
    latitude: 9.3372,
    longitude: 2.6304,
    logo: ParakouImg as unknown as string,
  },
  {
    id: 5,
    nom: 'Agence de Lokossa',
    ville: 'Lokossa',
    adresse: 'Centre-ville',
    telephone: '+229 21 41 00 45',
    horaires: 'Lun-Ven: 8h00 - 17h30',
    latitude: 6.6389,
    longitude: 1.7167,
    logo: LokossaImg as unknown as string,
  },
  {
    id: 6,
    nom: 'Agence de Natitingou',
    ville: 'Natitingou',
    adresse: 'Centre-ville',
    telephone: '+229 23 82 11 54',
    horaires: 'Lun-Ven: 8h00 - 17h30',
    latitude: 10.3167,
    longitude: 1.3833,
    logo: NatitingouImg as unknown as string,
  },
];

export function AgencesMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedAgence, setSelectedAgence] = useState<Agence | null>(null);

  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      if (!mapRef.current) return;

      const L = await import('leaflet');

      // Guard: component unmounted or map already created during async gap
      if (!mounted || !mapRef.current || mapInstanceRef.current) return;

      // Guard: container already claimed by a previous Leaflet instance
      if ((mapRef.current as any)._leaflet_id) return;

      const map = L.map(mapRef.current, {
        center: [9.3, 2.3],
        zoom: 7,
        scrollWheelZoom: false,
        zoomControl: false,
      });

      // modern position for zoom controls
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // create a modern div icon for each agence
      agences.forEach((agence) => {
        // If agence.logo is provided, use it inside the divIcon, otherwise show initial
        const hasLogo = !!(agence as any).logo;
        const html = hasLogo
          ? `
            <div style="display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:9999px;background:transparent;border:3px solid white;box-shadow:0 6px 14px rgba(2,6,23,0.12);overflow:hidden">
              <img src="${(agence as any).logo}" style="width:100%;height:100%;object-fit:cover;display:block" alt="${agence.ville}" />
            </div>
          `
          : `
            <div style="display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:9999px;background:#7DD3FC;color:#0369A1;border:3px solid white;box-shadow:0 4px 10px rgba(2,6,23,0.12);font-weight:700">
              ${agence.ville.charAt(0)}
            </div>
          `;

        const icon = L.divIcon({
          html,
          className: '',
          iconSize: hasLogo ? [48, 48] : [44, 44],
          iconAnchor: hasLogo ? [24, 48] : [22, 44],
        });

        const marker = L.marker([agence.latitude, agence.longitude], { icon })
          .addTo(map);

        // navigate to agences page with selection on click
        marker.on('click', () => {
          window.location.href = `/agences?selected=${agence.id}`;
        });
      });

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-white" id="agences">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Agences
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Retrouvez toutes les agences de la CNSS à travers le Bénin. Nous sommes présents dans les principales villes du pays pour vous servir.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Carte */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 relative">
              <div ref={mapRef} className="h-[500px] w-full z-0" id="map-container" />
              {selectedAgence && (
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-xl p-4 max-w-xs z-[1000]">
                  <button
                    onClick={() => setSelectedAgence(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                  <h3 className="font-bold text-blue-600 mb-3 pr-6">{selectedAgence.nom}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                      <span>{selectedAgence.adresse}, {selectedAgence.ville}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{selectedAgence.telephone}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{selectedAgence.horaires}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Liste des agences */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-h-[500px] overflow-y-auto">
              <h3 className="font-bold text-xl text-gray-900 mb-4 sticky top-0 bg-white pb-2">
                Liste des agences
              </h3>
              <div className="space-y-4">
                {agences.map((agence) => (
                  <div
                    key={agence.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <h4 className="font-semibold text-blue-600 mb-2">{agence.ville}</h4>
                    <p className="text-sm text-gray-700 mb-1">{agence.nom}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-600 flex items-start gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>{agence.adresse}</span>
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span>{agence.telephone}</span>
                      </p>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span>{agence.horaires}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Informations complémentaires */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">6 Agences</h4>
            <p className="text-sm text-gray-600">À travers tout le Bénin</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Horaires</h4>
            <p className="text-sm text-gray-600">Lun-Ven: 8h00 - 17h30</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
            <p className="text-sm text-gray-600">(+229) 90 19 00 00</p>
          </div>
        </div>
      </div>
    </section>
  );
}
