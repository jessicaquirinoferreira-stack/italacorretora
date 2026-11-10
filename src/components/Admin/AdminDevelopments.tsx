import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Sparkles,
  Check,
  X,
  Building,
  Image,
  MapPin,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { Development, PropertyType, PropertyStatus } from '../../types';
import { saveDevelopment, deleteDevelopment } from '../../lib/firestoreService';

interface AdminDevelopmentsProps {
  developments: Development[];
  onRefresh: () => void;
  onViewPublic: (slug: string) => void;
  onGenerateLandingPage: (dev: Development) => void;
}

export const AdminDevelopments: React.FC<AdminDevelopmentsProps> = ({
  developments,
  onRefresh,
  onViewPublic,
  onGenerateLandingPage,
}) => {
  const [editingDev, setEditingDev] = useState<Development | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form states for editor modal
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [developer, setDeveloper] = useState('');
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [startingPrice, setStartingPrice] = useState<number>(0);
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartamento');
  const [areaMin, setAreaMin] = useState<number>(100);
  const [areaMax, setAreaMax] = useState<number>(200);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [suites, setSuites] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(4);
  const [parkingSpots, setParkingSpots] = useState<number>(2);
  const [status, setStatus] = useState<PropertyStatus>('lancamento');
  const [deliveryForecast, setDeliveryForecast] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [galleryInput, setGalleryInput] = useState('');
  const [highlightsInput, setHighlightsInput] = useState('');
  const [description, setDescription] = useState('');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  const openNewForm = () => {
    setIsCreating(true);
    setEditingDev(null);
    setTitle('');
    setSubtitle('');
    setDeveloper('');
    setCity('São Paulo');
    setNeighborhood('Jardins');
    setAddress('');
    setStartingPrice(5000000);
    setPropertyType('Apartamento');
    setAreaMin(200);
    setAreaMax(350);
    setBedrooms(4);
    setSuites(4);
    setBathrooms(5);
    setParkingSpots(4);
    setStatus('lancamento');
    setDeliveryForecast('Dezembro / 2027');
    setCoverImage('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80');
    setGalleryInput('');
    setHighlightsInput('Piscina privativa\nElevador com biometria\nSpa assinado\nSegurança 24h blindada');
    setDescription('Empreendimento exclusivo de alto padrão com acabamentos nobres.');
    setFeatured(true);
    setPublished(true);
  };

  const openEditForm = (dev: Development) => {
    setEditingDev(dev);
    setIsCreating(false);
    setTitle(dev.title);
    setSubtitle(dev.subtitle || '');
    setDeveloper(dev.developer || '');
    setCity(dev.city);
    setNeighborhood(dev.neighborhood);
    setAddress(dev.address);
    setStartingPrice(dev.startingPrice);
    setPropertyType(dev.propertyType);
    setAreaMin(dev.areaMin);
    setAreaMax(dev.areaMax);
    setBedrooms(dev.bedrooms);
    setSuites(dev.suites);
    setBathrooms(dev.bathrooms);
    setParkingSpots(dev.parkingSpots);
    setStatus(dev.status);
    setDeliveryForecast(dev.deliveryForecast);
    setCoverImage(dev.coverImage);
    setGalleryInput((dev.gallery || []).join('\n'));
    setHighlightsInput((dev.highlights || []).join('\n'));
    setDescription(dev.description);
    setFeatured(dev.featured);
    setPublished(dev.published);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage('');

    try {
      const slug = (title || 'imovel')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const galleryUrls = galleryInput
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.startsWith('http'));

      const highlights = highlightsInput
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const devId = editingDev ? editingDev.id : `dev_${Date.now()}`;

      const devData: Development = {
        id: devId,
        title: title.trim(),
        slug,
        subtitle: subtitle.trim(),
        developer: developer.trim(),
        city: city.trim(),
        neighborhood: neighborhood.trim(),
        address: address.trim(),
        startingPrice: Number(startingPrice) || 0,
        propertyType,
        areaMin: Number(areaMin) || 0,
        areaMax: Number(areaMax) || 0,
        bedrooms: Number(bedrooms) || 0,
        suites: Number(suites) || 0,
        bathrooms: Number(bathrooms) || 0,
        parkingSpots: Number(parkingSpots) || 0,
        status,
        deliveryForecast: deliveryForecast.trim(),
        coverImage: coverImage.trim(),
        gallery: galleryUrls.length > 0 ? galleryUrls : [coverImage.trim()],
        floorPlans: editingDev?.floorPlans || [],
        highlights,
        description: description.trim(),
        featured,
        published,
        order: editingDev ? editingDev.order : developments.length + 1,
        createdAt: editingDev ? editingDev.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveDevelopment(devData);
      setSuccessMessage('Empreendimento salvo com sucesso no Firestore!');
      onRefresh();
      setTimeout(() => {
        setSuccessMessage('');
        setEditingDev(null);
        setIsCreating(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao salvar no Firestore. Verifique as regras de segurança.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async (dev: Development) => {
    const newDev: Development = {
      ...dev,
      id: `dev_${Date.now()}`,
      title: `${dev.title} (Cópia)`,
      slug: `${dev.slug}-copia`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveDevelopment(newDev);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDevelopment(id);
      setDeleteConfirmId(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            Empreendimentos & Vitrine
          </h2>
          <p className="text-xs text-slate-400">
            Cadastre, edite fotos, preços e gere landing pages personalizadas
          </p>
        </div>

        <button
          onClick={openNewForm}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Empreendimento</span>
        </button>
      </div>

      {/* Developments List Table / Cards */}
      <div className="grid grid-cols-1 gap-4">
        {developments.map((dev) => (
          <div
            key={dev.id}
            className="p-5 rounded-2xl glass-panel border border-white/[0.08] hover:border-[#d4af37]/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
          >
            {/* Left: Thumbnail & Info */}
            <div className="flex items-start sm:items-center gap-4">
              <img
                src={dev.coverImage}
                alt={dev.title}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-white/10"
              />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif-luxury text-base font-bold text-white">
                    {dev.title}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      dev.published
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {dev.published ? 'Publicado' : 'Rascunho'}
                  </span>
                  {dev.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37] text-[#0b0f17]">
                      Destaque
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>
                    {dev.neighborhood}, {dev.city} • {dev.propertyType}
                  </span>
                </div>

                <div className="text-xs text-[#fef08a] font-semibold">
                  A partir de {formatPrice(dev.startingPrice)}
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-white/5">
              <button
                onClick={() => onGenerateLandingPage(dev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#d4af37]/15 hover:bg-[#d4af37] text-[#fef08a] hover:text-[#0b0f17] text-xs font-semibold tracking-wider transition-colors border border-[#d4af37]/30"
                title="Criar Landing Page"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gerar Landing Page</span>
              </button>

              <button
                onClick={() => onViewPublic(dev.slug)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Visualizar Página Pública"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={() => openEditForm(dev)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Editar Empreendimento"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleDuplicate(dev)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Duplicar Cadastro"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={() => setDeleteConfirmId(dev.id)}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                title="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm p-6 rounded-2xl glass-panel-gold border border-rose-500/40 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-2">
              Confirmar Exclusão
            </h4>
            <p className="text-xs text-slate-300 mb-6">
              Deseja remover este empreendimento da vitrine? O histórico de leads vinculados será preservado.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {(isCreating || editingDev) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-3xl my-8 p-6 sm:p-8 rounded-3xl glass-panel-gold border border-[#d4af37]/40 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
              <h3 className="font-serif-luxury text-xl font-bold text-white">
                {editingDev ? `Editar: ${editingDev.title}` : 'Cadastrar Novo Empreendimento'}
              </h3>
              <button
                onClick={() => {
                  setEditingDev(null);
                  setIsCreating(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs mb-4 text-center">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 text-xs mb-4 text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Nome do Empreendimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Reserva Imperial Jardins"
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Incorporadora / Construtora
                  </label>
                  <input
                    type="text"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="Ex: Cyrela, Moura Dubeux..."
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Subtítulo / Chamada Comercial
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ex: Mansões suspensas com vista definitiva para o parque"
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Endereço Completo
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Av. República do Líbano, 1000"
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="Apartamento">Apartamento</option>
                    <option value="Cobertura">Cobertura</option>
                    <option value="Mansão">Mansão</option>
                    <option value="Casa em Condomínio">Casa em Condomínio</option>
                    <option value="Terreno">Terreno</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Status Comercial
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  >
                    <option value="lancamento">Lançamento</option>
                    <option value="em_obras">Em Obras</option>
                    <option value="pronto">Pronto para Morar</option>
                    <option value="oportunidade">Oportunidade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                    Valor a partir de (R$)
                  </label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                <div>
                  <label className="block text-[10px] font-cinzel uppercase text-slate-400 mb-1">
                    Área Mín (m²)
                  </label>
                  <input
                    type="number"
                    value={areaMin}
                    onChange={(e) => setAreaMin(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase text-slate-400 mb-1">
                    Área Máx (m²)
                  </label>
                  <input
                    type="number"
                    value={areaMax}
                    onChange={(e) => setAreaMax(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase text-slate-400 mb-1">
                    Quartos
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase text-slate-400 mb-1">
                    Suítes
                  </label>
                  <input
                    type="number"
                    value={suites}
                    onChange={(e) => setSuites(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase text-slate-400 mb-1">
                    Banheiros
                  </label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-cinzel uppercase text-slate-400 mb-1">
                    Vagas
                  </label>
                  <input
                    type="number"
                    value={parkingSpots}
                    onChange={(e) => setParkingSpots(Number(e.target.value))}
                    className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Foto de Capa (URL da Imagem) *
                </label>
                <input
                  type="text"
                  required
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Galeria de Fotos Adicionais (Uma URL por linha)
                </label>
                <textarea
                  rows={2}
                  value={galleryInput}
                  onChange={(e) => setGalleryInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1...&#10;https://images.unsplash.com/photo-2..."
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Diferenciais do Empreendimento (Um por linha)
                </label>
                <textarea
                  rows={3}
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  placeholder="Piscina com borda infinita&#10;Spa e Sauna seca&#10;Heliponto homologado"
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Descrição Completa
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <span>Destacar na Página Inicial</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="rounded text-[#d4af37] focus:ring-[#d4af37]"
                  />
                  <span>Publicado na Vitrine</span>
                </label>
              </div>

              {/* Submit / Cancel */}
              <div className="pt-4 border-t border-white/[0.08] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingDev(null);
                    setIsCreating(false);
                  }}
                  className="px-5 py-2.5 rounded-full text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Salvando...' : 'Salvar no Firestore'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
