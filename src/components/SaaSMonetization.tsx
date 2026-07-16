/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Zap, Users, Key, Check, HelpCircle, ArrowRight, Layers, Award } from 'lucide-react';

export default function SaaSMonetization() {
  const [apiKey, setApiKey] = useState('gmb_live_prod_8s39dfk1982dfg');
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const PLANS = [
    {
      name: 'Plano Start',
      price: 'R$ 149',
      period: '/mês',
      description: 'Ideal para consultores de marketing local individuais iniciando na prospecção B2B.',
      features: [
        'Até 100 auditorias mensais de CNPJ',
        'Filtros por Estado (UF) e Cidade',
        'Geração de roteiros de abordagem simples',
        'Acesso ao Kanban CRM básico',
        'Suporte via e-mail'
      ],
      cta: 'Assinar Plano Start',
      popular: false,
      badge: ''
    },
    {
      name: 'Plano Pro (Mais Vendido)',
      price: 'R$ 297',
      period: '/mês',
      description: 'Acelerador de vendas para agências e consultores que prospectam diariamente.',
      features: [
        'Até 500 auditorias mensais de CNPJ',
        'Buscas avançadas por bairro e capital social',
        'Auditoria completa com Inteligência Artificial (Gemini)',
        'Scripts personalizados de WhatsApp e E-mail',
        'Exportação de dados de leads para Excel/CSV',
        'Suporte prioritário via WhatsApp'
      ],
      cta: 'Assinar Plano Pro',
      popular: true,
      badge: 'Melhor Custo-Benefício'
    },
    {
      name: 'Plano Agency',
      price: 'R$ 599',
      period: '/mês',
      description: 'Escala total para times comerciais ou agências com múltiplos vendedores.',
      features: [
        'Auditorias ILIMITADAS de empresas',
        'Até 5 assentos de vendedores integrados',
        'Painel administrativo para monitorar campanhas do time',
        'Geração de relatórios PDF com logotipo personalizado (White-label)',
        'Integração via API com seu CRM (Hubspot/RD Station)',
        'Gerente de conta dedicado'
      ],
      cta: 'Falar com Especialista',
      popular: false,
      badge: ''
    }
  ];

  return (
    <div className="space-y-6" id="saas-billing-panel">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-slate-950 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600 animate-bounce" />
          Gerenciamento SaaS & Licenciamento Comercial
        </h2>
        <p className="text-sm text-slate-500">
          Gerencie os planos, assinantes, chaves de API e a monetização para revender o acesso a esta ferramenta.
        </p>
      </div>

      {/* Credit Tracker Banner */}
      <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            Sua Licença de Testes
          </span>
          <h3 className="font-extrabold text-slate-950 text-base mt-1.5 flex items-center gap-1.5">
            Plano Pro Ativo
            <Award className="w-4 h-4 text-amber-500" />
          </h3>
          <p className="text-xs text-slate-500 mt-1">Sua conta tem acesso completo a todas as análises de IA.</p>
        </div>

        {/* Credit Horizontal bar */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">Créditos de Auditorias IA Usados</span>
            <span className="text-indigo-600">42 / 500 <span className="text-slate-400 font-normal">(8.4% consumido)</span></span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: '8.4%' }} />
          </div>
          <p className="text-[10px] text-slate-400">Os créditos são renovados automaticamente em 15 dias.</p>
        </div>
      </div>

      {/* Subscription Plans Section */}
      <div>
        <div className="text-center max-w-md mx-auto mb-8">
          <h3 className="font-extrabold text-slate-900 text-base">Modelos de Precificação para Revenda (SaaS)</h3>
          <p className="text-xs text-slate-500 mt-1">
            Esta interface já está estruturada para integração com Stripe, Pagar.me ou Asaas para cobrança recorrente automatizada de usuários.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between relative transition-all duration-300 ${
                plan.popular
                  ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600/30 md:-translate-y-2'
                  : 'border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                  {plan.badge}
                </span>
              )}

              <div>
                <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">{plan.name}</h4>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-950">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.description}</p>

                <ul className="mt-6 space-y-3.5">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => alert(`Simulação SaaS: Integração de Checkout ativa. Plano "${plan.name}" pronto para receber transações.`)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer and Team Integrations API section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        
        {/* Token Management */}
        <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Integração de Desenvolvedor (API)</h4>
          </div>
          <p className="text-xs text-slate-600 leading-normal">
            Conecte este buscador de CNPJ a sistemas externos de automação ou CRMs corporativos usando sua chave de acesso segura.
          </p>

          <div className="flex gap-2 items-center">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              readOnly
              className="flex-1 bg-slate-50 border border-slate-250 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors"
            >
              {showKey ? 'Ocultar' : 'Revelar'}
            </button>
            <button
              onClick={handleCopyKey}
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              {copiedKey ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Sales Team Seat Manager */}
        <div className="bg-white border border-slate-150 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Membros da Equipe Comercial</h4>
          </div>
          <p className="text-xs text-slate-600 leading-normal">
            Convide outros vendedores para prospectarem na sua base de dados sob uma única conta unificada.
          </p>

          <div className="flex gap-2">
            <input
              type="email"
              placeholder="vendedor@suaagencia.com.br"
              className="flex-1 border border-slate-250 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
            <button
              onClick={() => alert('Convite enviado! O vendedor receberá um e-mail com acesso de sub-conta.')}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
            >
              Convidar
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
