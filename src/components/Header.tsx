import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, Shield, ChevronRight } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeaderProps {
  settings: SiteSettings;
  onNavigate: (view: string, param?: string) => void;
  currentView: string;
}

export const Header: React.FC<HeaderProps> = ({ settings, onNavigate, currentView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsApp = () => {
    const phone = settings.whatsapp || '5511998765432';
    const text = encodeURIComponent(
      `Olá, Ittala! Acessei seu site imobiliário e gostaria de conhecer as oportunidades exclusivas de alto padrão.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const navLinks = [
    { label: 'Início', view: 'home' },
    { label: 'Empreendimentos', view: 'vitrine' },
    { label: 'Lançamentos', view: 'lancamentos' },
    { label: 'Sobre a Corretora', view: 'sobre' },
    { label: 'Contato', view: 'contato' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-panel border-b border-white/[0.08] shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-[#0b0f17]/95 via-[#0b0f17]/60 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Monogram */}
          <button
            onClick={() => {
              onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-gradient-to-br from-[#d4af37]/20 to-transparent shadow-inner group-hover:border-[#d4af37] transition-colors">
              <span className="font-cinzel text-lg font-bold text-[#fef08a]">ID</span>
            </div>
            <div>
              <span className="block font-serif-luxury text-lg tracking-wider font-semibold text-white group-hover:text-[#fef08a] transition-colors">
                {settings.brokerName ? settings.brokerName.toUpperCase() : 'ITTALA DIAS'}
              </span>
              <span className="block font-cinzel text-[10px] tracking-[0.25em] text-[#d4af37] font-medium">
                IMÓVEIS DE ALTO PADRÃO
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  onNavigate(link.view);
                  if (link.view === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link.view === 'sobre') {
                    const el = document.getElementById('sobre-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  } else if (link.view === 'contato') {
                    const el = document.getElementById('contato-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`text-sm tracking-wide transition-colors relative py-1 ${
                  currentView === link.view
                    ? 'text-[#fef08a] font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {link.label}
                {currentView === link.view && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d4af37] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-semibold text-xs tracking-wider uppercase transition-transform hover:scale-105 shadow-lg shadow-[#d4af37]/20 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-[#0b0f17]" />
              <span>Atendimento VIP</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[65px] bg-[#0b0f17]/98 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-8 shadow-2xl transition-all">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate(link.view);
                  if (link.view === 'home') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (link.view === 'sobre') {
                    document.getElementById('sobre-section')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (link.view === 'contato') {
                    document.getElementById('contato-section')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="flex items-center justify-between text-left text-base text-slate-200 hover:text-[#fef08a] py-2 border-b border-white/5"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsApp();
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs tracking-widest uppercase shadow-xl"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp</span>
            </button>

            <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{settings.creci || 'CRECI 12.840-F / SP'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
