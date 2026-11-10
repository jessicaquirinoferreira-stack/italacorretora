import React from 'react';
import {
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Shield,
  Lock,
  ArrowUp,
} from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  onNavigate: (view: string, param?: string) => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate, onOpenPrivacy }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#070a10] border-t border-white/[0.08] text-slate-400 pt-16 pb-12 overflow-hidden">
      {/* Subtle gold ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-[#d4af37]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-14 border-b border-white/[0.06]">
          {/* Column 1: Monogram & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-[#d4af37]/10">
                <span className="font-cinzel text-lg font-bold text-[#fef08a]">ID</span>
              </div>
              <div>
                <span className="block font-serif-luxury text-lg text-white font-semibold tracking-wider">
                  {settings.brokerName || 'ITTALA DIAS'}
                </span>
                <span className="block font-cinzel text-[10px] tracking-[0.25em] text-[#d4af37]">
                  CORRETORA DE IMÓVEIS
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {settings.bio ||
                'Assessoria imobiliária de alto padrão especializada em coberturas, mansões e lançamentos imobiliários com atendimento exclusivo e confidencial.'}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-[#fef08a]">
              <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>{settings.creci || 'CRECI 12.840-F / SP'}</span>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-semibold text-white tracking-wider uppercase">
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('home');
                    scrollToTop();
                  }}
                  className="hover:text-[#fef08a] transition-colors"
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vitrine')}
                  className="hover:text-[#fef08a] transition-colors"
                >
                  Vitrine de Empreendimentos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lancamentos')}
                  className="hover:text-[#fef08a] transition-colors"
                >
                  Lançamentos Exclusivos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    document.getElementById('sobre-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#fef08a] transition-colors"
                >
                  Sobre a Corretora
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    document.getElementById('contato-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-[#fef08a] transition-colors"
                >
                  Agendar Consultoria
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct Channels */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-semibold text-white tracking-wider uppercase">
              Canais Oficiais
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                <span>{settings.cities || 'São Paulo, Jardins, Vila Nova Conceição & Alphaville'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone || '+55 (11) 99876-5432'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#d4af37] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email || 'contato@ittaladias.com.br'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${settings.whatsapp || '5511998765432'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  WhatsApp VIP Direto
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Presence & Instagram */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-sm font-semibold text-white tracking-wider uppercase">
              Redes Sociais
            </h4>
            <p className="text-xs text-slate-400">
              Acompanhe novidades, tours de imóveis e bastidores no perfil oficial:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href={settings.instagram || 'https://www.instagram.com/ittaladias.corretora/'}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-[#fef08a] hover:border-[#d4af37] hover:scale-110 transition-all"
                title="Instagram @ittaladias.corretora"
              >
                <Instagram className="w-4 h-4" />
              </a>
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-[#fef08a] hover:border-[#d4af37] hover:scale-110 transition-all"
                  title="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-[#fef08a] hover:border-[#d4af37] hover:scale-110 transition-all"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin && (
                <a
                  href={settings.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-[#fef08a] hover:border-[#d4af37] hover:scale-110 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>

            <button
              onClick={scrollToTop}
              className="mt-4 flex items-center gap-1.5 text-[11px] text-[#d4af37] hover:underline"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Voltar ao topo</span>
            </button>
          </div>
        </div>

        {/* Bottom bar with discrete PAINEL ADMIN and LGPD */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="text-center md:text-left">
            <p>
              © {currentYear} {settings.brokerName || 'Ittala Dias'} — Todos os direitos reservados.
              CRECI sob fiscalização do COFECI.
            </p>
          </div>

          {/* Central discreet Admin link as required by prompt */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => onNavigate('admin_login')}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] hover:border-[#d4af37]/50 text-slate-400 hover:text-[#fef08a] text-[11px] tracking-widest font-semibold uppercase transition-all shadow-sm group"
            >
              <Lock className="w-3 h-3 text-slate-500 group-hover:text-[#d4af37] transition-colors" />
              <span>PAINEL ADMIN</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-slate-300 underline underline-offset-2 transition-colors"
            >
              Privacidade & LGPD
            </button>
            <span>•</span>
            <span>Segurança Criptografada</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
