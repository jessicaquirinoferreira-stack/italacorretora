import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  MessageCircle,
  Instagram,
  ArrowRight,
  Shield,
  Building,
  UserCheck,
} from 'lucide-react';
import { SiteSettings, Development } from '../types';
import { GoogleGenAI } from '@google/genai';

interface VirtualAssistantProps {
  settings: SiteSettings;
  developments: Development[];
  onNavigateToProperty?: (slug: string) => void;
  onExploreVitrine?: () => void;
}

interface ChatAction {
  type: 'whatsapp' | 'instagram' | 'vitrine' | 'property';
  label: string;
  payload?: string;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
  actions?: ChatAction[];
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({
  settings,
  developments,
  onNavigateToProperty,
  onExploreVitrine,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Human avatar photo of the virtual executive concierge
  const assistantAvatar =
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80';

  const initialGreeting: ChatMessage = {
    id: 'welcome_1',
    sender: 'assistant',
    text: `Olá! Sou a Sofia, consultora virtual da corretora Ittala Dias. Estou à disposição para apresentar nossos empreendimentos exclusivos de alto padrão, esclarecer dúvidas e conectá-lo(a) diretamente à Ittala. Como posso te auxiliar hoje?`,
    timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    actions: [
      { type: 'vitrine', label: 'Explorar Lançamentos' },
      { type: 'whatsapp', label: 'Atendimento WhatsApp' },
      { type: 'instagram', label: 'Ver Instagram Oficial' },
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const quickQuestions = [
    'Quais são os lançamentos disponíveis?',
    'Atende em quais regiões?',
    'Como agendar uma visita privativa?',
    'Falar diretamente no WhatsApp',
    'Conhecer o Instagram da Ittala',
  ];

  const handleOpenWhatsApp = (customMsg?: string) => {
    const phone = settings.whatsapp || '5511998765432';
    const text = encodeURIComponent(
      customMsg ||
        'Olá, Ittala! Conversei com a assistente Sofia em seu site e gostaria de atendimento exclusivo para imóveis de alto padrão.'
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const handleOpenInstagram = () => {
    const url = settings.instagram || 'https://www.instagram.com/ittaladias.corretora/';
    window.open(url, '_blank');
  };

  // Generate Assistant Answer using Gemini or Instant Curated Knowledge
  const generateResponse = async (userText: string) => {
    const lower = userText.toLowerCase();

    // Check if user specifically asks about WhatsApp or Instagram
    if (lower.includes('whatsapp') || lower.includes('zap') || lower.includes('falar com ela') || lower.includes('telefone')) {
      return {
        text: `Com certeza! O canal mais ágil e confidencial de atendimento com a Ittala Dias é pelo WhatsApp oficial. Clique no botão abaixo para iniciar a conversa agora mesmo:`,
        actions: [
          { type: 'whatsapp' as const, label: 'Abrir WhatsApp de Ittala' },
          { type: 'instagram' as const, label: 'Ver Instagram' },
        ],
      };
    }

    if (lower.includes('instagram') || lower.includes('insta') || lower.includes('perfil') || lower.includes('rede social')) {
      return {
        text: `Você pode acompanhar os bastidores, tours em vídeo e novidades no perfil oficial do Instagram @ittaladias.corretora. Siga pelo link abaixo:`,
        actions: [
          { type: 'instagram' as const, label: 'Acessar Instagram @ittaladias.corretora' },
          { type: 'whatsapp' as const, label: 'Falar no WhatsApp' },
        ],
      };
    }

    if (lower.includes('regi') || lower.includes('cidade') || lower.includes('bairro') || lower.includes('onde')) {
      return {
        text: `A corretora Ittala Dias é especializada nas regiões mais nobres de São Paulo (Jardins, Vila Nova Conceição, Itaim Bibi, Moema, Alphaville/Tamboré) e em destinos de praia exclusivos como a Riviera de São Lourenço. Em qual dessas localizações você tem interesse?`,
        actions: [
          { type: 'whatsapp' as const, label: 'Consultar Imóveis na Região' },
          { type: 'vitrine' as const, label: 'Ver Vitrine de Imóveis' },
        ],
      };
    }

    if (lower.includes('visita') || lower.includes('agendar') || lower.includes('marcar') || lower.includes('conhecer')) {
      return {
        text: `Para garantir sigilo e dedicação total, as visitas técnicas aos decorados e imóveis prontos são agendadas previamente com a Ittala. Você pode solicitar um horário conveniente diretamente no WhatsApp:`,
        actions: [
          { type: 'whatsapp' as const, label: 'Agendar Visita com Ittala' },
        ],
      };
    }

    if (lower.includes('lançamento') || lower.includes('imóve') || lower.includes('empreendimento') || lower.includes('preço') || lower.includes('valor')) {
      const devNames = developments.map((d) => d.title).join(', ');
      return {
        text: `Temos empreendimentos extraordinários em carteira, incluindo opções exclusivas como ${devNames}. As unidades contam com metragens amplas de 185m² a mais de 1.100m² e condições especiais na planta ou prontos para morar. Posso te direcionar para a vitrine ou enviar a tabela no WhatsApp!`,
        actions: [
          { type: 'vitrine' as const, label: 'Ver Empreendimentos' },
          { type: 'whatsapp' as const, label: 'Receber Tabelas no WhatsApp' },
        ],
      };
    }

    // Attempt Gemini call if API key exists in environment
    try {
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const devContext = developments
          .map(
            (d) =>
              `- ${d.title} (${d.neighborhood}, ${d.city}): ${d.propertyType}, ${d.areaMin}-${d.areaMax}m², a partir de R$ ${d.startingPrice.toLocaleString('pt-BR')}`
          )
          .join('\n');

        const systemInstruction = `Você é Sofia, a assistente virtual e concierge da corretora de imóveis de alto padrão Ittala Dias (Instagram: @ittaladias.corretora).
Seu tom é extremamente educado, sofisticado, cordial, conciso e acolhedor.
Responda em português com 2 a 3 frases no máximo.
Informações da corretora:
- Nome: Ittala Dias (${settings.creci || 'CRECI 12.840-F'})
- Regiões: ${settings.cities || 'São Paulo, Jardins, Vila Nova Conceição, Alphaville, Riviera'}
- Empreendimentos disponíveis:
${devContext}
Sempre convide o cliente a continuar o atendimento de forma personalizada no WhatsApp da Ittala ou a acompanhar o Instagram.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: userText,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        });

        if (response.text) {
          return {
            text: response.text,
            actions: [
              { type: 'whatsapp' as const, label: 'Continuar no WhatsApp' },
              { type: 'instagram' as const, label: 'Ver Instagram' },
            ],
          };
        }
      }
    } catch {
      // Fallback seamlessly to the standard concierge response
    }

    return {
      text: `Excelente pergunta! Cada negociação de alto padrão conta com aspectos jurídicos, plantas e tabelas personalizadas que a corretora Ittala Dias apresenta com total confidencialidade. Gostaria de receber essas informações no WhatsApp ou prefere explorar a vitrine?`,
      actions: [
        { type: 'whatsapp' as const, label: 'Falar no WhatsApp com Ittala' },
        { type: 'vitrine' as const, label: 'Explorar Vitrine de Imóveis' },
        { type: 'instagram' as const, label: 'Acessar Instagram' },
      ],
    };
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);
    setHasInteracted(true);

    setTimeout(async () => {
      const reply = await generateResponse(textToSend);
      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: reply.text,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        actions: reply.actions,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleActionClick = (action: ChatAction) => {
    if (action.type === 'whatsapp') {
      handleOpenWhatsApp();
    } else if (action.type === 'instagram') {
      handleOpenInstagram();
    } else if (action.type === 'vitrine') {
      setIsOpen(false);
      if (onExploreVitrine) {
        onExploreVitrine();
      } else {
        document.getElementById('empreendimentos-vitrine')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 pointer-events-auto">
      {/* Floating Pill Trigger on the bottom-left */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setHasInteracted(true);
          }}
          className="group relative flex items-center gap-3 p-2 pr-5 rounded-full glass-panel-gold border border-[#d4af37]/50 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
          aria-label="Falar com a Assistente Virtual"
        >
          {/* Real Human Portrait Avatar */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#d4af37] shadow-md shrink-0">
            <img
              src={assistantAvatar}
              alt="Sofia — Consultora Virtual"
              className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
            />
            {/* Green Online Dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0b0f17] shadow-sm animate-pulse" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-serif-luxury text-xs font-bold text-white group-hover:text-[#fef08a] transition-colors">
                Sofia
              </span>
            </div>
            <span className="text-[10px] text-slate-300 block font-light">
              Consultora Virtual
            </span>
          </div>

          {/* Pulse notification badge if not opened yet */}
          {!hasInteracted && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#d4af37] border-2 border-[#0b0f17] animate-ping" />
          )}
        </button>
      )}

      {/* Floating Chat Dialog Window */}
      {isOpen && (
        <div className="relative w-[340px] sm:w-[380px] h-[520px] rounded-3xl glass-panel-gold border border-[#d4af37]/50 shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-[#090d15]/90 border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#d4af37] shrink-0">
                <img
                  src={assistantAvatar}
                  alt="Sofia — Consultora Virtual"
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0b0f17]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif-luxury text-sm font-bold text-white">Sofia</h4>
                  <span className="text-[10px] font-cinzel text-[#d4af37]">Concierge</span>
                </div>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online para te atender</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Fechar Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#d4af37] text-[#0b0f17] font-medium rounded-tr-sm'
                      : 'glass-panel text-slate-200 border border-white/10 rounded-tl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                {/* Optional Action Buttons inside assistant reply */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {msg.actions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold transition-transform hover:scale-105 active:scale-95 ${
                          act.type === 'whatsapp'
                            ? 'bg-[#25D366] text-white shadow-md'
                            : act.type === 'instagram'
                            ? 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white shadow-md'
                            : 'bg-white/10 text-[#fef08a] border border-[#d4af37]/40'
                        }`}
                      >
                        {act.type === 'whatsapp' && <MessageCircle className="w-3 h-3 fill-white" />}
                        {act.type === 'instagram' && <Instagram className="w-3 h-3" />}
                        {act.type === 'vitrine' && <Building className="w-3 h-3 text-[#d4af37]" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl glass-panel max-w-[70px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Pills */}
          <div className="p-2 px-3 border-t border-white/[0.05] bg-[#090d15]/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-slate-300 hover:text-white border border-white/5 shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputMessage);
            }}
            className="p-3 bg-[#090d15] border-t border-white/[0.08] flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Digite sua dúvida aqui..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-xl shimmer-gold-btn text-[#0b0f17] font-bold transition-all disabled:opacity-40"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
