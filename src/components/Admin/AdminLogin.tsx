import React, { useState } from 'react';
import { Lock, Mail, KeyRound, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBackToSite: () => void;
  onSuccess: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite, onSuccess }) => {
  const { login, isInitialPassword, updateAdminPassword } = useAuth();
  const [email, setEmail] = useState('admin@x.com');
  const [password, setPassword] = useState('admin4321');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // New password modal when first logging in with temporary password
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePassError, setChangePassError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (password === 'admin4321') {
          setShowPasswordChangeModal(true);
        } else {
          onSuccess();
        }
      } else {
        setError(result.error || 'Credenciais inválidas. Verifique o e-mail e senha.');
      }
    } catch (err: unknown) {
      setError('Erro de autenticação no Firebase.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError('');

    if (newPassword.length < 6) {
      setChangePassError('A nova senha deve possuir pelo menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePassError('As senhas digitadas não coincidem.');
      return;
    }
    if (newPassword === 'admin4321') {
      setChangePassError('A nova senha não pode ser igual à senha temporária inicial.');
      return;
    }

    const res = await updateAdminPassword(newPassword);
    if (res.success) {
      setShowPasswordChangeModal(false);
      onSuccess();
    } else {
      setChangePassError(res.error || 'Erro ao redefinir senha.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-[#070a10]">
      {/* Background illumination */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d4af37]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Back to site link */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Site Público</span>
        </button>

        <div className="p-8 sm:p-10 rounded-3xl glass-panel-gold border border-[#d4af37]/40 shadow-2xl backdrop-blur-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-[#d4af37]/25 to-transparent">
              <span className="font-cinzel text-xl font-bold text-[#fef08a]">ID</span>
            </div>
            <h2 className="font-serif-luxury text-2xl font-bold text-white">
              Painel Administrativo
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Ittala Dias Corretora — Gestão Interna de Conteúdos & Leads
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-300 mb-1.5">
                E-mail de Administrador
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@x.com"
                  className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-cinzel uppercase tracking-wider text-slate-300 mb-1.5">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] transition-colors"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-slate-400">
              <span className="text-[#fef08a] font-semibold block mb-0.5">Acesso Seguro:</span>
              Credenciais iniciais configuradas: <code className="text-white">admin@x.com</code> / <code className="text-white">admin4321</code>. Troca de senha solicitada no primeiro login.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-widest transition-transform hover:scale-[1.02] shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2 mt-6 disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Validando...' : 'Entrar no Painel'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Mandatory Password Change Modal on First Access */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-8 rounded-3xl glass-panel-gold border border-[#d4af37] shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center mx-auto mb-4 text-[#fef08a]">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <h3 className="font-serif-luxury text-xl font-bold text-white text-center mb-1">
              Troca Obrigatória de Senha
            </h3>
            <p className="text-xs text-slate-300 text-center leading-relaxed mb-6">
              Por razões de segurança institucional e proteção dos dados dos clientes, redefina a senha inicial temporária.
            </p>

            {changePassError && (
              <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs mb-4">
                {changePassError}
              </div>
            )}

            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Nova Senha Pessoal *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Confirmar Nova Senha *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0b0f17]/90 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-widest mt-4"
              >
                Salvar Nova Senha & Acessar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
