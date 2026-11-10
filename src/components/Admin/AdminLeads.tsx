import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  MessageCircle,
  Mail,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building,
  UserCheck,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { updateLead, deleteLead } from '../../lib/firestoreService';

interface AdminLeadsProps {
  leads: Lead[];
  onRefresh: () => void;
  brokerWhatsApp?: string;
}

export const AdminLeads: React.FC<AdminLeadsProps> = ({ leads, onRefresh, brokerWhatsApp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus>('novo');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const statuses: { label: string; value: LeadStatus | 'todos'; color: string }[] = [
    { label: 'Todos', value: 'todos', color: 'bg-white/10 text-white' },
    { label: 'Novo', value: 'novo', color: 'bg-[#d4af37] text-[#0b0f17]' },
    { label: 'Em Atendimento', value: 'em_atendimento', color: 'bg-blue-500/20 text-blue-300' },
    { label: 'Interessado', value: 'interessado', color: 'bg-purple-500/20 text-purple-300' },
    { label: 'Visita Agendada', value: 'visita_agendada', color: 'bg-amber-500/20 text-amber-300' },
    { label: 'Proposta', value: 'proposta', color: 'bg-indigo-500/20 text-indigo-300' },
    { label: 'Convertido', value: 'convertido', color: 'bg-emerald-500/20 text-emerald-300' },
    { label: 'Perdido', value: 'perdido', color: 'bg-rose-500/20 text-rose-300' },
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.developmentTitle && lead.developmentTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'todos' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setNewStatus(lead.status);
    setEditingNotes(lead.notes || '');
  };

  const handleSaveLeadUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    setIsUpdating(true);
    try {
      await updateLead(selectedLead.id, {
        status: newStatus,
        notes: editingNotes,
      });
      setSelectedLead(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await deleteLead(leadId);
      setDeleteConfirmId(null);
      if (selectedLead?.id === leadId) setSelectedLead(null);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenWhatsAppChat = (lead: Lead) => {
    const cleanPhone = lead.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá, ${lead.name}! Sou a corretora Ittala Dias. Entro em contato referente ao seu interesse manifestado em nosso site imobiliário no empreendimento ${
        lead.developmentTitle || 'de alto padrão'
      }. Como posso lhe assessorar hoje?`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;
    const headers = [
      'Data',
      'Nome',
      'WhatsApp',
      'Email',
      'Empreendimento',
      'Faixa Investimento',
      'Status',
      'Origem',
      'Observações',
    ];

    const rows = leads.map((l) => [
      `"${new Date(l.createdAt).toLocaleString('pt-BR')}"`,
      `"${l.name}"`,
      `"${l.whatsapp}"`,
      `"${l.email || ''}"`,
      `"${l.developmentTitle || ''}"`,
      `"${l.investmentRange || ''}"`,
      `"${l.status}"`,
      `"${l.origin || ''}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_ittaladias_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-luxury text-2xl font-bold text-white">
            Caixa de Entrada de Leads & Clientes
          </h2>
          <p className="text-xs text-slate-400">
            Gerencie contatos recebidos pelo site, organize status e inicie conversas no WhatsApp com 1 clique
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={leads.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs text-white border border-white/10 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4 text-[#d4af37]" />
          <span>Exportar CSV ({filteredLeads.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/[0.08] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, fone, imóvel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b0f17] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => setStatusFilter(s.value)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                statusFilter === s.value
                  ? 'bg-[#d4af37] text-[#0b0f17] font-bold shadow'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table / Cards */}
      {filteredLeads.length > 0 ? (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="p-5 rounded-2xl glass-panel border border-white/[0.08] hover:border-[#d4af37]/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Lead details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif-luxury text-base font-bold text-white">
                    {lead.name}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      lead.status === 'novo'
                        ? 'bg-[#d4af37] text-[#0b0f17]'
                        : lead.status === 'convertido'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {lead.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(lead.createdAt).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="text-[#fef08a] font-semibold">{lead.whatsapp}</span>
                  {lead.email && <span className="text-slate-400">{lead.email}</span>}
                  {lead.investmentRange && (
                    <span className="text-slate-400">
                      Investimento: <strong className="text-white">{lead.investmentRange}</strong>
                    </span>
                  )}
                </div>

                {lead.developmentTitle && (
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>
                      Imóvel: <strong className="text-slate-200">{lead.developmentTitle}</strong>
                    </span>
                  </div>
                )}

                {lead.notes && (
                  <p className="text-xs text-amber-300/80 italic bg-amber-500/10 p-2 rounded-lg max-w-2xl">
                    Nota: {lead.notes}
                  </p>
                )}
              </div>

              {/* Lead action buttons */}
              <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/5">
                <button
                  onClick={() => handleOpenWhatsAppChat(lead)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Conversar no WhatsApp</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(lead)}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  Gerenciar / Notas
                </button>

                <button
                  onClick={() => setDeleteConfirmId(lead.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="Excluir Lead"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 p-8 glass-panel rounded-2xl border border-white/5">
          <UserCheck className="w-12 h-12 text-[#d4af37] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif-luxury text-lg font-bold text-white mb-1">
            Nenhum contato encontrado
          </h3>
          <p className="text-xs text-slate-400">
            Ajuste os filtros de busca ou aguarde novos cadastros através dos formulários públicos.
          </p>
        </div>
      )}

      {/* Edit Status & Notes Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel-gold border border-[#d4af37]/40 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div>
                <h4 className="font-serif-luxury text-lg font-bold text-white">
                  Gerenciar Lead: {selectedLead.name}
                </h4>
                <p className="text-xs text-slate-400">{selectedLead.whatsapp}</p>
              </div>
              <button onClick={() => setSelectedLead(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLeadUpdates} className="space-y-4">
              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Status de Atendimento
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                >
                  <option value="novo">Novo Contato (Pendente)</option>
                  <option value="em_atendimento">Em Atendimento</option>
                  <option value="interessado">Interessado / Qualificado</option>
                  <option value="visita_agendada">Visita Agendada</option>
                  <option value="proposta">Proposta Comercial Apresentada</option>
                  <option value="convertido">Convertido / Compra Concluída</option>
                  <option value="perdido">Perdido / Desistência</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-cinzel uppercase text-slate-300 mb-1">
                  Observações Internas da Corretora
                </label>
                <textarea
                  rows={4}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Ex: Cliente prefere visita no sábado de manhã. Busca cobertura acima de 300m²..."
                  className="w-full bg-[#0b0f17] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2 rounded-xl shimmer-gold-btn text-[#0b0f17] font-bold text-xs uppercase tracking-wider"
                >
                  {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm p-6 rounded-2xl glass-panel-gold border border-rose-500/40 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
            <h4 className="font-serif-luxury text-lg font-bold text-white mb-2">
              Excluir Lead
            </h4>
            <p className="text-xs text-slate-300 mb-6">
              Tem certeza de que deseja excluir este registro de contato? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteLead(deleteConfirmId)}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
