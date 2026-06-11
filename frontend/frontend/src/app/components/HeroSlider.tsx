import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getSlides } from '../api';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const fallbackSlides: Slide[] = [
  {
    id: 1,
    title: 'République du Bénin',
    subtitle: 'Caisse Nationale de Sécurité Sociale',
    description: 'Votre protection sociale pour un avenir serein',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&h=600&fit=crop',
  },
  {
    id: 2,
    title: 'Services en ligne',
    subtitle: 'Déclarez vos travailleurs en ligne',
    description: 'Simplifiez vos démarches administratives avec notre plateforme digitale',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop',
  },
];

export function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    getSlides()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(() => {});
  }, []);

  // reste du code inchangé...

  // Auto-défilement
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-[600px] overflow-hidden bg-gradient-to-br from-blue-50 to-white">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0">
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/40" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-white font-semibold text-sm ml-2">République du Bénin</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {slide.title}
                </h1>
                <h2 className="text-2xl md:text-3xl font-semibold text-white/95 mb-6">
                  {slide.subtitle}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
                  {slide.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/connexion"
                    className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg"
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/inscription"
                    className="px-8 py-4 border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm rounded-lg font-semibold text-lg transition-all"
                  >
                    Créer un compte
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all border border-white/40"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all border border-white/40"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70 w-1.5'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}