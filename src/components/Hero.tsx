import React, { useState, useEffect } from 'react';
import {
  ArrowDown,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Building,
} from 'lucide-react';
import { SiteSettings, Development } from '../types';

interface HeroProps {
  settings: SiteSettings;
  developments?: Development[];
  onExplore: () => void;
  onContact: () => void;
  onSelectDevelopment?: (dev: Development) => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  developments = [],
  onExplore,
  onContact,
  onSelectDevelopment,
}) => {
  // Collect photos and metadata from the registered developments
  const slides = developments.length > 0
    ? developments.map((dev) => ({
        image: dev.coverImage,
        title: dev.title,
        neighborhood: `${dev.neighborhood}, ${dev.city}`,
        type: dev.propertyType,
        dev: dev,
      }))
    : [
        {
          image:
            settings.heroImage ||
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85',
          title: 'Residências de Altíssimo Padrão',
          neighborhood: 'São Paulo',
          type: 'Mansão',
          dev: undefined,
        },
      ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Automatic slideshow transition every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const heroTitle = settings.heroTitle || 'Exclusividade, Requinte e os Melhores Imóveis de Alto Padrão';
  const heroSubtitle =
    settings.heroSubtitle ||
    'Assessoria personalizada na escolha do seu próximo endereço de prestígio ou investimento patrimonial de alta rentabilidade com a corretora Ittala Dias.';

  return (
    <section className="relative min-h-[94vh] flex items-center justify-center pt-28 pb-20 overflow-hidden">
      {/* Background Slideshow with Smooth Cross-Fade */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className={`w-full h-full object-cover object-center ${
                index === currentSlideIndex ? 'scale-105 animate-[kenburns_18s_infinite_alternate]' : ''
              }`}
            />
          </div>
        ))}

        {/* Cinematic Vignette & Gradient Overlays */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/75 to-[#0b0f17]/50" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0b0f17]/60 to-[#0b0f17]" />
      </div>

      {/* Manual Slideshow Controls (Subtle Chevrons) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrevSlide}
            className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full items-center justify-center glass-panel hover:bg-[#d4af37] text-white hover:text-[#0b0f17] border border-white/10 hover:border-[#d4af37] transition-all duration-300"
            aria-label="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextSlide}
            className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full items-center justify-center glass-panel hover:bg-[#d4af37] text-white hover:text-[#0b0f17] border border-white/10 hover:border-[#d4af37] transition-all duration-300"
            aria-label="Próxima foto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Hero Content */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border border-[#d4af37]/40 shadow-xl mb-6 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#fef08a] font-semibold">
            Assessoria Imobiliária Exclusiva
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl text-white font-bold tracking-tight leading-[1.15] mb-5 drop-shadow-md">
          {heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-light mb-8 drop-shadow">
          {heroSubtitle}
        </p>

        {/* Active Development Pill Badge */}
        {currentSlide.dev && (
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass-panel border border-white/15 backdrop-blur-md mb-8 hover:border-[#d4af37]/60 transition-all cursor-pointer shadow-lg"
               onClick={() => onSelectDevelopment && currentSlide.dev && onSelectDevelopment(currentSlide.dev)}>
            <Building className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-xs text-slate-300">
              Em destaque no fundo:{' '}
              <strong className="text-[#fef08a] font-serif-luxury font-semibold">
                {currentSlide.title}
              </strong>
            </span>
            <span className="text-[11px] text-slate-400 font-cinzel">
              ({currentSlide.neighborhood})
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-14">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-widest transition-transform hover:scale-105 shadow-2xl shadow-[#d4af37]/25"
          >
            Explorar Empreendimentos
          </button>

          <button
            onClick={onContact}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full glass-panel hover:bg-white/[0.08] border border-white/20 hover:border-[#d4af37]/60 text-white font-semibold text-xs uppercase tracking-wider transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>Falar com a Corretora</span>
          </button>
        </div>

        {/* Slideshow Progress Dots */}
        {slides.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {slides.map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentSlideIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full ${
                  dotIdx === currentSlideIndex
                    ? 'w-8 h-2 bg-[#d4af37] shadow-lg shadow-[#d4af37]/40'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Ir para foto ${dotIdx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Luxury Key Metrics & Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/[0.08]">
          <div className="p-3 text-center">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold text-[#fef08a]">
              R$ 450M+
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              VGV Assessorado
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold text-[#fef08a]">
              100%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Sigilo & Discrição
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold text-[#fef08a]">
              Top 1%
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Lançamentos Nobres
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="block font-cinzel text-2xl sm:text-3xl font-bold text-[#fef08a]">
              VIP
            </span>
            <span className="text-[11px] uppercase tracking-wider text-slate-400">
              Atendimento Consultivo
            </span>
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <button
        onClick={onExplore}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 p-2 rounded-full text-slate-400 hover:text-[#fef08a] transition-colors animate-bounce"
        aria-label="Rolar para baixo"
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </section>
  );
};
