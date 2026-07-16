/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, MessageSquare, Trash2, CheckCircle2, AlertCircle, FileSpreadsheet, Plus, HelpCircle, PhoneCall } from 'lucide-react';
import { Company, CRMStage } from '../types';

interface CRMBoardProps {
  companies: Company[];
  onMoveStage: (companyId: string, currentStage: CRMStage, direction: 'forward' | 'backward') => void;
  onUpdateNotes: (companyId: string, notes: string) => void;
  onRemoveFromCrm: (companyId: string) => void;
  onSelectCompany: (company: Company) => void;
}

const STAGE_CONFIGS: Record<CRMStage, { label: string; color: string; bg: string; border: string; text: string }> = {
  [CRMStage.IDENTIFIED]: {
    label: 'Identificado',
    color: 'slate',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700'
  },
  [CRMStage.INITIAL_CONTACT]: {
    label: 'Contato Inicial',
    color: 'blue',
    bg: 'bg-blue-50/70',
    border: 'border-blue-200',
    text: 'text-blue-700'
  },
  [CRMStage.AUDIT_SENT]: {
    label: 'Auditoria Enviada',
    color: 'amber',
    bg: 'bg-amber-50/70',
    border: 'border-amber-200',
    text: 'text-amber-700'
  },
  [CRMStage.NEGOTIATING]: {
    label: 'Em Negociação',
    color: 'indigo',
    bg: 'bg-indigo-50/70',
    border: 'border-indigo-200',
    text: 'text-indigo-700'
  },
  [CRMStage.CLOSED_WON]: {
    label: 'Fechado (Ganho)',
    color: 'emerald',
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    text: 'text-emerald-700'
  },
  [CRMStage.CLOSED_LOST]: {
    label: 'Perdido',
    color: 'rose',
    bg: 'bg-rose-50/70',
    border: 'border-rose-200',
    text: 'text-rose-700'
  }
};

const STAGE_ORDER: CRMStage[] = [
  CRMStage.IDENTIFIED,
  CRMStage.INITIAL_CONTACT,
  CRMStage.AUDIT_SENT,
  CRMStage.NEGOTIATING,
  CRMStage.CLOSED_WON
];

export default function CRMBoard({ companies, onMoveStage, onUpdateNotes, onRemoveFromCrm, onSelectCompany }: CRMBoardProps) {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesTempText, setNotesTempText] = useState('');

  const crmCompanies = companies.filter(c => c.crmStage !== undefined);

  const getCompaniesInStage = (stage: CRMStage) => {
    return crmCompanies.filter(c => c.crmStage === stage);
  };

  const handleStartEditingNotes = (company: Company) => {
    setEditingNotesId(company.id);
    setNotesTempText(company.notes || '');
  };

  const handleSaveNotes = (companyId: string) => {
    onUpdateNotes(companyId, notesTempText);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6" id="crm-board-panel">
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            Funil de Prospecção & CRM B2B
          </h2>
          <p className="text-sm text-slate-500">
            Acompanhe o progresso de fechamento dos seus leads ativos do Google Meu Negócio.
          </p>
        </div>
        <div className="flex gap-4 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
            Ativos: <strong className="text-slate-900">{crmCompanies.length}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            Ganhos: <strong className="text-slate-900">{getCompaniesInStage(CRMStage.CLOSED_WON).length}</strong>
          </div>
        </div>
      </div>

      {crmCompanies.length === 0 ? (
        <div className="bg-white border border-slate-150 rounded-xl p-12 text-center max-w-xl mx-auto">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3 animate-bounce" />
          <h4 className="font-semibold text-slate-800 text-base">Seu Funil Comercial está vazio!</h4>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed">
            Busque empresas na aba <strong>"Buscador de Leads"</strong> e clique em <strong>"+ Prospectar"</strong> para adicionar seus contatos de interesse aqui e gerenciar sua prospecção de forma inteligente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {STAGE_ORDER.map((stage) => {
            const config = STAGE_CONFIGS[stage];
            const list = getCompaniesInStage(stage);

            return (
              <div key={stage} className="flex flex-col bg-slate-50 border border-slate-200/80 rounded-xl min-w-[240px] shrink-0 p-3 h-[calc(100vh-280px)] overflow-y-auto">
                
                {/* Column Title */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200/60">
                  <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
                    {config.label}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded-full text-slate-600">
                    {list.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1">
                  {list.map((company) => (
                    <div
                      key={company.id}
                      className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all relative group"
                    >
                      {/* Close button (Remove from CRM) */}
                      <button
                        onClick={() => onRemoveFromCrm(company.id)}
                        className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-all"
                        title="Remover do funil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="pr-4">
                        <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide">
                          {company.cnaeDescricao.split(' ')[0]}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight mt-0.5 mb-1 cursor-pointer hover:text-indigo-600" onClick={() => onSelectCompany(company)}>
                          {company.nomeFantasia || company.razaoSocial}
                        </h4>
                        <div className="text-[10px] text-slate-400 font-medium">{company.cidade} - {company.uf}</div>
                      </div>

                      {/* GMB Status Warning indicator */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-mono">{company.telefone}</span>
                        {!company.gmbStatus.isClaimed ? (
                          <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold" title="Perfil não reivindicado!">
                            Não Reivind.
                          </span>
                        ) : company.gmbStatus.rating < 4.2 ? (
                          <span className="text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-bold">
                            Nota {company.gmbStatus.rating}
                          </span>
                        ) : (
                          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                            Verificado
                          </span>
                        )}
                      </div>

                      {/* Notes Section */}
                      <div className="mt-2 pt-2 border-t border-slate-100 bg-slate-50/50 p-2 rounded text-[10px]">
                        {editingNotesId === company.id ? (
                          <div className="space-y-1">
                            <textarea
                              value={notesTempText}
                              onChange={(e) => setNotesTempText(e.target.value)}
                              rows={2}
                              className="w-full p-1 text-[10px] border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white text-slate-800"
                              placeholder="Adicionar nota comercial..."
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => setEditingNotesId(null)}
                                className="px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => handleSaveNotes(company.id)}
                                className="px-1.5 py-0.5 bg-indigo-600 text-white rounded font-bold"
                              >
                                Salvar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="cursor-pointer group/note flex items-start gap-1 justify-between" onClick={() => handleStartEditingNotes(company)}>
                            <span className="text-slate-500 truncate max-w-[150px] leading-snug">
                              {company.notes || 'Clique para adicionar notas...'}
                            </span>
                            <MessageSquare className="w-3 h-3 text-slate-400 group-hover/note:text-indigo-600 shrink-0 mt-0.5" />
                          </div>
                        )}
                      </div>

                      {/* Moving stage controls */}
                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          disabled={STAGE_ORDER.indexOf(stage) === 0}
                          onClick={() => onMoveStage(company.id, stage, 'backward')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Voltar Etapa"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onSelectCompany(company)}
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Ver Diagnóstico
                        </button>

                        <button
                          disabled={STAGE_ORDER.indexOf(stage) === STAGE_ORDER.length - 1}
                          onClick={() => onMoveStage(company.id, stage, 'forward')}
                          className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Avançar Etapa"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
