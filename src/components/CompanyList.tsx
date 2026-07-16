/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, ShieldAlert, ShieldCheck, MapPinOff, AlertTriangle, Star, CheckCircle, ChevronRight, Send, HelpCircle } from 'lucide-react';
import { Company, CRMStage } from '../types';

interface CompanyListProps {
  companies: Company[];
  onSelectCompany: (company: Company) => void;
  onAddToCrm: (companyId: string) => void;
  crmCompanyIds: Set<string>;
}

export default function CompanyList({ companies, onSelectCompany, onAddToCrm, crmCompanyIds }: CompanyListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(companies.length / itemsPerPage);
  const paginatedCompanies = companies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatCnpj = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  return (
    <div className="bg-white rounded-xl border border-slate-150 shadow-xs overflow-hidden" id="company-list-wrapper">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          Leads Identificados ({companies.length})
        </h3>
        <p className="text-xs text-slate-500">
          Mostrando {Math.min(companies.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(companies.length, currentPage * itemsPerPage)} de {companies.length}
        </p>
      </div>

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

                return (
                  <tr key={company.id} className="hover:bg-slate-50/70 transition-colors">
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
                      <div className="text-xs">
                        {company.bairro ? `${company.bairro}, ` : ''}{company.cidade}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{company.uf}</div>
                    </td>

                    {/* Contact Phone */}
                    <td className="py-4 px-4 font-mono text-xs text-slate-800">
                      <div>{company.telefone || 'Sem telefone'}</div>
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
                      <div className="flex items-center justify-end gap-2">
                        {/* Add to CRM */}
                        {!isAlreadyInCrm ? (
                          <button
                            onClick={() => onAddToCrm(company.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors border border-indigo-200"
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
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
    </div>
  );
}
