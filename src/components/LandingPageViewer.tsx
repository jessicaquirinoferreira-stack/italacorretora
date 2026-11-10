import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Shield,
  ArrowRight,
  Maximize2,
  Bed,
  Car,
  Award,
} from 'lucide-react';
import { LandingPage, Development, SiteSettings } from '../types';
import { LeadForm } from './LeadForm';
import { logAnalyticsEvent } from '../lib/firestoreService';

interface LandingPageViewerProps {
  landingPage: LandingPage;
  development?: Development;
  settings: SiteSettings;
  onNavigateHome: () => void;
}

export const LandingPageViewer: React.FC<LandingPageViewerProps> = ({
  landingPage,
  development,
  settings,
  onNavigateHome,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logAnalyticsEvent({
      eventType: 'page_view',
      pageUrl: window.location.href,
      developmentId: landingPage.developmentId,
    });
  }, [landingPage.slug]);

  const heroImage =
    landingPage.heroImageUrl ||
    development?.coverImage ||
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Acesse a apresentação exclusiva do lançamento ${landingPage.developmentTitle}:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleDirectWhatsAppLead = () => {
    const phone = settings.whatsapp || '5511998765432';
    const text = encodeURIComponent(
      `Olá, Ittala! Acessei a página de apresentação exclusiva do ${landingPage.developmentTitle} e gostaria de atendimento prioritário.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-[#f8fafc] antialiased">
      {/* Top Banner Bar with Broker Badge */}
      <div className="bg-[#0b0f17]/90 border-b border-white/[0.08] py-3.5 px-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={onNavigateHome} className="flex items-center gap-2.5 text-left">
            <div className="w-8 h-8 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-[#d4af37]/20">
              <span className="font-cinzel text-sm font-bold text-[#fef08a]">ID</span>
            </div>
            <div>
              <span className="font-serif-luxury text-sm font-bold text-white block">
                {settings.brokerName || 'ITTALA DIAS'}
              </span>
              <span className="font-cinzel text-[9px] tracking-[0.2em] text-[#d4af37] block">
                APRESENTAÇÃO EXCLUSIVA
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs text-slate-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copiado' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={handleDirectWhatsAppLead}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt={landingPage.headline} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a10] via-[#070a10]/80 to-[#070a10]/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel-gold mb-6 shadow-xl">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="font-cinzel text-xs uppercase tracking-widest text-[#fef08a] font-semibold">
              Oportunidade Exclusiva & Condições Especiais
            </span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {landingPage.headline}
          </h1>

          <p className="text-slate-300 text-base sm:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-8">
            {landingPage.subheadline}
          </p>

          {landingPage.customPriceText && (
            <div className="inline-block px-6 py-2.5 rounded-xl bg-white/[0.05] border border-[#d4af37]/40 text-[#fef08a] font-serif-luxury text-lg sm:text-xl font-bold mb-10 shadow-lg">
              {landingPage.customPriceText}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById('cadastro-vip')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-widest shadow-2xl shadow-[#d4af37]/25"
            >
              Receber Apresentação Executiva em PDF
            </button>

            <button
              onClick={handleDirectWhatsAppLead}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full glass-panel hover:bg-white/[0.08] text-white font-semibold text-xs uppercase tracking-wider border border-white/20"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{landingPage.ctaWhatsAppText || 'Falar com Ittala no WhatsApp'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Highlights & Details */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-cinzel text-[#d4af37] tracking-wider uppercase">
              <Award className="w-4 h-4" />
              <span>Diferenciais em Destaque</span>
            </div>

            <h2 className="font-serif-luxury text-3xl font-bold text-white">
              Privilégios únicos concebidos para o seu estilo de vida
            </h2>

            <div className="space-y-3.5">
              {(landingPage.highlights && landingPage.highlights.length > 0
                ? landingPage.highlights
                : development?.highlights || [
                    'Localização mais nobre com valorização acelerada',
                    'Acabamentos refinados em mármore e esquadrias de alta performance',
                    'Lazer estilo resort privado com segurança 24 horas',
                  ]
              ).map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-200 leading-relaxed">{h}</span>
                </div>
              ))}
            </div>

            {development && (
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  {development.neighborhood}, {development.city}
                </span>
                <span>•</span>
                <span>{development.areaMin}m² a {development.areaMax}m²</span>
              </div>
            )}
          </div>

          {/* Form on Right side */}
          <div id="cadastro-vip" className="relative">
            <div className="p-1 rounded-2xl bg-gradient-to-b from-[#d4af37]/40 via-white/5 to-transparent">
              <LeadForm
                development={development}
                origin={`landing_page_${landingPage.slug}`}
                brokerWhatsApp={settings.whatsapp}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer bar */}
      <div className="py-8 border-t border-white/[0.08] text-center text-xs text-slate-500">
        <p className="mb-2">
          Apresentação realizada por {settings.brokerName || 'Ittala Dias'} — {settings.creci || 'CRECI 12.840-F / SP'}
        </p>
        <button onClick={onNavigateHome} className="text-[#d4af37] hover:underline text-[11px] font-cinzel">
          Voltar para o site institucional
        </button>
      </div>
    </div>
  );
};
