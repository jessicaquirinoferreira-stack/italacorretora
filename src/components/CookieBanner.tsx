import React, { useState, useEffect } from 'react';
import { Shield, Check, X } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onOpenPrivacy }) => {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('ittala_cookies_accepted');
    if (!saved) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ittala_cookies_accepted', 'true');
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-in">
      <div className="p-5 rounded-2xl glass-panel-gold border border-[#d4af37]/40 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center shrink-0 text-[#fef08a] mt-0.5">
            <Shield className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h5 className="font-serif-luxury text-sm font-bold text-white mb-1">
              Privacidade & Cookies
            </h5>
            <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
              Utilizamos cookies essenciais para aprimorar sua experiência e garantir navegação segura em
              nossa vitrine de imóveis, em conformidade com a LGPD (Lei 13.709/2018).
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAccept}
                className="px-4 py-1.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider shadow"
              >
                Concordar & Continuar
              </button>
              <button
                onClick={onOpenPrivacy}
                className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2"
              >
                Ler Política
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
