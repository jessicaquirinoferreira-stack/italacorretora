import React from 'react';
import { X, ShieldCheck, Lock } from 'lucide-react';
import { SiteSettings } from '../types';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SiteSettings;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl glass-panel border border-white/10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-serif-luxury text-lg font-bold text-white">
              Política de Privacidade & Proteção de Dados (LGPD)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-light">
          <p>
            Esta Política de Privacidade descreve de que forma a assessoria imobiliária{' '}
            <strong className="text-white">{settings.brokerName || 'Ittala Dias'}</strong>{' '}
            ({settings.creci || 'CRECI 12.840-F / SP'}) coleta, armazena, utiliza e protege os dados
            pessoais de seus clientes e usuários, em total conformidade com a Lei Geral de Proteção de
            Dados Pessoais (Lei nº 13.709/2018 - LGPD).
          </p>

          <h4 className="font-serif-luxury text-sm font-semibold text-white pt-2">
            1. Dados Coletados e Finalidade
          </h4>
          <p>
            Coletamos apenas os dados expressamente informados por você em nossos formulários de
            interesse: nome completo, telefone/WhatsApp, e-mail e preferências imobiliárias. Esses
            dados têm por única finalidade o retorno ao seu contato comercial, agendamento de visitas
            técnicas e envio de apresentações e tabelas de empreendimentos solicitados.
          </p>

          <h4 className="font-serif-luxury text-sm font-semibold text-white pt-2">
            2. Confidencialidade e Não Compartilhamento
          </h4>
          <p>
            A corretora Ittala Dias assume o compromisso de confidencialidade estrita. Seus dados
            jamais serão vendidos, alugados, cedidos ou compartilhados com terceiros sem sua autorização
            prévia e formal.
          </p>

          <h4 className="font-serif-luxury text-sm font-semibold text-white pt-2">
            3. Segurança e Armazenamento
          </h4>
          <p>
            Todas as informações recebidas são protegidas por protocolos de criptografia em trânsito e
            armazenadas em servidores seguros com controle de acesso rigoroso via Firebase Cloud
            Firestore.
          </p>

          <h4 className="font-serif-luxury text-sm font-semibold text-white pt-2">
            4. Direitos do Titular de Dados
          </h4>
          <p>
            Você possui o direito de confirmar a existência de tratamento, solicitar correção de dados
            incompletos ou requerer a exclusão definitiva de seus dados de nossa base de contatos a
            qualquer momento.
          </p>

          <h4 className="font-serif-luxury text-sm font-semibold text-white pt-2">
            5. Encarregado de Proteção de Dados (DPO) e Contato
          </h4>
          <p>
            Para exercer qualquer um de seus direitos ou esclarecer dúvidas sobre esta política, entre em
            contato diretamente pelo e-mail{' '}
            <strong className="text-[#fef08a]">{settings.email || 'contato@ittaladias.com.br'}</strong> ou
            via WhatsApp oficial.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
