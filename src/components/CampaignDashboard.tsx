/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TrendingUp, Users, FileBarChart, CheckCircle, BarChart3, ArrowUpRight, DollarSign, Target, Percent } from 'lucide-react';
import { Company, CRMStage } from '../types';

interface CampaignDashboardProps {
  companies: Company[];
}

export default function CampaignDashboard({ companies }: CampaignDashboardProps) {
  const totalLeads = companies.length;
  const inCrm = companies.filter(c => c.crmStage !== undefined);
  const contactInitial = companies.filter(c => c.crmStage === CRMStage.INITIAL_CONTACT);
  const auditSent = companies.filter(c => c.crmStage === CRMStage.AUDIT_SENT);
  const negotiating = companies.filter(c => c.crmStage === CRMStage.NEGOTIATING);
  const won = companies.filter(c => c.crmStage === CRMStage.CLOSED_WON);

  // Business value simulation
  // Google Business Profile managers in Brazil charge between R$ 400 and R$ 1200 per month
  const TICKET_MEDIO = 600; // R$ 600/month per profile
  const calculatedMrr = won.length * TICKET_MEDIO;
  const totalPotentialValue = inCrm.length * TICKET_MEDIO;

  const responseRate = inCrm.length > 0 ? Math.round(((contactInitial.length + won.length + negotiating.length) / inCrm.length) * 100) : 0;
  const conversionRate = inCrm.length > 0 ? Math.round((won.length / inCrm.length) * 100) : 0;

  // Mock timeline metrics
  const monthlyMetrics = [
    { name: 'Jan', sent: 12, opened: 10, won: 1 },
    { name: 'Fev', sent: 24, opened: 19, won: 2 },
    { name: 'Mar', sent: 45, opened: 38, won: 4 },
    { name: 'Abr', sent: 68, opened: 54, won: 6 },
    { name: 'Mai', sent: 90, opened: 82, won: 9 }
  ];

  return (
    <div className="space-y-6" id="dashboard-campaign-panel">
      {/* Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-slate-950 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Painel de Controle e Métricas de Campanha
        </h2>
        <p className="text-sm text-slate-500">
          Monitore o retorno das abordagens comerciais e projete seu faturamento recorrente.
        </p>
      </div>

      {/* Bento Grid Analytics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR Card */}
        <div className="bg-indigo-900 text-white rounded-xl p-5 border border-indigo-950 flex flex-col justify-between shadow-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-indigo-200 uppercase tracking-wider">Faturamento Recorrente (MRR)</span>
              <h3 className="text-2xl font-black mt-1">R$ {calculatedMrr.toLocaleString('pt-BR')} <span className="text-xs font-normal">/mês</span></h3>
            </div>
            <span className="p-2 bg-indigo-800 text-indigo-200 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="text-[11px] text-indigo-200 mt-4 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ticket médio est. de R$ {TICKET_MEDIO} por contrato.</span>
          </div>
        </div>

        {/* Won Clients Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-250 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Clientes Fechados</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{won.length}</h3>
            </div>
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-4">
            Taxa de Conversão: <strong className="text-emerald-600">{conversionRate}%</strong>
          </div>
        </div>

        {/* Total Prospects Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-250 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Leads no Funil Comercial</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{inCrm.length}</h3>
            </div>
            <span className="p-2 bg-slate-50 text-slate-700 rounded-lg">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-4">
            Prejuízo mapeado dos leads: <strong className="text-slate-700">R$ {(inCrm.length * 3500).toLocaleString('pt-BR')}</strong>
          </div>
        </div>

        {/* Response Rate Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-250 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Taxa de Resposta</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{responseRate}%</h3>
            </div>
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Percent className="w-5 h-5" />
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-4">
            Média recomendada: acima de 25% com abordagens consultivas.
          </div>
        </div>
      </div>

      {/* Visual Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Funnel chart (SVG-based high quality) */}
        <div className="lg:col-span-5 bg-white border border-slate-150 rounded-xl p-5 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-indigo-600" />
            Visão Geral do Funil de Conversão
          </h4>

          <div className="space-y-4">
            {/* Total */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-600">
                <span>Leads Identificados</span>
                <strong>{totalLeads}</strong>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* In CRM */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-600">
                <span>Adicionados no Funil (CRM)</span>
                <strong>{inCrm.length} <span className="text-[10px] text-slate-400">({totalLeads ? Math.round((inCrm.length / totalLeads) * 100) : 0}%)</span></strong>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full animate-all duration-500" style={{ width: `${totalLeads ? (inCrm.length / totalLeads) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Audited & Outreach Sent */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium text-slate-600">
                <span>Abordagens Iniciadas</span>
                <strong>{contactInitial.length + won.length} <span className="text-[10px] text-slate-400">({inCrm.length ? Math.round(((contactInitial.length + won.length) / inCrm.length) * 100) : 0}%)</span></strong>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full animate-all duration-500" style={{ width: `${inCrm.length ? ((contactInitial.length + won.length) / inCrm.length) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Closed Won */}
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-semibold text-emerald-700">
                <span>Fechados & Assinados 🎉</span>
                <strong>{won.length} <span className="text-[10px] text-emerald-500">({inCrm.length ? Math.round((won.length / inCrm.length) * 100) : 0}%)</span></strong>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full animate-all duration-500" style={{ width: `${inCrm.length ? (won.length / inCrm.length) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Growth & Timeline Analysis */}
        <div className="lg:col-span-7 bg-white border border-slate-150 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Histórico de Evolução de Prospecção (Últimos 5 Meses)
            </h4>
            <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">B2B SaaS</span>
          </div>

          {/* Simple premium SVG graph bar */}
          <div className="flex items-end justify-between h-48 pt-6 px-4">
            {monthlyMetrics.map((month, index) => {
              const maxSent = Math.max(...monthlyMetrics.map(m => m.sent));
              const heightSent = maxSent ? (month.sent / maxSent) * 120 : 0;
              const heightOpened = maxSent ? (month.opened / maxSent) * 120 : 0;
              const heightWon = maxSent ? (month.won / maxSent) * 120 : 0;

              return (
                <div key={index} className="flex flex-col items-center flex-1 space-y-2">
                  <div className="flex items-end gap-1.5 justify-center">
                    {/* Sent Bar */}
                    <div
                      className="w-3 bg-slate-200 rounded-t-sm"
                      style={{ height: `${heightSent}px` }}
                      title={`Contatadas: ${month.sent}`}
                    />
                    {/* Opened Bar */}
                    <div
                      className="w-3 bg-indigo-400 rounded-t-sm"
                      style={{ height: `${heightOpened}px` }}
                      title={`Visualizadas: ${month.opened}`}
                    />
                    {/* Won Bar */}
                    <div
                      className="w-3 bg-emerald-500 rounded-t-sm"
                      style={{ height: `${heightWon}px` }}
                      title={`Fechadas: ${month.won}`}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{month.name}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 text-[10px] font-semibold text-slate-500 mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-slate-200 rounded-full" />
              Empresas Contatadas
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full" />
              Feedback Receptivo
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              Contratos Fechados
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
