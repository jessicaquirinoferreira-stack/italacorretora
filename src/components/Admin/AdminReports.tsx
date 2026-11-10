import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Eye,
  MessageCircle,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Development, Lead, LandingPage, SiteSettings } from '../../types';
import { saveSiteSettings } from '../../lib/firestoreService';

interface AdminReportsProps {
  developments: Development[];
  leads: Lead[];
  landingPages: LandingPage[];
  settings: SiteSettings;
  onRefreshSettings: () => void;
}

export const AdminReports: React.FC<AdminReportsProps> = ({
  developments,
  leads,
  landingPages,
  settings,
  onRefreshSettings,
}) => {
  const [gaId, setGaId] = useState(settings.googleAnalyticsId || '');
  const [adsId, setAdsId] = useState(settings.googleAdsId || '');
  const [searchConsoleUrl, setSearchConsoleUrl] = useState(settings.searchConsoleSite || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Group leads by development
  const leadsByDev: Record<string, number> = {};
  leads.forEach((l) => {
    const title = l.developmentTitle || 'Interesse Geral';
    leadsByDev[title] = (leadsByDev[title] || 0) + 1;
  });

  // Group leads by status
  const leadsByStatus: Record<string, number> = {};
  leads.forEach((l) => {
    leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1;
  });

  const handleSaveGoogleIntegrations = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSiteSettings({
        googleAnalyticsId: gaId.trim(),
        googleAdsId: adsId.trim(),
        searchConsoleSite: searchConsoleUrl.trim(),
      });
      setSavedSuccess(true);
      onRefreshSettings();
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportReportCSV = () => {
    const reportData = [
      ['RELATÓRIO EXECUTIVO DE LEADS E DESEMPENHO — ITTALA DIAS CORRETORA'],
      ['Data de Geração', new Date().toLocaleString('pt-BR')],
      ['Total de Empreendimentos', developments.length],
      ['Total de Leads Captados', leads.length],
      ['Total de Landing Pages Ativas', landingPages.length],
      [],
      ['LEADS POR EMPREENDIMENTO'],
      ['Empreendimento', 'Quantidade de Contatos'],
      ...Object.entries(leadsByDev).map(([title, count]) => [title, count]),
      [],
      ['LEADS POR STATUS DE ATENDIMENTO'],
      ['Status', 'Quantidade'],
      ...Object.entries(leadsByStatus).map(([status, count]) => [status, count]),
    ];

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      reportData.map((e) => e.map((cell) => `"${cell}"`).join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `relatorio_executivo_ittaladias_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            Relatórios Comerciais & Conexões Google
          </h2>
          <p className="text-xs text-slate-400">
            Acompanhe métricas reais coletadas pela plataforma e configure identificadores oficiais do Google
          </p>
        </div>

        <button
          onClick={handleExportReportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider shadow"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório Completo</span>
        </button>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leads by Property */}
        <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#d4af37]" />
            <span>Distribuição de Leads por Empreendimento</span>
          </h3>

          {Object.keys(leadsByDev).length > 0 ? (
            <div className="space-y-3 pt-2">
              {Object.entries(leadsByDev).map(([devTitle, count]) => {
                const percent = Math.round((count / leads.length) * 100);
                return (
                  <div key={devTitle} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[280px]">
                        {devTitle}
                      </span>
                      <span className="text-[#fef08a] font-bold">
                        {count} lead(s) ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#d4af37] to-[#fef08a] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              Ainda não há leads registrados para distribuição.
            </p>
          )}
        </div>

        {/* Leads by Status Funnel */}
        <div className="p-6 rounded-2xl glass-panel border border-white/[0.08] space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#d4af37]" />
            <span>Funil de Status dos Contatos</span>
          </h3>

          {Object.keys(leadsByStatus).length > 0 ? (
            <div className="space-y-2.5 pt-2">
              {Object.entries(leadsByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                >
                  <span className="capitalize text-slate-300 font-medium">
                    {status.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37]/20 text-[#fef08a]">
                    {count} contato(s)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              Sem dados de funil no momento.
            </p>
          )}
        </div>
      </div>

      {/* Google Integrations Panel (Official & Authorized) */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold border border-[#d4af37]/30 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-cinzel text-[#d4af37] tracking-wider uppercase mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Conexões Oficiais</span>
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-white">
            Integrações com Google Analytics 4, Ads & Search Console
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Insira suas tags oficiais para ativar a mensuração contínua de tráfego, rastreamento de conversão em campanhas patrocinadas e acompanhamento orgânico.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Identificadores do Google salvos com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSaveGoogleIntegrations} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1.5">
                Google Analytics 4 (Measurement ID)
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
              <span className="block text-[10px] text-slate-500 mt-1">
                {gaId ? 'ID registrado' : 'Pendente de configuração'}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1.5">
                Google Ads Conversion ID
              </label>
              <input
                type="text"
                placeholder="AW-XXXXXXXXXX"
                value={adsId}
                onChange={(e) => setAdsId(e.target.value)}
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
              <span className="block text-[10px] text-slate-500 mt-1">
                {adsId ? 'ID registrado' : 'Pendente de tag de conversão'}
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1.5">
                Google Search Console URL
              </label>
              <input
                type="text"
                placeholder="https://seudominio.com.br"
                value={searchConsoleUrl}
                onChange={(e) => setSearchConsoleUrl(e.target.value)}
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
              <span className="block text-[10px] text-slate-500 mt-1">
                {searchConsoleUrl ? 'Domínio registrado' : 'Pendente de verificação'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Salvando...' : 'Salvar Identificadores'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
