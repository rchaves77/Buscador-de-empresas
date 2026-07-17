/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Eye, ShieldAlert, ShieldCheck, MapPinOff, AlertTriangle, Star, CheckCircle, ChevronRight, Send, HelpCircle, MessageSquare, X, Check, RotateCw, ExternalLink, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { Company, CRMStage } from '../types';

interface CompanyListProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onAddToCrm: (companyId: string) => void;
  crmCompanyIds: Set<string>;
  onUpdateCompanyStage?: (companyId: string, stage: string) => void;
}

export default function CompanyList({ companies, onSelectCompany, onAddToCrm, crmCompanyIds, onUpdateCompanyStage }: CompanyListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(8);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Bulk modal state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bulkProgress, setBulkProgress] = useState<Record<string, 'pending' | 'sent' | 'skipped'>>({});
  const [customTemplate, setCustomTemplate] = useState(`Olá, tudo bem? Meu nome é Rômulo Chaves, sou especialista em posicionamento local.

Estava pesquisando por empresas no seu segmento na nossa região e encontrei a ficha da {NOME} no Google.

Como profissional da área, preciso ser muito honesto: o perfil de vocês tem um potencial gigante, mas hoje está "invisível" para muitos clientes por falta de otimizações técnicas que o Google exige.

⚠️ E antes de mais nada, sei que tem muito golpe por aí: 
1. Eu NÃO sou do Google (sou profissional autônomo e atuo aqui no Acre).
2. O Google NÃO cobra taxa nenhuma para manter sua empresa no mapa.
3. Meu trabalho é técnico: otimizar sua ficha para trazer mais clientes reais para a sua porta.

O que eu garanto:
🟢 Qualificação técnica que o algoritmo do Google exige.
🟢 Aumento no fluxo de pessoas traçando rotas, ligando ou chamando você.
🟢 Sua marca como referência para quem pesquisa na nossa região.

Quer receber uma análise gratuita e rápida de onde seu perfil está perdendo clientes hoje? 

Clica no link abaixo que você já cai direto no meu WhatsApp pessoal para conversarmos:

https://wa.me/5568981034408?text=Olá!+Gostaria+de+fazer+uma+análise+gratuita+do+meu+perfil+do+Google.`);

  useEffect(() => {
    setCurrentPage(1);
  }, [companies, itemsPerPage]);

  useEffect(() => {
    // Sync selection with existing list
    const validIds = new Set<string>();
    const activeIds = new Set(companies.map(c => c.id));
    selectedIds.forEach(id => {
      if (activeIds.has(id)) {
        validIds.add(id);
      }
    });
    setSelectedIds(validIds);
  }, [companies]);

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const paginatedCompanies = companies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const isAllPaginatedSelected = paginatedCompanies.length > 0 && paginatedCompanies.every(c => selectedIds.has(c.id));

  const handleToggleSelectAll = () => {
    const next = new Set(selectedIds);
    if (isAllPaginatedSelected) {
      paginatedCompanies.forEach(c => next.delete(c.id));
    } else {
      paginatedCompanies.forEach(c => {
        next.add(c.id);
      });
    }
    setSelectedIds(next);
  };

  const handleToggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const selectedCompanies = companies.filter(c => selectedIds.has(c.id));

  const handleSendNext = () => {
    if (currentIndex >= selectedCompanies.length) return;
    const company = selectedCompanies[currentIndex];

    // Clean and build WhatsApp URL
    const cleanPhone = company.telefone ? company.telefone.replace(/\D/g, '') : '';
    if (!cleanPhone || cleanPhone === 'Semtelefone') {
      alert(`A empresa ${company.nomeFantasia || company.razaoSocial} não possui telefone de contato cadastrado.`);
      return;
    }
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

    // Personalize content
    const personalizedText = customTemplate.replace(/{NOME}/g, company.nomeFantasia || company.razaoSocial);
    const encodedText = encodeURIComponent(personalizedText);
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodedText}`;

    // Add company to CRM if not already present
    if (!crmCompanyIds.has(company.id)) {
      onAddToCrm(company.id);
    }

    // Update CRM status
    if (onUpdateCompanyStage) {
      onUpdateCompanyStage(company.id, 'initial_contact');
    }

    // Set bulk progress
    setBulkProgress(prev => ({ ...prev, [company.id]: 'sent' }));

    // Open WhatsApp
    window.open(waUrl, '_blank');

    // Automatically advance
    if (currentIndex < selectedCompanies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      alert('Tudo pronto! Você passou por todos os contatos da lista de disparo.');
    }
  };

  const handleSkip = () => {
    if (currentIndex >= selectedCompanies.length) return;
    const company = selectedCompanies[currentIndex];
    setBulkProgress(prev => ({ ...prev, [company.id]: 'skipped' }));
    if (currentIndex < selectedCompanies.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleResetCampaign = () => {
    setBulkProgress({});
    setCurrentIndex(0);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-150 shadow-xs overflow-hidden" id="company-list-wrapper">
      
      {/* List Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
            Leads Identificados ({companies.length})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mostrando {companies.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-{Math.min(companies.length, currentPage * itemsPerPage)} de {companies.length}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-xs text-slate-500 font-medium">Visualizar:</label>
          <select
            id="items-per-page"
            value={itemsPerPage === 1000000 ? 'all' : itemsPerPage}
            onChange={(e) => {
              const val = e.target.value;
              setItemsPerPage(val === 'all' ? 1000000 : parseInt(val));
            }}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            <option value="8">8 leads</option>
            <option value="20">20 leads</option>
            <option value="50">50 leads</option>
            <option value="100">100 leads</option>
            <option value="250">250 leads</option>
            <option value="all">Mostrar Todos</option>
          </select>
        </div>
      </div>

      {/* Bulk Campaign Banner */}
      {selectedIds.size > 0 && (
        <div className="bg-emerald-50 border-b border-emerald-150 px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-sm">
              <MessageSquare className="w-4 h-4 fill-emerald-100/20 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">
                Campanha WhatsApp em Lote ({selectedIds.size} {selectedIds.size === 1 ? 'empresa selecionada' : 'empresas selecionadas'})
              </p>
              <p className="text-[10px] text-emerald-700 font-medium">
                Selecione os contatos e dispare mensagens personalizadas que movem automaticamente os leads no seu CRM B2B.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1.5 border border-emerald-200 hover:bg-emerald-100/60 text-emerald-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Desmarcar Todas
            </button>
            <button
              onClick={() => {
                setBulkProgress({});
                setCurrentIndex(0);
                setShowBulkModal(true);
              }}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold transition-all shadow-xs flex items-center gap-1.5 hover:scale-[1.02] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Configurar & Disparar
            </button>
          </div>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="p-12 text-center">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Nenhuma empresa encontrada com estes filtros.</p>
          <p className="text-slate-400 text-xs mt-1">Experimente limpar os filtros de Estado ou CNAE para buscar mais contatos.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-slate-400 text-[11px] font-semibold uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4 text-center w-12">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer border-slate-300"
                  />
                </th>
                <th className="py-3 px-6">Empresa / CNPJ</th>
                <th className="py-3 px-4">Localização</th>
                <th className="py-3 px-4">Contato</th>
                <th className="py-3 px-4">Saúde Google Maps</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {paginatedCompanies.map((company) => {
                const isAlreadyInCrm = crmCompanyIds.has(company.id);
                const { exists, isClaimed, rating, reviewsCount, hasWebsite, missingHours } = company.gmbStatus;
                const isSelected = selectedIds.has(company.id);

                return (
                  <tr key={company.id} className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-emerald-50/10' : ''}`}>
                    <td className="py-4 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(company.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 cursor-pointer border-slate-300"
                      />
                    </td>
                    
                    {/* Name & CNPJ */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900 leading-tight">
                        {company.nomeFantasia || company.razaoSocial}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                        <span>{company.cnpj}</span>
                        <span className="text-slate-300">•</span>
                        <span className="truncate max-w-[150px]">{company.cnaeDescricao}</span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-slate-600">
                      <div className="text-xs font-medium">
                        {company.bairro ? `${company.bairro}, ` : ''}{company.cidade}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{company.uf}</div>
                    </td>

                    {/* Contact Phone */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-800">
                      <div className="flex items-center gap-1.5 group/phone">
                        <span>{company.telefone || 'Sem telefone'}</span>
                        {company.telefone && company.telefone !== 'Sem telefone' && (
                          <button
                            onClick={() => {
                              const cleanPhone = company.telefone.replace(/\D/g, '');
                              const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
                              const personalizedText = customTemplate.replace(/{NOME}/g, company.nomeFantasia || company.razaoSocial);
                              const encodedText = encodeURIComponent(personalizedText);
                              const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodedText}`;
                              
                              if (!crmCompanyIds.has(company.id)) {
                                onAddToCrm(company.id);
                              }
                              if (onUpdateCompanyStage) {
                                onUpdateCompanyStage(company.id, 'initial_contact');
                              }
                              window.open(waUrl, '_blank');
                            }}
                            className="p-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Disparar Abordagem via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-emerald-100/50" />
                          </button>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{company.email}</div>
                    </td>

                    {/* Google Maps Health Badge */}
                    <td className="py-4 px-4">
                      {!exists ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          <MapPinOff className="w-3.5 h-3.5" />
                          Sem Ficha (100% Oportunidade)
                        </span>
                      ) : !isClaimed ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Não Reivindicada (Oportunidade)
                        </span>
                      ) : rating < 4.2 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          Nota Baixa ({rating})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Verificada ({rating} ★)
                        </span>
                      )}

                      {/* Micro-alerts on gaps */}
                      <div className="flex gap-2 mt-1.5">
                        {!hasWebsite && exists && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200" title="Falta site">Sem Site</span>
                        )}
                        {missingHours && exists && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200" title="Horários incompletos">Sem Horário</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs font-medium">
                        {/* Add to CRM */}
                        {!isAlreadyInCrm ? (
                          <button
                            onClick={() => onAddToCrm(company.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors border border-indigo-200 cursor-pointer"
                            title="Salvar no Funil de Vendas"
                          >
                            <Send className="w-3 h-3" />
                            + Prospectar
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 text-slate-500 rounded-lg text-xs font-medium border border-slate-200">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            No Funil
                          </span>
                        )}

                        {/* Inspect & Audit */}
                        <button
                          onClick={() => onSelectCompany(company)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          title="Fazer Auditoria com IA"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Auditar com IA
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40"
          >
            Anterior
          </button>
          <span className="text-xs text-slate-500">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-40"
          >
            Próximo
          </button>
        </div>
      )}

      {/* Bulk Campaign Wizard Modal */}
      {showBulkModal && selectedCompanies.length > 0 && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-4xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Painel de Disparo de Abordagem WhatsApp</h3>
                  <p className="text-[10px] text-slate-500">Assistente de prospecção consultiva inteligente para {selectedCompanies.length} empresas selecionadas</p>
                </div>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto max-h-[75vh]">
              
              {/* Left Column - Template Editor */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                    Script da Abordagem Comercial
                  </label>
                  <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Use {`{NOME}`} para personalizar</span>
                </div>
                <textarea
                  value={customTemplate}
                  onChange={(e) => setCustomTemplate(e.target.value)}
                  className="w-full flex-1 p-4 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 leading-relaxed min-h-[340px]"
                  placeholder="Olá! Estava pesquisando pelo segmento da sua empresa no Google Maps e..."
                />
              </div>

              {/* Right Column - Leads Queue & Actions */}
              <div className="lg:col-span-5 flex flex-col space-y-4">
                
                {/* Active Lead Box */}
                {currentIndex < selectedCompanies.length ? (
                  (() => {
                    const focusCompany = selectedCompanies[currentIndex];
                    const phoneVal = focusCompany.telefone || '';
                    const hasPhone = phoneVal && phoneVal !== 'Sem telefone';
                    const leadStatus = bulkProgress[focusCompany.id] || 'pending';

                    return (
                      <div className="border border-emerald-200 rounded-xl bg-emerald-50/20 p-5 shadow-2xs space-y-3 ring-2 ring-emerald-500/20 animate-pulse-subtle">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase tracking-wide">
                            Foco de Envio Atual ({currentIndex + 1} de {selectedCompanies.length})
                          </span>
                          <span className="text-[9px] font-bold text-slate-500 font-mono">
                            {Math.round(((currentIndex) / selectedCompanies.length) * 100)}% concluído
                          </span>
                        </div>

                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm leading-snug">
                            {focusCompany.nomeFantasia || focusCompany.razaoSocial}
                          </h4>
                          <p className="text-[10px] text-slate-500 font-medium mt-0.5">{focusCompany.cidade} - {focusCompany.uf}</p>
                        </div>

                        <div className="bg-white border border-slate-150 rounded-lg p-3 space-y-1.5 text-xs text-slate-700">
                          <div className="flex justify-between">
                            <span className="text-slate-400">CNPJ:</span>
                            <span className="font-mono text-slate-900 font-semibold">{focusCompany.cnpj}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Contato:</span>
                            <span className="font-semibold text-slate-900">{phoneVal || 'Não cadastrado'}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Diagnóstico Maps:</span>
                            {!focusCompany.gmbStatus.exists ? (
                              <span className="text-red-600 font-bold text-[10px]">Sem Ficha</span>
                            ) : !focusCompany.gmbStatus.isClaimed ? (
                              <span className="text-amber-600 font-bold text-[10px]">Não Reivindicada</span>
                            ) : (
                              <span className="text-emerald-600 font-bold text-[10px]">Nota {focusCompany.gmbStatus.rating}</span>
                            )}
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={handleSkip}
                            className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Pular Lead
                          </button>
                          <button
                            onClick={handleSendNext}
                            disabled={!hasPhone}
                            className="flex-[2] py-2 bg-emerald-600 hover:bg-emerald-750 disabled:bg-slate-300 text-white rounded-lg text-xs font-extrabold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Enviar no WhatsApp
                          </button>
                        </div>

                        {!hasPhone && (
                          <p className="text-[9px] text-red-500 font-bold text-center mt-1">⚠️ Este lead não possui telefone cadastrado para WhatsApp.</p>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="border border-emerald-150 rounded-xl bg-emerald-50/50 p-6 text-center space-y-3">
                    <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div>
                      <h4 className="font-bold text-emerald-900 text-sm">Fila Concluída!</h4>
                      <p className="text-xs text-emerald-700 leading-normal mt-1">Todas as empresas selecionadas foram enviadas ou revisadas com sucesso.</p>
                    </div>
                    <button
                      onClick={handleResetCampaign}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Reiniciar Campanha
                    </button>
                  </div>
                )}

                {/* Queue list container */}
                <div className="flex-1 flex flex-col min-h-[150px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-3.5 py-2 bg-slate-100 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Fila de Abordagem ({selectedCompanies.length} Leads)
                  </div>
                  <div className="p-2 space-y-1.5 overflow-y-auto max-h-[160px] flex-1 text-xs">
                    {selectedCompanies.map((company, index) => {
                      const status = bulkProgress[company.id] || 'pending';
                      const isCurrent = index === currentIndex;

                      return (
                        <div
                          key={company.id}
                          className={`flex items-center justify-between p-2 rounded-lg border transition-all ${
                            isCurrent
                              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20'
                              : status === 'sent'
                              ? 'bg-slate-100/50 border-slate-200 opacity-60'
                              : 'bg-white border-slate-150'
                          }`}
                        >
                          <div className="truncate max-w-[170px]">
                            <div className="font-semibold text-slate-800 truncate leading-tight">
                              {index + 1}. {company.nomeFantasia || company.razaoSocial}
                            </div>
                            <div className="text-[9px] text-slate-400 mt-0.5 font-mono">{company.telefone || 'Sem telefone'}</div>
                          </div>

                          <div className="shrink-0">
                            {status === 'pending' && !isCurrent && (
                              <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 font-bold px-2 py-0.5 rounded">Fila</span>
                            )}
                            {isCurrent && (
                              <span className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded animate-pulse">Abordar</span>
                            )}
                            {status === 'sent' && (
                              <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                Aberto
                              </span>
                            )}
                            {status === 'skipped' && (
                              <span className="text-[9px] bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                                Ignorado
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between text-xs">
              <p className="text-slate-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                Dica: O disparo automático de WhatsApp direto sem clique é bloqueado por navegadores. Nosso modelo assistido é 100% legal, seguro e gratuito.
              </p>
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg font-bold cursor-pointer"
              >
                Fechar Painel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
