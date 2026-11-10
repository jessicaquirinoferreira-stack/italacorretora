import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  Bed,
  Bath,
  Car,
  Calendar,
  Share2,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Building2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Development, SiteSettings } from '../types';
import { LeadForm } from './LeadForm';
import { PropertyCard } from './PropertyCard';
import { logAnalyticsEvent } from '../lib/firestoreService';

interface PropertyDetailPageProps {
  development: Development;
  allDevelopments: Development[];
  settings: SiteSettings;
  onBack: () => void;
  onSelectDevelopment: (dev: Development) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  development,
  allDevelopments,
  settings,
  onBack,
  onSelectDevelopment,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeFloorPlanIndex, setActiveFloorPlanIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareFeedback, setShareFeedback] = useState('');

  const allImages = [
    development.coverImage,
    ...(development.gallery || []).filter((img) => img !== development.coverImage),
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    logAnalyticsEvent({
      eventType: 'page_view',
      pageUrl: window.location.href,
      developmentId: development.id,
    });
  }, [development.id]);

  const formatPrice = (price: number) => {
    if (!price || price === 0) return 'Sob Consulta';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Conheça o empreendimento exclusivo ${development.title} apresentado por Ittala Dias:\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleShareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleDirectWhatsAppInquiry = () => {
    const phone = settings.whatsapp || '5511998765432';
    const text = encodeURIComponent(
      `Olá, Ittala! Gostaria de mais informações e agendar uma apresentação privada do empreendimento: ${development.title}.`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const relatedDevelopments = allDevelopments
    .filter((d) => d.id !== development.id && d.published)
    .slice(0, 3);

  return (
    <div className="pt-24 pb-24 min-h-screen">
      {/* Top Breadcrumb & Back bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-300 hover:text-[#fef08a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Vitrine</span>
          </button>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline text-[11px] font-cinzel">Compartilhar:</span>
            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-full bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 transition-colors"
              title="Compartilhar no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={handleShareLinkedIn}
              className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors"
              title="Compartilhar no LinkedIn"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/10 transition-colors text-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Gallery & Main Content Left (8 cols), Sticky Form Right (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Gallery Cinema Frame */}
            <div className="space-y-4">
              <div className="relative h-[380px] sm:h-[500px] w-full rounded-2xl overflow-hidden glass-panel border border-white/10 bg-slate-950 shadow-2xl">
                <img
                  src={allImages[activeImageIndex] || development.coverImage}
                  alt={development.title}
                  className="w-full h-full object-cover object-center transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17]/70 via-transparent to-transparent pointer-events-none" />

                {/* Left/Right Gallery Nav */}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0b0f17]/80 hover:bg-[#d4af37] text-white hover:text-[#0b0f17] backdrop-blur-md border border-white/10 transition-all"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#0b0f17]/80 hover:bg-[#d4af37] text-white hover:text-[#0b0f17] backdrop-blur-md border border-white/10 transition-all"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Counter Badge */}
                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-md bg-[#0b0f17]/80 backdrop-blur-md border border-white/10 text-[11px] font-cinzel text-slate-300">
                  {activeImageIndex + 1} / {allImages.length}
                </div>
              </div>

              {/* Thumbnails row */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx
                          ? 'border-[#d4af37] scale-105 shadow-md shadow-[#d4af37]/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Development Header Info */}
            <div className="border-b border-white/[0.08] pb-8">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-cinzel font-semibold uppercase tracking-wider bg-[#d4af37]/15 text-[#fef08a] border border-[#d4af37]/30">
                  {development.propertyType}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-cinzel uppercase tracking-wider bg-white/[0.05] text-slate-300 border border-white/10">
                  {development.status === 'lancamento'
                    ? 'Lançamento'
                    : development.status === 'em_obras'
                    ? 'Em Obras'
                    : development.status === 'pronto'
                    ? 'Pronto para Morar'
                    : 'Oportunidade'}
                </span>
                {development.developer && (
                  <span className="text-xs text-slate-400">
                    Incorporação por <strong className="text-slate-200">{development.developer}</strong>
                  </span>
                )}
              </div>

              <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white mb-3">
                {development.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-slate-300 mb-6">
                <MapPin className="w-4 h-4 text-[#d4af37]" />
                <span>
                  {development.address}, {development.neighborhood} — {development.city}
                </span>
              </div>

              {/* Technical Specifications Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl glass-panel-gold">
                <div>
                  <span className="block text-[10px] font-cinzel uppercase text-slate-400">Área Privativa</span>
                  <span className="font-serif-luxury text-lg font-bold text-white">
                    {development.areaMin}
                    {development.areaMax && development.areaMax !== development.areaMin
                      ? ` a ${development.areaMax}`
                      : ''}{' '}
                    m²
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-cinzel uppercase text-slate-400">Dormitórios / Suítes</span>
                  <span className="font-serif-luxury text-lg font-bold text-white">
                    {development.bedrooms} quartos ({development.suites} suítes)
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-cinzel uppercase text-slate-400">Vagas de Garagem</span>
                  <span className="font-serif-luxury text-lg font-bold text-white">
                    {development.parkingSpots} vagas
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-cinzel uppercase text-slate-400">Previsão de Entrega</span>
                  <span className="font-serif-luxury text-lg font-bold text-[#fef08a]">
                    {development.deliveryForecast || 'Sob Consulta'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Sobre o Empreendimento
              </h3>
              <div className="text-sm leading-relaxed text-slate-300 space-y-4 font-light">
                <p>{development.description}</p>
              </div>
            </div>

            {/* Highlights & Differentials */}
            {development.highlights && development.highlights.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Diferenciais & Lazer Exclusivo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {development.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Floor Plans (Plantas) */}
            {development.floorPlans && development.floorPlans.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif-luxury text-2xl font-bold text-white">
                    Plantas & Tipologias
                  </h3>
                  <span className="text-xs text-[#d4af37] font-cinzel">
                    {development.floorPlans.length} Opção(ões) de Planta
                  </span>
                </div>

                <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-4">
                  {/* Floor plans switcher */}
                  <div className="flex flex-wrap gap-2">
                    {development.floorPlans.map((plan, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFloorPlanIndex(idx)}
                        className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                          activeFloorPlanIndex === idx
                            ? 'bg-[#d4af37] text-[#0b0f17] font-bold shadow-md shadow-[#d4af37]/20'
                            : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
                        }`}
                      >
                        {plan.title}
                      </button>
                    ))}
                  </div>

                  {development.floorPlans[activeFloorPlanIndex] && (
                    <div className="mt-4 space-y-3">
                      <div className="relative h-72 sm:h-96 w-full rounded-xl overflow-hidden bg-slate-900 border border-white/10">
                        <img
                          src={development.floorPlans[activeFloorPlanIndex].imageUrl}
                          alt={development.floorPlans[activeFloorPlanIndex].title}
                          className="w-full h-full object-contain p-4"
                        />
                      </div>
                      <p className="text-xs text-slate-300 text-center font-cinzel">
                        {development.floorPlans[activeFloorPlanIndex].area}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location & Neighborhood */}
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Localização Privilegiada
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                Situado em um dos endereços mais valorizados e estratégicos: {development.address}, bairro {development.neighborhood}, {development.city}. Região cercada por gastronomia de ponta, conveniências nobres, colégios de excelência e fácil acesso aos principais eixos da cidade.
              </p>
            </div>
          </div>

          {/* Right Column: Sticky Pricing & Lead Capture Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Pricing & Direct WhatsApp Box */}
              <div className="p-6 rounded-2xl glass-panel-gold space-y-5">
                <div>
                  <span className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-400">
                    Valor de Investimento
                  </span>
                  <div className="font-serif-luxury text-3xl font-bold text-[#fef08a] mt-1">
                    {formatPrice(development.startingPrice)}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    *Consulte tabela atualizada e condições especiais de pagamento.
                  </span>
                </div>

                <button
                  onClick={handleDirectWhatsAppInquiry}
                  className="w-full py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Atendimento VIP via WhatsApp</span>
                </button>

                <div className="pt-2 border-t border-white/[0.08] flex items-center gap-3">
                  <img
                    src={settings.photoUrl}
                    alt={settings.brokerName}
                    className="w-12 h-12 rounded-full object-cover border border-[#d4af37]"
                  />
                  <div className="text-xs">
                    <span className="block font-serif-luxury font-bold text-white">
                      {settings.brokerName || 'Ittala Dias'}
                    </span>
                    <span className="text-[10px] text-[#d4af37] font-cinzel">
                      {settings.creci || 'CRECI 12.840-F / SP'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lead Capture Form Card */}
              <div>
                <h4 className="font-serif-luxury text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>Agendar Apresentação Privativa</span>
                </h4>
                <LeadForm
                  development={development}
                  origin={`pagina_${development.slug}`}
                  brokerWhatsApp={settings.whatsapp}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Related Developments */}
        {relatedDevelopments.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/[0.08]">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
              Outras Oportunidades Selecionadas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedDevelopments.map((dev) => (
                <PropertyCard
                  key={dev.id}
                  development={dev}
                  onSelect={onSelectDevelopment}
                  onInquireWhatsApp={() => {
                    const phone = settings.whatsapp || '5511998765432';
                    window.open(
                      `https://wa.me/${phone}?text=${encodeURIComponent(
                        `Olá, Ittala! Gostaria de informações do empreendimento ${dev.title}`
                      )}`,
                      '_blank'
                    );
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
