/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft, Calendar, DollarSign, FileText, Loader2, MessageSquare, Send, ShieldAlert, Sparkles, TrendingDown, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { Company, AuditReport } from '../types';

interface CompanyAuditProps {
  company: Company;
  onBack: () => void;
  onUpdateCompanyStage: (companyId: string, stage: string) => void;
  savedAudit?: AuditReport | null;
  onSaveAudit: (audit: AuditReport) => void;
}

interface PitchResult {
  whatsappText: string;
  emailSubject: string;
  emailText: string;
}

export default function CompanyAudit({ company, onBack, onUpdateCompanyStage, savedAudit, onSaveAudit }: CompanyAuditProps) {
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState<AuditReport | null>(savedAudit || null);
  const [pitch, setPitch] = useState<PitchResult | null>(null);
  const [loadingPitch, setLoadingPitch] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'outreach'>('report');
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (savedAudit) {
      setAudit(savedAudit);
      generatePitch(savedAudit);
    } else {
      runAudit();
    }
  }, [company.id]);

  const runAudit = async () => {
    setLoading(true);
    setAudit(null);
    setPitch(null);
    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company })
      });

      if (!response.ok) throw new Error('Falha ao gerar auditoria');

      const data = await response.json();
      const newAudit: AuditReport = {
        companyId: company.id,
        overallScore: data.overallScore,
        criticalGaps: data.criticalGaps,
        opportunityLossEstimated: data.opportunityLossEstimated,
        aiAnalysisText: data.aiAnalysisText,
        actionPlan: data.actionPlan,
        generatedAt: new Date().toLocaleDateString('pt-BR')
      };

      setAudit(newAudit);
      onSaveAudit(newAudit);
      generatePitch(newAudit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generatePitch = async (auditData: AuditReport) => {
    setLoadingPitch(true);
    try {
      const response = await fetch('/api/suggest-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, auditResult: auditData })
      });

      if (!response.ok) throw new Error('Falha ao gerar abordagem comercial');

      const data = await response.json();
      setPitch(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPitch(false);
    }
  };

  const handleCopyWhatsapp = () => {
    if (!pitch) return;
    navigator.clipboard.writeText(pitch.whatsappText);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const handleCopyEmail = () => {
    if (!pitch) return;
    navigator.clipboard.writeText(`Assunto: ${pitch.emailSubject}\n\n${pitch.emailText}`);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendWhatsapp = () => {
    if (!pitch) return;
    // Strip non-numbers from phone
    const cleanPhone = company.telefone.replace(/\D/g, '');
    // Ensure Brazilian country code
    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const encodedText = encodeURIComponent(pitch.whatsappText);
    const waUrl = `https://wa.me/${phoneWithCountry}?text=${encodedText}`;
    
    // Move lead state in CRM to "Contato Inicial"
    onUpdateCompanyStage(company.id, 'initial_contact');
    
    // Open Whatsapp
    window.open(waUrl, '_blank');
  };

  // Color helper for health score
  const getScoreColorClass = (score: number) => {
    if (score < 45) return { border: 'border-rose-500', text: 'text-rose-600', bg: 'bg-rose-50' };
    if (score < 75) return { border: 'border-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
    return { border: 'border-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50' };
  };

  return (
    <div className="bg-white rounded-xl border border-slate-150 shadow-xs p-6" id="audit-main-panel">
      {/* Back Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Voltar para busca"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">Auditoria Estratégica GBP</div>
            <h2 className="text-xl font-bold text-slate-950">{company.nomeFantasia}</h2>
            <div className="text-xs text-slate-400 font-mono mt-0.5">CNPJ: {company.cnpj} • {company.cidade} - {company.uf}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={runAudit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refazer Auditoria
          </button>
          
          <button
            onClick={handleSendWhatsapp}
            disabled={!pitch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Enviar via WhatsApp
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <h4 className="font-semibold text-slate-800 text-base">Iniciando Varredura no Google Meu Negócio...</h4>
          <p className="text-slate-500 text-xs max-w-sm mt-1">
            Nossa IA está simulando uma auditoria de SEO local baseada nos dados públicos da empresa e analisando gargalos de captação de clientes.
          </p>
        </div>
      ) : !audit ? (
        <div className="p-12 text-center text-slate-500">
          Nenhuma auditoria gerada para esta empresa. Clique em "Refazer Auditoria".
        </div>
      ) : (
        <div>
          {/* Main Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab('report')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'report'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              📊 Relatório de Auditoria B2B
            </button>
            <button
              onClick={() => setActiveTab('outreach')}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'outreach'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              ✍️ Abordagem Comercial Inteligente (Pitches)
            </button>
          </div>

          {activeTab === 'report' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Metrics & Score */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Score Card */}
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-5 text-center flex flex-col items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Score de Otimização Local</span>
                  
                  {/* Gauge */}
                  <div className="relative my-4 flex items-center justify-center">
                    <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center bg-white shadow-xs ${getScoreColorClass(audit.overallScore).border}`}>
                      <span className="text-3xl font-extrabold text-slate-900">{audit.overallScore}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">de 100</span>
                    </div>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getScoreColorClass(audit.overallScore).bg} ${getScoreColorClass(audit.overallScore).text}`}>
                    {audit.overallScore < 45 ? 'Crítico (Precisa de Resgate)' : audit.overallScore < 75 ? 'Regular (Muitas Falhas)' : 'Excelente (Parabéns)'}
                  </span>
                </div>

                {/* Economic Loss Estimator */}
                <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-950">Prejuízo Mensal Estimado</h4>
                      <div className="text-2xl font-extrabold text-rose-600 my-1">
                        R$ {audit.opportunityLossEstimated.toLocaleString('pt-BR')} <span className="text-xs font-normal text-rose-500">/mês</span>
                      </div>
                      <p className="text-xs text-rose-800 leading-relaxed">
                        Este valor estima o faturamento perdido para os concorrentes diretos que aparecem melhor posicionados no Google Maps e pesquisas locais da região.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Critical Gaps list */}
                <div className="bg-white border border-slate-150 rounded-xl p-5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Gargalos Críticos Identificados
                  </h4>
                  <ul className="space-y-3">
                    {audit.criticalGaps.map((gap, index) => (
                      <li key={index} className="flex gap-2 text-xs text-slate-700 items-start leading-normal">
                        <span className="w-5 h-5 flex items-center justify-center bg-rose-50 text-rose-600 rounded-full font-bold text-[10px] shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Right Column: AI Analysis & Step-by-Step Action Plan */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* AI Analysis Speech bubble */}
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 bg-indigo-500 text-white rounded-bl-xl font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    Análise IA
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    Diagnóstico Estratégico do Consultor
                  </h4>
                  <div className="text-slate-700 text-xs leading-relaxed space-y-3 whitespace-pre-line">
                    {audit.aiAnalysisText}
                  </div>
                </div>

                {/* Interactive Action Plan */}
                <div>
                  <h4 className="text-sm font-bold text-slate-950 mb-3 flex items-center gap-1.5">
                    <FileText className="w-4.5 h-4.5 text-indigo-600" />
                    Plano de Otimização Recomendado (Gancho de Vendas)
                  </h4>
                  <div className="space-y-3">
                    {audit.actionPlan.map((step, idx) => (
                      <div key={idx} className="border border-slate-150 rounded-xl p-4 bg-white hover:border-slate-200 transition-all shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5">
                          <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                              {idx + 1}
                            </span>
                            {step.title}
                          </h5>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                              step.impact === 'Alto' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                              Impacto: {step.impact}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                              Dif: {step.difficulty}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-normal ml-5">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Outreach/Pitching Tab */
            <div className="space-y-6">
              
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-5">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
                  Estratégia de Venda Consultiva (Não Invasiva)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As mensagens geradas abaixo utilizam dados reais da auditoria da <strong>{company.nomeFantasia}</strong> para demonstrar competência profissional de forma imediata. Ao invés de fazer propaganda genérica (spam), você apresenta valor gratuito (o diagnóstico e a estimativa de prejuízo). Isso eleva a taxa de resposta de 2% para até 35%.
                </p>
              </div>

              {loadingPitch ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                  <span className="text-xs text-slate-500">Escrevendo proposta sob medida...</span>
                </div>
              ) : !pitch ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Aguardando geração do roteiro estratégico de vendas.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* WhatsApp Copy Box */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                        Script para WhatsApp Business
                      </span>
                      <button
                        onClick={handleCopyWhatsapp}
                        className="p-1.5 hover:bg-emerald-100 rounded text-emerald-700 transition-colors"
                        title="Copiar texto"
                      >
                        {copiedPitch ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-5 bg-emerald-50/20 text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed min-h-[300px]">
                      {pitch.whatsappText}
                    </div>
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={handleSendWhatsapp}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Abrir WhatsApp e Enviar
                      </button>
                    </div>
                  </div>

                  {/* Email Copy Box */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <div className="px-5 py-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-800">
                        E-mail Comercial de Apresentação
                      </span>
                      <button
                        onClick={handleCopyEmail}
                        className="p-1.5 hover:bg-indigo-100 rounded text-indigo-700 transition-colors"
                        title="Copiar texto"
                      >
                        {copiedEmail ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="p-5 bg-indigo-50/10 text-xs text-slate-700 min-h-[300px]">
                      <div className="pb-3 mb-3 border-b border-slate-100">
                        <strong className="text-slate-900">Assunto:</strong> {pitch.emailSubject}
                      </div>
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {pitch.emailText}
                      </div>
                    </div>
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end text-xs text-slate-400 font-medium">
                      Pronto para copiar e colar no seu Gmail ou Outlook.
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}
