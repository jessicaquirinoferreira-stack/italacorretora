import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  Sliders,
  BarChart3,
  ExternalLink,
  LogOut,
  KeyRound,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SiteSettings } from '../../types';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onViewSite: () => void;
  settings: SiteSettings;
  newLeadsCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onViewSite,
  settings,
  newLeadsCount,
  children,
}) => {
  const { logout, updateAdminPassword } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'developments', label: 'Empreendimentos', icon: Building },
    {
      id: 'leads',
      label: 'Contatos & Leads',
      icon: Users,
      badge: newLeadsCount > 0 ? newLeadsCount : undefined,
    },
    { id: 'landing_pages', label: 'Gerador de Landing Page', icon: FileText },
    { id: 'site_editor', label: 'Identidade & Conteúdos', icon: Sliders },
    { id: 'reports', label: 'Relatórios & Google', icon: BarChart3 },
  ];

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMessage('Mínimo 6 caracteres.');
      return;
    }
    const res = await updateAdminPassword(newPass);
    if (res.success) {
      setPassMessage('Senha atualizada com sucesso!');
      setTimeout(() => {
        setShowChangePassModal(false);
        setPassMessage('');
        setNewPass('');
      }, 1500);
    } else {
      setPassMessage(res.error || 'Erro ao alterar senha.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070a10] text-[#f8fafc] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#090d15] border-r border-white/[0.08] p-6 justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/[0.08] mb-6">
            <div className="w-10 h-10 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#d4af37]/20">
              <span className="font-cinzel text-base font-bold text-[#fef08a]">ID</span>
            </div>
            <div>
              <span className="font-serif-luxury text-sm font-bold text-white block">
                {settings.brokerName || 'Ittala Dias'}
              </span>
              <span className="font-cinzel text-[10px] tracking-wider text-[#d4af37] block">
                ADMINISTRAÇÃO INTERNA
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#d4af37]/20 text-[#fef08a] border border-[#d4af37]/40 shadow-md font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#fef08a]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37] text-[#0b0f17]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/[0.08] space-y-2">
          <button
            onClick={onViewSite}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-[#d4af37]" />
            <span>Ver Site Público</span>
          </button>

          <button
            onClick={() => setShowChangePassModal(true)}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors"
          >
            <KeyRound className="w-4 h-4 text-slate-500" />
            <span>Alterar Senha</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar for mobile toggle and quick actions */}
        <header className="h-16 bg-[#090d15]/80 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between lg:justify-end">
          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-serif-luxury text-sm font-bold text-white">
              Painel Ittala Dias
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onViewSite}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs text-slate-300 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Abrir Site Público</span>
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-[#090d15] border-b border-white/[0.08] p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs ${
                    currentTab === item.id
                      ? 'bg-[#d4af37]/20 text-[#fef08a] font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#d4af37] text-[#0b0f17]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-3 border-t border-white/10 flex justify-between text-xs">
              <button onClick={onViewSite} className="text-[#fef08a]">
                Ver Site
              </button>
              <button onClick={logout} className="text-rose-400">
                Sair
              </button>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>

      {/* Change Password Modal */}
      {showChangePassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm p-6 rounded-2xl glass-panel-gold border border-[#d4af37]">
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-2">Alterar Senha</h4>
            <p className="text-xs text-slate-300 mb-4">Digite sua nova senha de administrador:</p>

            {passMessage && (
              <div className="p-2.5 rounded-lg bg-white/10 text-xs text-center text-[#fef08a] mb-3">
                {passMessage}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <input
                type="password"
                required
                placeholder="Nova senha (mínimo 6 chars)"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full bg-[#0b0f17] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              />
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePassModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
