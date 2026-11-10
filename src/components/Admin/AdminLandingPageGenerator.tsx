import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Share2,
  QrCode,
  Edit2,
  Trash2,
  Eye,
  MessageCircle,
  Building,
  CheckCircle2,
  X,
  Plus,
} from 'lucide-react';
import { Development, LandingPage, LandingPageTemplate } from '../../types';
import { saveLandingPage, deleteLandingPage } from '../../lib/firestoreService';

interface AdminLandingPageGeneratorProps {
  developments: Development[];
  landingPages: LandingPage[];
  onRefresh: () => void;
  onOpenPublicLandingPage: (slug: string) => void;
  preselectedDev?: Development | null;
}

export const AdminLandingPageGenerator: React.FC<AdminLandingPageGeneratorProps> = ({
  developments,
  landingPages,
  onRefresh,
  onOpenPublicLandingPage,
  preselectedDev,
}) => {
  const [selectedDevId, setSelectedDevId] = useState<string>(
    preselectedDev?.id || (developments.length > 0 ? developments[0].id : '')
  );
  const [templateId, setTemplateId] = useState<LandingPageTemplate>('luxury');
  const [headline, setHeadline] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [customPriceText, setCustomPriceText] = useState('');
  const [ctaWhatsAppText, setCtaWhatsAppText] = useState('Solicitar Apresentação Executiva em PDF');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // QR Code Modal State
  const [qrModalPage, setQrModalPage] = useState<LandingPage | null>(null);

  // Template options as requested in Part 7
  const templates: { id: LandingPageTemplate; name: string; desc: string }[] = [
    {
      id: 'luxury',
      name: 'Luxo & Alto Padrão',
      desc: 'Foco em exclusividade, acabamento nobre e lifestyle imponente',
    },
    {
      id: 'minimalist',
      name: 'Moderno & Minimalista',
      desc: 'Design limpo, tipografia editorial e arquitetura contemporânea',
    },
    {
      id: 'launch',
      name: 'Lançamento Imobiliário',
      desc: 'Condições de tabela zero, pré-reserva e antecipação',
    },
    {
      id: 'family',
      name: 'Residencial Familiar',
      desc: 'Ênfase em conforto, segurança e ampla infraestrutura de lazer',
    },
    {
      id: 'investment',
      name: 'Investimento Imobiliário',
      desc: 'Foco em TIR, valorização patrimonial e liquidez de locação',
    },
    {
      id: 'commercial',
      name: 'Corporativo & Boutique',
      desc: 'Salas comerciais e lajes de alto prestígio',
    },
  ];

  // Auto-fill when dev changes
  const handleSelectDev = (devId: string) => {
    setSelectedDevId(devId);
    const dev = developments.find((d) => d.id === devId);
    if (dev) {
      setHeadline(`Condições Exclusivas de Aquisição: ${dev.title}`);
      setSubheadline(
        `Garanta atendimento prioritário e conheça os detalhes confidenciais do melhor lançamento no bairro ${dev.neighborhood}.`
      );
      setCustomPriceText(`A partir de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(dev.startingPrice)}`);
      setHeroImageUrl(dev.coverImage);
      setSlug(`${dev.slug}-vip`);
    }
  };

  const handleCreateLandingPage = async (e: React.FormEvent) => {
    e.preventDefault();
    const dev = developments.find((d) => d.id === selectedDevId);
    if (!dev) return;

    setIsPublishing(true);
    try {
      const cleanSlug = (slug || `${dev.slug}-vip`)
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const newLp: LandingPage = {
        id: `lp_${Date.now()}`,
        developmentId: dev.id,
        developmentTitle: dev.title,
        slug: cleanSlug,
        templateId,
        headline: headline.trim() || `Condições Exclusivas: ${dev.title}`,
        subheadline: subheadline.trim() || dev.subtitle,
        customPriceText: customPriceText.trim() || undefined,
        ctaWhatsAppText: ctaWhatsAppText.trim() || 'Falar com a Corretora no WhatsApp',
        heroImageUrl: heroImageUrl.trim() || dev.coverImage,
        highlights: dev.highlights,
        active: true,
        viewsCount: 0,
        leadsCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveLandingPage(newLp);
      setSuccessMessage(`Landing Page "/lancamento/${cleanSlug}" publicada com sucesso!`);
      onRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = (targetSlug: string) => {
    const url = `${window.location.origin}/lancamento/${targetSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(targetSlug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDeleteLp = async (id: string) => {
    if (window.confirm('Tem certeza que deseja despublicar esta Landing Page?')) {
      await deleteLandingPage(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#fef08a] text-xs font-cinzel mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>Ferramenta de Alta Conversão</span>
        </div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
          Gerador de Landing Page do Empreendimento
        </h2>
        <p className="text-xs text-slate-400 max-w-2xl mt-1">
          Crie páginas comerciais focadas com URL pública própria, personalização visual e botões de compartilhamento para WhatsApp, Instagram e campanhas de anúncios.
        </p>
      </div>

      {/* Generator Form Box */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel-gold border border-[#d4af37]/35 shadow-2xl">
        <h3 className="font-serif-luxury text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Building className="w-5 h-5 text-[#d4af37]" />
          <span>Configurar Nova Landing Page</span>
        </h3>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center mb-6 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleCreateLandingPage} className="space-y-6">
          {/* Step 1: Select Development */}
          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider text-slate-300 mb-2">
              1. Selecionar o Empreendimento Base *
            </label>
            <select
              value={selectedDevId}
              onChange={(e) => handleSelectDev(e.target.value)}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="">Selecione um empreendimento cadastrado...</option>
              {developments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title} ({d.neighborhood}, {d.city})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Choose Template */}
          <div>
            <label className="block text-xs font-cinzel uppercase tracking-wider text-slate-300 mb-2">
              2. Modelo Visual & Apelo Comercial *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {templates.map((tpl) => (
                <button
                  type="button"
                  key={tpl.id}
                  onClick={() => setTemplateId(tpl.id)}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    templateId === tpl.id
                      ? 'bg-[#d4af37]/20 border-[#d4af37] shadow-lg shadow-[#d4af37]/15'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                  <span
                    className={`block font-serif-luxury font-bold text-sm mb-1 ${
                      templateId === tpl.id ? 'text-[#fef08a]' : 'text-white'
                    }`}
                  >
                    {tpl.name}
                  </span>
                  <span className="text-[11px] text-slate-400 block font-light leading-relaxed">
                    {tpl.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Copy Customization */}
          <div className="space-y-4 pt-2">
            <label className="block text-xs font-cinzel uppercase tracking-wider text-slate-300">
              3. Textos & Chamadas de Conversão
            </label>

            <div>
              <span className="block text-[11px] text-slate-400 mb-1">Título de Impacto (Headline)</span>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ex: Condições de Pré-Lançamento Exclusivas nos Jardins"
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <span className="block text-[11px] text-slate-400 mb-1">Subtítulo Persuasivo</span>
              <textarea
                rows={2}
                value={subheadline}
                onChange={(e) => setSubheadline(e.target.value)}
                placeholder="Ex: Cadastre-se para receber a apresentação executiva e tabela confidencial."
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] text-slate-400 mb-1">
                  Texto de Preço / Condição
                </span>
                <input
                  type="text"
                  value={customPriceText}
                  onChange={(e) => setCustomPriceText(e.target.value)}
                  placeholder="Ex: A partir de R$ 8.900.000 (Tabela Zero)"
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <span className="block text-[11px] text-slate-400 mb-1">
                  Texto do Botão de WhatsApp
                </span>
                <input
                  type="text"
                  value={ctaWhatsAppText}
                  onChange={(e) => setCtaWhatsAppText(e.target.value)}
                  placeholder="Ex: Solicitar Apresentação em PDF"
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <span className="block text-[11px] text-slate-400 mb-1">
                URL Amigável (Slug da Landing Page)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">/lancamento/</span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="nome-do-empreendimento-vip"
                  className="flex-1 bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex justify-end">
            <button
              type="submit"
              disabled={isPublishing || !selectedDevId}
              className="px-8 py-3.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isPublishing ? 'Publicando...' : 'Publicar Landing Page Oficial'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* List of Published Landing Pages */}
      <div className="space-y-4">
        <h3 className="font-serif-luxury text-xl font-bold text-white">
          Landing Pages Ativas no Site ({landingPages.length})
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {landingPages.map((lp) => (
            <div
              key={lp.id}
              className="p-5 rounded-2xl glass-panel border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-serif-luxury text-base font-bold text-white">
                    {lp.headline}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300">
                    {lp.templateId}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-1">
                  Vinculada a: <strong className="text-slate-200">{lp.developmentTitle}</strong>
                </p>
                <div className="flex items-center gap-2 text-xs text-[#d4af37] font-mono">
                  <span>/lancamento/{lp.slug}</span>
                </div>
              </div>

              {/* Share & Open Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onOpenPublicLandingPage(lp.slug)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Visualizar</span>
                </button>

                <button
                  onClick={() => handleCopyLink(lp.slug)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white transition-colors"
                >
                  {copiedSlug === lp.slug ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedSlug === lp.slug ? 'Copiado!' : 'Copiar Link'}</span>
                </button>

                <button
                  onClick={() => {
                    const url = `${window.location.origin}/lancamento/${lp.slug}`;
                    const text = encodeURIComponent(
                      `Acesse a apresentação do lançamento ${lp.developmentTitle}:\n${url}`
                    );
                    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                  }}
                  className="p-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white transition-colors"
                  title="Compartilhar no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setQrModalPage(lp)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Gerar QR Code"
                >
                  <QrCode className="w-4 h-4 text-[#d4af37]" />
                </button>

                <button
                  onClick={() => handleDeleteLp(lp.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="Excluir Landing Page"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Modal */}
      {qrModalPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm p-6 rounded-3xl glass-panel-gold border border-[#d4af37] text-center">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-serif-luxury text-base font-bold text-white">QR Code Comercial</h4>
              <button onClick={() => setQrModalPage(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg mb-4">
              {/* High precision SVG QR representation */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                  `${window.location.origin}/lancamento/${qrModalPage.slug}`
                )}`}
                alt="QR Code da Landing Page"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-slate-300 font-mono mb-4 truncate">
              /lancamento/{qrModalPage.slug}
            </p>

            <button
              onClick={() => {
                handleCopyLink(qrModalPage.slug);
                setQrModalPage(null);
              }}
              className="w-full py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider"
            >
              Copiar Link da Página
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
