import React, { useState } from 'react';
import { Search, MapPin, Building, BedDouble, Filter, X, SlidersHorizontal } from 'lucide-react';
import { PropertyType, PropertyStatus } from '../types';

export interface SearchFilters {
  keyword: string;
  city: string;
  propertyType: string;
  status: string;
  minPrice: number;
  bedrooms: string;
}

interface PropertySearchProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  availableCities: string[];
  totalResults: number;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({
  filters,
  onFilterChange,
  availableCities,
  totalResults,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleReset = () => {
    onFilterChange({
      keyword: '',
      city: '',
      propertyType: '',
      status: '',
      minPrice: 0,
      bedrooms: '',
    });
  };

  const propertyTypes: PropertyType[] = [
    'Apartamento',
    'Cobertura',
    'Mansão',
    'Casa em Condomínio',
    'Terreno',
    'Comercial',
  ];

  return (
    <div className="relative -mt-10 z-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="glass-panel-gold rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
        {/* Quick status tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-5 pb-4 border-b border-white/[0.08]">
          <span className="text-xs uppercase font-cinzel tracking-wider text-slate-400 mr-2 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#d4af37]" />
            Status:
          </span>
          {[
            { label: 'Todos os Imóveis', value: '' },
            { label: 'Lançamentos', value: 'lancamento' },
            { label: 'Em Obras', value: 'em_obras' },
            { label: 'Prontos para Morar', value: 'pronto' },
            { label: 'Oportunidades', value: 'oportunidade' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => onFilterChange({ ...filters, status: tab.value })}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                filters.status === tab.value
                  ? 'bg-[#d4af37] text-[#0b0f17] font-semibold shadow-md shadow-[#d4af37]/30'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Primary Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="relative">
            <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-400 mb-1.5">
              Buscar Empreendimento
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Nome ou palavra-chave..."
                value={filters.keyword}
                onChange={(e) => onFilterChange({ ...filters, keyword: e.target.value })}
                className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>
          </div>

          {/* City / Location */}
          <div>
            <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-400 mb-1.5">
              Cidade / Região
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={filters.city}
                onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
                className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Todas as Regiões</option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-400 mb-1.5">
              Tipo de Propriedade
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={filters.propertyType}
                onChange={(e) => onFilterChange({ ...filters, propertyType: e.target.value })}
                className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Todos os Tipos</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bedrooms / Suites */}
          <div>
            <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-400 mb-1.5">
              Mínimo de Dormitórios
            </label>
            <div className="relative">
              <BedDouble className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <select
                value={filters.bedrooms}
                onChange={(e) => onFilterChange({ ...filters, bedrooms: e.target.value })}
                className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Qualquer quantidade</option>
                <option value="2">2+ Quartos</option>
                <option value="3">3+ Quartos</option>
                <option value="4">4+ Quartos</option>
                <option value="5">5+ Quartos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer info bar */}
        <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{totalResults}</span>
            <span>empreendimento(s) encontrado(s)</span>
          </div>

          {(filters.keyword ||
            filters.city ||
            filters.propertyType ||
            filters.status ||
            filters.bedrooms) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[#fef08a] hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar filtros</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
