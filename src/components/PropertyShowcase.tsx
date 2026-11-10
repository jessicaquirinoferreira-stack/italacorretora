import React from 'react';
import { Sparkles, Building, SlidersHorizontal } from 'lucide-react';
import { Development } from '../types';
import { PropertyCard } from './PropertyCard';

interface PropertyShowcaseProps {
  title?: string;
  subtitle?: string;
  developments: Development[];
  onSelectDevelopment: (dev: Development) => void;
  onInquireWhatsApp: (dev: Development) => void;
  isLoading?: boolean;
}

export const PropertyShowcase: React.FC<PropertyShowcaseProps> = ({
  title = 'Vitrine de Imóveis & Empreendimentos',
  subtitle = 'Seleção rigorosa de residências extraordinárias, coberturas icônicas e lançamentos de alto padrão.',
  developments,
  onSelectDevelopment,
  onInquireWhatsApp,
  isLoading = false,
}) => {
  return (
    <section id="empreendimentos-vitrine" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-cinzel text-xs uppercase tracking-widest text-[#fef08a]">
              Portfólio de Prestígio
            </span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-bold tracking-tight mb-4">
            {title}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl glass-panel h-96 animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : developments.length > 0 ? (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {developments.map((dev) => (
              <PropertyCard
                key={dev.id}
                development={dev}
                onSelect={onSelectDevelopment}
                onInquireWhatsApp={onInquireWhatsApp}
              />
            ))}
          </div>
        ) : (
          /* Elegant Empty State */
          <div className="text-center py-16 px-6 glass-panel rounded-2xl border border-white/10 max-w-xl mx-auto">
            <Building className="w-12 h-12 text-[#d4af37] mx-auto mb-4 opacity-75" />
            <h3 className="font-serif-luxury text-xl font-bold text-white mb-2">
              Nenhum empreendimento localizado
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Ajuste os filtros de busca para encontrar outras oportunidades ou entre em contato direto
              com a corretora Ittala Dias para receber ofertas confidenciais fora do mercado público.
            </p>
            <button
              onClick={() => {
                const phone = '5511998765432';
                const text = encodeURIComponent(
                  'Olá, Ittala! Procuro um imóvel específico e gostaria de consultar oportunidades confidenciais.'
                );
                window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider"
            >
              Consultar Imóveis Confidenciais
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
