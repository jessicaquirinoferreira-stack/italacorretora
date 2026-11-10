import React from 'react';
import {
  MapPin,
  Maximize2,
  Bed,
  Car,
  Bath,
  ArrowRight,
  MessageCircle,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Development } from '../types';

interface PropertyCardProps {
  development: Development;
  onSelect: (dev: Development) => void;
  onInquireWhatsApp: (dev: Development) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  development,
  onSelect,
  onInquireWhatsApp,
}) => {
  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Sob Consulta';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lancamento':
        return { label: 'Lançamento', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'em_obras':
        return { label: 'Em Obras', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'pronto':
        return { label: 'Pronto para Morar', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'oportunidade':
        return { label: 'Oportunidade', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return { label: 'Disponível', color: 'bg-white/10 text-white border-white/20' };
    }
  };

  const statusInfo = getStatusBadge(development.status);

  return (
    <div className="group relative rounded-2xl glass-panel overflow-hidden border border-white/[0.08] hover:border-[#d4af37]/40 hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-500 flex flex-col">
      {/* Cover Image Container */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelect(development)}>
        <img
          src={development.coverImage}
          alt={development.title}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-cinzel font-semibold uppercase tracking-wider border backdrop-blur-md ${statusInfo.color}`}
          >
            {statusInfo.label}
          </span>

          {development.featured && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-cinzel font-bold uppercase tracking-wider bg-[#d4af37]/90 text-[#0b0f17] shadow-lg">
              <Sparkles className="w-3 h-3 fill-current" />
              Exclusivo
            </span>
          )}
        </div>

        {/* Property Type Badge bottom left of image */}
        <div className="absolute bottom-3 left-4">
          <span className="px-2.5 py-1 rounded-md bg-[#0b0f17]/80 backdrop-blur-md text-[10px] uppercase font-cinzel tracking-wider text-[#fef08a] border border-white/10">
            {development.propertyType}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Developer */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1 truncate text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              {development.neighborhood}, {development.city}
            </span>
            {development.developer && (
              <span className="text-[10px] text-slate-500 uppercase tracking-wider truncate max-w-[120px]">
                {development.developer}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(development)}
            className="font-serif-luxury text-xl font-bold text-white group-hover:text-[#fef08a] transition-colors cursor-pointer line-clamp-1 mb-1.5"
          >
            {development.title}
          </h3>

          {/* Subtitle / Description excerpt */}
          <p className="text-xs text-slate-400 font-light line-clamp-2 leading-relaxed mb-4">
            {development.subtitle || development.description}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-4 gap-2 py-3 px-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-5 text-center text-xs">
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-cinzel">Área</span>
              <span className="font-semibold text-slate-200">
                {development.areaMin}
                {development.areaMax && development.areaMax !== development.areaMin ? `-${development.areaMax}` : ''}m²
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-cinzel">Quartos</span>
              <span className="font-semibold text-slate-200">{development.bedrooms}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-cinzel">Suítes</span>
              <span className="font-semibold text-slate-200">{development.suites}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400 uppercase font-cinzel">Vagas</span>
              <span className="font-semibold text-slate-200">{development.parkingSpots}</span>
            </div>
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div>
            <span className="block text-[10px] font-cinzel uppercase tracking-wider text-slate-400">
              Valor a partir de
            </span>
            <span className="font-serif-luxury text-lg font-bold text-[#fef08a]">
              {formatPrice(development.startingPrice)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onInquireWhatsApp(development)}
              className="p-2.5 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 transition-colors"
              title="Perguntar no WhatsApp"
              aria-label="Contato WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelect(development)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-[#d4af37] text-white hover:text-[#0b0f17] text-xs font-semibold tracking-wider transition-all border border-white/10 hover:border-[#d4af37]"
            >
              <span>Detalhes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
