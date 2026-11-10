import React from 'react';
import {
  ShieldCheck,
  Award,
  Gem,
  Lock,
  MessageCircle,
  Instagram,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutSectionProps {
  settings: SiteSettings;
  onContact: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onContact }) => {
  const brokerPhoto =
    settings.photoUrl ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80';

  const pillars = [
    {
      icon: Gem,
      title: 'Seleção Estrita & Alto Padrão',
      description:
        'Apenas empreendimentos de construtoras idôneas, com arquitetura autoral, acabamento superior e potencial de valorização garantido.',
    },
    {
      icon: Lock,
      title: 'Total Sigilo & Discrição',
      description:
        'Negociações confidenciais conduzidas com máxima privacidade e respeito ao patrimônio e dados de cada família ou investidor.',
    },
    {
      icon: ShieldCheck,
      title: 'Segurança Jurídica Integral',
      description:
        'Análise documental minuciosa em todas as etapas, assegurando contratos blindados e tranquilidade absoluta na aquisição.',
    },
    {
      icon: Award,
      title: 'Assessoria Consultiva 360°',
      description:
        'Do primeiro contato à entrega das chaves e pós-venda, acompanhamento de arquiteto, despachante e consultoria financeira.',
    },
  ];

  return (
    <section id="sobre-section" className="py-24 relative overflow-hidden bg-[#070a10]">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#d4af37]/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Photo & Identity Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative max-w-md mx-auto">
              {/* Outer decorative gold frame */}
              <div className="absolute -inset-3 rounded-3xl border border-[#d4af37]/30 transform -rotate-1 hidden sm:block" />
              <div className="relative rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
                <img
                  src={brokerPhoto}
                  alt={settings.brokerName || 'Ittala Dias Corretora'}
                  className="w-full h-[480px] sm:h-[540px] object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80" />

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-panel-gold backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-lg font-bold text-white">
                        {settings.brokerName || 'Ittala Dias'}
                      </h4>
                      <p className="text-[11px] font-cinzel tracking-wider text-[#d4af37]">
                        {settings.creci || 'CRECI 12.840-F / SP'}
                      </p>
                    </div>
                    <a
                      href={settings.instagram || 'https://www.instagram.com/ittaladias.corretora/'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full bg-white/10 hover:bg-[#d4af37] text-white hover:text-[#0b0f17] transition-colors"
                      title="Instagram @ittaladias.corretora"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text & Value Pillars */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="font-cinzel text-xs uppercase tracking-widest text-[#fef08a]">
                Autoridade & Experiência
              </span>
            </div>

            <h2 className="font-serif-luxury text-3xl sm:text-4xl text-white font-bold tracking-tight mb-6">
              Sua parceira de confiança no mercado imobiliário mais exclusivo do país
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light mb-6">
              {settings.aboutText ||
                'Com uma trajetória consolidada no segmento imobiliário de altíssimo padrão, Ittala Dias oferece assessoria completa e discreta para clientes exigentes e investidores estratégicos. Cada empreendimento apresentado passa por uma rígida avaliação técnica, jurídica e mercadológica, assegurando liquidez, valorização e conforto incomparável.'}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#fef08a] mb-8">
              <MapPin className="w-4 h-4 text-[#d4af37]" />
              <span>Regiões de Atuação: {settings.cities || 'São Paulo, Jardins, Vila Nova Conceição & Alphaville'}</span>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[#d4af37]/30 transition-all"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#fef08a]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h4 className="font-serif-luxury text-sm font-semibold text-white">
                        {pillar.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Direct Action */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onContact}
                className="px-8 py-3.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#d4af37]/20"
              >
                Agendar Reunião com Ittala
              </button>

              <a
                href={settings.instagram || 'https://www.instagram.com/ittaladias.corretora/'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full glass-panel hover:bg-white/[0.08] text-xs font-semibold text-white tracking-wider border border-white/10"
              >
                <Instagram className="w-4 h-4 text-[#d4af37]" />
                <span>Ver Instagram @ittaladias.corretora</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
