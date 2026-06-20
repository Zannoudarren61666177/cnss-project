import { Search, FileText, Users, Building2, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
    title: 'Digitalisation des services CNSS',
    description: 'Une plateforme moderne pour tous vos besoins de sécurité sociale'
  },
  {
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=600&fit=crop',
    title: 'Paiement en ligne simplifié',
    description: 'Payez vos cotisations via Mobile Money ou carte bancaire'
  },
  {
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&h=600&fit=crop',
    title: 'Suivi de vos droits en temps réel',
    description: 'Accédez à votre espace personnel 24h/24 et 7j/7'
  },
  {
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=1200&h=600&fit=crop',
    title: 'Protection sociale pour tous',
    description: 'La CNSS vous accompagne tout au long de votre carrière'
  }
];

const suggestions = [
  { icon: FileText, text: 'Déclaration de cotisations', link: '#' },
  { icon: Users, text: 'Demande d\'adhésion', link: '/inscription' },
  { icon: Building2, text: 'Trouver une agence', link: '#agences' },
  { icon: HelpCircle, text: 'Questions fréquentes', link: '#faq' },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Moteur de recherche à gauche */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10 flex flex-col justify-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Comment pouvons-nous vous aider ?
                </h1>
                <p className="text-gray-600 text-lg">
                  Recherchez des informations, services et documents en quelques clics
                </p>
              </div>

              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un service, document, information..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all font-semibold">
                  Rechercher
                </button>
              </div>

              {/* Suggestions rapides */}
              <div>
                <p className="text-sm text-gray-500 mb-3 font-medium">Recherches populaires :</p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <a
                        key={index}
                        href={suggestion.link}
                        className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg transition-all border border-gray-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium truncate">{suggestion.text}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Slider d'images à droite */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl h-[400px] lg:h-auto min-h-[400px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg text-gray-200">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}

            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 hover:scale-110 active:scale-95 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 hover:scale-110 active:scale-95 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all hover:scale-125 ${
                    index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
