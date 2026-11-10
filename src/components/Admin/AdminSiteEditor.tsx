import React, { useState } from 'react';
import { Save, User, Shield, Phone, Mail, Instagram, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types';
import { saveSiteSettings } from '../../lib/firestoreService';

interface AdminSiteEditorProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSiteEditor: React.FC<AdminSiteEditorProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      await saveSiteSettings(formData);
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="font-serif-luxury text-2xl font-bold text-white">
          Identidade Visual & Conteúdo do Site
        </h2>
        <p className="text-xs text-slate-400">
          Personalize as informações públicas da corretora, redes sociais e textos da página inicial
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Configurações atualizadas com sucesso no Firestore!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Broker Identity */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08] space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#d4af37]" />
            <span>Dados da Corretora</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                Nome Profissional
              </label>
              <input
                type="text"
                value={formData.brokerName}
                onChange={(e) => setFormData({ ...formData, brokerName: e.target.value })}
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                Registro CRECI
              </label>
              <input
                type="text"
                value={formData.creci}
                onChange={(e) => setFormData({ ...formData, creci: e.target.value })}
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              Foto de Perfil (URL)
            </label>
            <input
              type="text"
              value={formData.photoUrl}
              onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              Biografia Curta (Exibida no rodapé e sobre)
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              Cidades e Regiões de Atuação
            </label>
            <input
              type="text"
              value={formData.cities}
              onChange={(e) => setFormData({ ...formData, cities: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* Contacts & Social Networks */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08] space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#d4af37]" />
            <span>Canais Oficiais & Redes Sociais</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                WhatsApp Oficial (Número com DDI e DDD)
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="5511998765432"
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                Telefone de Contato
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              E-mail Comercial
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://www.instagram.com/ittaladias.corretora/"
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
        </div>

        {/* Hero & Home Section Texts */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08] space-y-4">
          <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#d4af37]" />
            <span>Textos da Página Inicial (Hero Banner)</span>
          </h3>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              Título Principal do Banner
            </label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              Subtítulo do Banner
            </label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              Imagem de Fundo do Banner (URL)
            </label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
              Texto Completo: "Sobre a Corretora"
            </label>
            <textarea
              rows={4}
              value={formData.aboutText}
              onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
              className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
