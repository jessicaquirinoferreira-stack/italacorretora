import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle, Shield, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveLead, logAnalyticsEvent } from '../lib/firestoreService';
import { Development } from '../types';

interface LeadFormProps {
  development?: Development;
  origin?: string;
  onSuccess?: () => void;
  brokerWhatsApp?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  development,
  origin = 'site_institucional',
  onSuccess,
  brokerWhatsApp = '5511998765432',
}) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [investmentRange, setInvestmentRange] = useState('');
  const [message, setMessage] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 9) {
      value = `${value.slice(0, 9)}-${value.slice(9)}`;
    }
    setWhatsapp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      setErrorMessage('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }
    if (!lgpdConsent) {
      setErrorMessage('Por favor, confirme seu consentimento para contato (LGPD).');
      return;
    }

    setIsSubmitting(true);

    try {
      await saveLead({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        developmentId: development?.id || undefined,
        developmentTitle: development?.title || undefined,
        investmentRange: investmentRange || undefined,
        message: message.trim() || undefined,
        origin,
        pageUrl: window.location.href,
        status: 'novo',
        lgpdConsent: true,
      });

      // Track event
      await logAnalyticsEvent({
        eventType: 'form_submit',
        pageUrl: window.location.href,
        developmentId: development?.id,
      });

      // Golden celebration confetti
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#fef08a', '#ffffff', '#e2e8f0'],
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Erro ao cadastrar lead:', err);
      setErrorMessage('Ocorreu uma falha temporária. Por favor, tente pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDirectWhatsApp = () => {
    const cleanPhone = brokerWhatsApp.replace(/\D/g, '') || '5511998765432';
    const text = encodeURIComponent(
      `Olá, Ittala! Meu nome é ${name || 'um cliente interessado'}. Acabei de enviar meus dados no site a respeito do empreendimento ${
        development?.title || 'de alto padrão'
      } e gostaria de atendimento prioritário.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl glass-panel-gold text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto mb-4 text-[#fef08a]">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="font-serif-luxury text-2xl font-bold text-white mb-2">
          Recebemos sua Solicitação!
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto mb-6">
          Obrigado, <strong className="text-white">{name}</strong>. A corretora Ittala Dias entrará
          em contato de maneira confidencial e personalizada.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleOpenDirectWhatsApp}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Falar Agora no WhatsApp</span>
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
              setName('');
              setWhatsapp('');
              setEmail('');
              setMessage('');
            }}
            className="text-xs text-slate-400 hover:text-white underline underline-offset-4 py-2"
          >
            Enviar outra solicitação
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl glass-panel border border-white/10 space-y-4">
      {development && (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-xs text-slate-300 mb-2">
          <div>
            <span className="text-[10px] uppercase font-cinzel text-[#d4af37] block">Interesse no Empreendimento:</span>
            <span className="font-serif-luxury font-bold text-white text-sm">{development.title}</span>
          </div>
          <span className="text-[11px] text-[#fef08a] font-semibold">{development.neighborhood}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center">
          {errorMessage}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-300 mb-1">
          Nome Completo *
        </label>
        <input
          type="text"
          required
          placeholder="Ex: Carlos Eduardo Silveira"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
        />
      </div>

      {/* WhatsApp & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-300 mb-1">
            WhatsApp / Celular com DDD *
          </label>
          <input
            type="text"
            required
            placeholder="(11) 99999-9999"
            value={whatsapp}
            onChange={handlePhoneChange}
            className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-300 mb-1">
            E-mail Profissional
          </label>
          <input
            type="email"
            placeholder="carlos@exemplo.com.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>
      </div>

      {/* Investment Range */}
      <div>
        <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-300 mb-1">
          Faixa Pretendida de Investimento
        </label>
        <select
          value={investmentRange}
          onChange={(e) => setInvestmentRange(e.target.value)}
          className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
        >
          <option value="">Selecione a faixa aproximada</option>
          <option value="Ate 5M">Até R$ 5.000.000</option>
          <option value="5M a 10M">R$ 5.000.000 a R$ 10.000.000</option>
          <option value="10M a 20M">R$ 10.000.000 a R$ 20.000.000</option>
          <option value="Acima de 20M">Acima de R$ 20.000.000</option>
          <option value="Indiferente / Oportunidade">Oportunidade Específica</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-300 mb-1">
          Mensagem ou Detalhes de Interesse (Opcional)
        </label>
        <textarea
          rows={3}
          placeholder="Descreva detalhes específicos de planta, data de visita pretendida ou preferências..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
        />
      </div>

      {/* LGPD Consent Checkbox */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-400">
          <input
            type="checkbox"
            checked={lgpdConsent}
            onChange={(e) => setLgpdConsent(e.target.checked)}
            className="mt-0.5 rounded border-white/20 text-[#d4af37] focus:ring-[#d4af37] bg-[#0b0f17]"
          />
          <span className="text-[11px] leading-relaxed">
            Autorizo a corretora Ittala Dias a entrar em contato via WhatsApp e e-mail de acordo com a{' '}
            <strong className="text-slate-300">Lei Geral de Proteção de Dados (LGPD)</strong>.
            Seus dados são confidenciais e jamais serão compartilhados com terceiros.
          </span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSubmitting ? (
          <span>Enviando com segurança...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Solicitar Apresentação Exclusiva</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 pt-2 text-[10px] text-slate-500">
        <Shield className="w-3.5 h-3.5 text-[#d4af37]" />
        <span>Garantia de Sigilo & Atendimento Direto por Ittala Dias</span>
      </div>
    </form>
  );
};
