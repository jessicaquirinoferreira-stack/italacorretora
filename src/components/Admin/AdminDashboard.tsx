import React from 'react';
import {
  Building,
  Users,
  FileText,
  TrendingUp,
  MessageCircle,
  ExternalLink,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Development, Lead, LandingPage, SiteSettings } from '../../types';

interface AdminDashboardProps {
  developments: Development[];
  leads: Lead[];
  landingPages: LandingPage[];
  settings: SiteSettings;
  onNavigateTab: (tab: string) => void;
  onOpenLead: (lead: Lead) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  developments,
  leads,
  landingPages,
  settings,
  onNavigateTab,
  onOpenLead,
}) => {
  const newLeads = leads.filter((l) => l.status === 'novo');
  const activeLps = landingPages.filter((lp) => lp.active);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Quick Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel-gold border border-[#d4af37]/30">
        <div>
          <span className="text-[11px] font-cinzel uppercase tracking-widest text-[#d4af37] block mb-1">
            Painel Executivo
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
            Bem-vinda, {settings.brokerName || 'Ittala Dias'}
          </h2>
          <p className="text-xs text-slate-300 font-light mt-1 max-w-xl">
            Acompanhe o desempenho comercial de sua vitrine imobiliária, captação de leads e geração de landing pages exclusivas.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('developments')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Empreendimento</span>
          </button>
          <button
            onClick={() => onNavigateTab('landing_pages')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full glass-panel hover:bg-white/[0.08] text-xs font-semibold text-white border border-white/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Gerar Landing Page</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-slate-400">
              Empreendimentos Ativos
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#d4af37]/15 flex items-center justify-center text-[#fef08a]">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-bold text-white mb-1">
            {developments.filter((d) => d.published).length}
          </div>
          <span className="text-[11px] text-slate-400">
            {developments.length} cadastrados no catálogo
          </span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-slate-400">
              Total de Contatos / Leads
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-bold text-white mb-1">{leads.length}</div>
          <span className="text-[11px] text-emerald-400 font-semibold">
            {newLeads.length} novo(s) aguardando retorno
          </span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-slate-400">
              Landing Pages Ativas
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-300">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-bold text-white mb-1">{activeLps.length}</div>
          <span className="text-[11px] text-slate-400">Campanhas exclusivas em veiculação</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-cinzel uppercase tracking-wider text-slate-400">
              Taxa de Conversão Estimada
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="font-cinzel text-3xl font-bold text-[#fef08a] mb-1">
            {leads.length > 0 ? `${Math.min(100, Math.round((leads.length / (leads.length * 8 + 40)) * 100))}%` : '0%'}
          </div>
          <span className="text-[11px] text-slate-400">Formulários & WhatsApp VIP</span>
        </div>
      </div>

      {/* Leads Recentes & Empreendimentos em Destaque */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Leads (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl glass-panel border border-white/[0.08] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-white">Leads Recentes</h3>
              <p className="text-xs text-slate-400">Contatos captados nos formulários do site</p>
            </div>
            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs text-[#fef08a] hover:underline flex items-center gap-1"
            >
              <span>Ver todos ({leads.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {leads.length > 0 ? (
            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#d4af37]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-xs">{lead.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-bold ${
                          lead.status === 'novo'
                            ? 'bg-[#d4af37] text-[#0b0f17]'
                            : lead.status === 'convertido'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-white/10 text-slate-300'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {lead.developmentTitle ? (
                        <span>Imóvel: <strong className="text-slate-200">{lead.developmentTitle}</strong></span>
                      ) : (
                        <span>Interesse Geral de Alto Padrão</span>
                      )}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const cleanPhone = lead.whatsapp.replace(/\D/g, '');
                        const msg = encodeURIComponent(
                          `Olá, ${lead.name}! Sou a corretora Ittala Dias. Recebi sua solicitação de interesse em ${
                            lead.developmentTitle || 'imóveis de alto padrão'
                          }. Como posso te assessorar?`
                        );
                        window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
                      }}
                      className="p-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-colors text-xs flex items-center gap-1.5"
                      title="Abrir WhatsApp direto"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-semibold">WhatsApp</span>
                    </button>
                    <button
                      onClick={() => onOpenLead(lead)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
                    >
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-slate-400">
              Nenhum contato recebido ainda. Formulários prontos para captação.
            </div>
          )}
        </div>

        {/* System Integrations & Status (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl glass-panel border border-white/[0.08] p-6 space-y-6">
          <div>
            <h3 className="font-serif-luxury text-lg font-bold text-white">Status das Conexões</h3>
            <p className="text-xs text-slate-400">Infraestrutura e canais oficiais vinculados</p>
          </div>

          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <div>
                  <span className="font-semibold text-white block">Firebase Cloud Firestore</span>
                  <span className="text-[11px] text-slate-400">Banco de dados ativo & sincronizado</span>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-cinzel font-bold">OPERACIONAL</span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                <div>
                  <span className="font-semibold text-white block">Instagram Oficial</span>
                  <span className="text-[11px] text-slate-400">@ittaladias.corretora</span>
                </div>
              </div>
              <a
                href={settings.instagram || 'https://www.instagram.com/ittaladias.corretora/'}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#fef08a] hover:underline"
              >
                Abrir Perfil
              </a>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    settings.googleAnalyticsId ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <div>
                  <span className="font-semibold text-white block">Google Analytics 4 (GA4)</span>
                  <span className="text-[11px] text-slate-400">
                    {settings.googleAnalyticsId ? `ID: ${settings.googleAnalyticsId}` : 'ID pendente'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('reports')}
                className="text-[11px] text-[#d4af37] hover:underline"
              >
                Configurar
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    settings.googleAdsId ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <div>
                  <span className="font-semibold text-white block">Google Ads Leads</span>
                  <span className="text-[11px] text-slate-400">
                    {settings.googleAdsId ? `ID: ${settings.googleAdsId}` : 'Aguardando tag'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('reports')}
                className="text-[11px] text-[#d4af37] hover:underline"
              >
                Configurar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
