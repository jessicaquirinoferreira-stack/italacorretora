import React, { useState } from 'react';
import { MessageCircle, Instagram } from 'lucide-react';
import { SiteSettings } from '../types';

interface FloatingSocialActionsProps {
  settings: SiteSettings;
}

export const FloatingSocialActions: React.FC<FloatingSocialActionsProps> = ({ settings }) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const whatsappNumber = settings.whatsapp || '5511998765432';
  const instagramUrl = settings.instagram || 'https://www.instagram.com/ittaladias.corretora/';

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      'Olá, Ittala! Acessei seu site imobiliário e gostaria de atendimento prioritário para conhecer as oportunidades de alto padrão.'
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  const handleOpenInstagram = () => {
    window.open(instagramUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3.5 pointer-events-auto">
      {/* Instagram Official Floating Button */}
      <div className="relative flex items-center group">
        {/* Tooltip */}
        <span
          className={`absolute right-16 px-3 py-1.5 rounded-xl glass-panel text-[11px] font-semibold text-white whitespace-nowrap shadow-xl border border-white/10 transition-all duration-300 pointer-events-none ${
            hoveredButton === 'instagram'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2'
          }`}
        >
          Instagram @ittaladias.corretora
        </span>

        <button
          onClick={handleOpenInstagram}
          onMouseEnter={() => setHoveredButton('instagram')}
          onMouseLeave={() => setHoveredButton(null)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
          style={{
            background:
              'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
          }}
          aria-label="Abrir Instagram Oficial"
          title="Abrir Instagram Oficial"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-25 bg-[#d6249f] pointer-events-none" />

          {/* SVG Official Instagram Icon */}
          <svg
            className="w-7 h-7 fill-white drop-shadow-md"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </button>
      </div>

      {/* WhatsApp Official Floating Button */}
      <div className="relative flex items-center group">
        {/* Tooltip */}
        <span
          className={`absolute right-16 px-3 py-1.5 rounded-xl glass-panel text-[11px] font-semibold text-white whitespace-nowrap shadow-xl border border-white/10 transition-all duration-300 pointer-events-none ${
            hoveredButton === 'whatsapp'
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2'
          }`}
        >
          Conversar no WhatsApp
        </span>

        <button
          onClick={handleOpenWhatsApp}
          onMouseEnter={() => setHoveredButton('whatsapp')}
          onMouseLeave={() => setHoveredButton(null)}
          className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba56] flex items-center justify-center text-white shadow-2xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-none"
          aria-label="Abrir WhatsApp Oficial"
          title="Falar no WhatsApp"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#25D366] pointer-events-none" />

          {/* WhatsApp Icon */}
          <svg
            className="w-7 h-7 fill-white drop-shadow-md"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
};
