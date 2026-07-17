/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Search,
  FileSpreadsheet,
  Zap,
  Building2,
  Phone,
  Settings,
  HelpCircle,
  TrendingUp,
  MapPin,
  CheckCircle,
  Menu,
  X,
  RotateCw,
  Globe
} from 'lucide-react';

import { Company, CRMStage, AuditReport } from './types';
import { INITIAL_COMPANIES, SECTORS, CITIES_BY_STATE } from './data/mockCompanies';

import SearchFilters from './components/SearchFilters';
import CompanyList from './components/CompanyList';
import CompanyAudit from './components/CompanyAudit';
import CRMBoard from './components/CRMBoard';
import CampaignDashboard from './components/CampaignDashboard';
import SaaSMonetization from './components/SaaSMonetization';

export default function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [crmCompanyIds, setCrmCompanyIds] = useState<Set<string>>(new Set());
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'crm' | 'saas'>('search');
  const [savedAudits, setSavedAudits] = useState<Record<string, AuditReport>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScanningAi, setIsScanningAi] = useState(false);

  // Active filters for company listing
  const [activeFilters, setActiveFilters] = useState({
    query: '',
    uf: '',
    cidade: '',
    cnae: '',
    gmbFilter: 'all'
  });

  // Load state from server-side database on mount (with localStorage fallback)
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/db');
        if (res.ok) {
          const serverData = await res.json();
          const { companies: sCompanies, crmCompanyIds: sCrmIds, savedAudits: sAudits } = serverData;
          
          if (Array.isArray(sCompanies)) {
            const validRealCompanies = sCompanies.filter(c => 
              c && 
              typeof c === 'object' && 
              c.id && 
              (c.id.startsWith('cnpj_imported_') || c.id.startsWith('comp_custom_') || c.id.startsWith('ai_lead_'))
            );
            setCompanies(validRealCompanies);
            localStorage.setItem('gmb_prospector_companies', JSON.stringify(validRealCompanies));
          }
          
          if (Array.isArray(sCrmIds)) {
            const validIds = sCrmIds.filter(id => 
              id && 
              (id.startsWith('cnpj_imported_') || id.startsWith('comp_custom_') || id.startsWith('ai_lead_'))
            );
            setCrmCompanyIds(new Set<string>(validIds as string[]));
            localStorage.setItem('gmb_prospector_crm_ids', JSON.stringify(validIds));
          }
          
          if (sAudits && typeof sAudits === 'object') {
            setSavedAudits(sAudits);
            localStorage.setItem('gmb_prospector_audits', JSON.stringify(sAudits));
          }
          return; // Successfully loaded from server
        }
      } catch (err) {
        console.error('Failed to load database from server, using localStorage fallback:', err);
      }

      // Local storage fallback
      const storedCompanies = localStorage.getItem('gmb_prospector_companies');
      const storedCrmIds = localStorage.getItem('gmb_prospector_crm_ids');
      const storedAudits = localStorage.getItem('gmb_prospector_audits');

      let validRealCompanies: Company[] = [];

      if (storedCompanies) {
        try {
          const parsed = JSON.parse(storedCompanies);
          if (Array.isArray(parsed)) {
            validRealCompanies = parsed.filter(c => 
              c && 
              typeof c === 'object' && 
              c.id && 
              (c.id.startsWith('cnpj_imported_') || c.id.startsWith('comp_custom_') || c.id.startsWith('ai_lead_'))
            );
            setCompanies(validRealCompanies);
            localStorage.setItem('gmb_prospector_companies', JSON.stringify(validRealCompanies));
          } else {
            setCompanies(INITIAL_COMPANIES);
          }
        } catch (e) {
          setCompanies(INITIAL_COMPANIES);
        }
      } else {
        setCompanies(INITIAL_COMPANIES);
      }

      if (storedCrmIds) {
        try {
          const parsed = JSON.parse(storedCrmIds);
          if (Array.isArray(parsed)) {
            const validIds = parsed.filter(id => 
              id && 
              (id.startsWith('cnpj_imported_') || id.startsWith('comp_custom_') || id.startsWith('ai_lead_'))
            );
            setCrmCompanyIds(new Set<string>(validIds as string[]));
            localStorage.setItem('gmb_prospector_crm_ids', JSON.stringify(validIds));
          }
        } catch (e) {
          setCrmCompanyIds(new Set<string>());
        }
      }

      if (storedAudits) {
        try {
          setSavedAudits(JSON.parse(storedAudits));
        } catch (e) {
          setSavedAudits({});
        }
      }
    };

    loadData();
  }, []);

  // Save state to localStorage and server-side database when changes occur
  const saveToStorage = async (updatedCompanies: Company[], updatedCrmIds: Set<string>, updatedAudits = savedAudits) => {
    // 1. Save to local cache
    localStorage.setItem('gmb_prospector_companies', JSON.stringify(updatedCompanies));
    localStorage.setItem('gmb_prospector_crm_ids', JSON.stringify(Array.from(updatedCrmIds)));
    localStorage.setItem('gmb_prospector_audits', JSON.stringify(updatedAudits));

    // 2. Persist to server
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companies: updatedCompanies,
          crmCompanyIds: Array.from(updatedCrmIds),
          savedAudits: updatedAudits
        })
      });
    } catch (err) {
      console.error('Failed to save database to server:', err);
    }
  };

  const handleSearch = (filters: { query: string; uf: string; cidade: string; cnae: string; gmbFilter: string }) => {
    setActiveFilters(filters);
  };

  const handleAiScan = async () => {
    if (!activeFilters.uf || !activeFilters.cidade) {
      alert('Selecione um Estado e uma Cidade nos filtros para realizar a varredura por IA na internet.');
      return;
    }

    setIsScanningAi(true);
    try {
      const selectedSector = SECTORS.find(s => s.cnae === activeFilters.cnae) || SECTORS[0];
      const res = await fetch('/api/scan-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uf: activeFilters.uf,
          cidade: activeFilters.cidade,
          cnae: activeFilters.cnae || selectedSector.cnae,
          cnaeDescricao: selectedSector.descricao
        })
      });

      if (!res.ok) {
        let errorMsg = 'Falha no servidor de IA.';
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }
      const data = await res.json();

      if (data.leads && data.leads.length > 0) {
        // Prepend new real leads
        const updated = [...data.leads, ...companies];
        setCompanies(updated);
        saveToStorage(updated, crmCompanyIds);
        alert(`Varredura concluída! Encontramos ${data.leads.length} empresas REAIS na internet de "${activeFilters.cidade} - ${activeFilters.uf}" utilizando o Google Search do Gemini.`);
      } else {
        alert('Varredura de IA finalizada. Nenhuma nova empresa real foi localizada na internet para esta região neste momento.');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Erro na conexão com a inteligência artificial para varredura real-time: ${err.message || 'Por favor, verifique sua chave API do Gemini nas Configurações.'}`);
    } finally {
      setIsScanningAi(false);
    }
  };

  const handleAddCompany = (newCompany: Company) => {
    const updated = [newCompany, ...companies];
    setCompanies(updated);
    
    // Auto-add manually added companies to CRM
    const newCrmIds = new Set<string>(crmCompanyIds);
    newCrmIds.add(newCompany.id);
    setCrmCompanyIds(newCrmIds);

    saveToStorage(updated, newCrmIds);
  };

  const handleAddCompanies = (newCompanies: Company[]) => {
    const updated = [...newCompanies, ...companies];
    setCompanies(updated);
    
    // Auto-add all imported companies to CRM as identified leads
    const newCrmIds = new Set<string>(crmCompanyIds);
    newCompanies.forEach(c => newCrmIds.add(c.id));
    setCrmCompanyIds(newCrmIds);

    saveToStorage(updated, newCrmIds);
  };

  const handleAddToCrm = (companyId: string) => {
    const newCrmIds = new Set<string>(crmCompanyIds);
    newCrmIds.add(companyId);
    setCrmCompanyIds(newCrmIds);

    const updatedCompanies = companies.map(c => {
      if (c.id === companyId) {
        return { ...c, crmStage: CRMStage.IDENTIFIED };
      }
      return c;
    });

    setCompanies(updatedCompanies);
    saveToStorage(updatedCompanies, newCrmIds);
  };

  const handleRemoveFromCrm = (companyId: string) => {
    const newCrmIds = new Set<string>(crmCompanyIds);
    newCrmIds.delete(companyId);
    setCrmCompanyIds(newCrmIds);

    const updatedCompanies = companies.map(c => {
      if (c.id === companyId) {
        return { ...c, crmStage: CRMStage.IDENTIFIED }; // Reset back to raw state
      }
      return c;
    });

    setCompanies(updatedCompanies);
    saveToStorage(updatedCompanies, newCrmIds);
  };

  const handleMoveCrmStage = (companyId: string, currentStage: CRMStage, direction: 'forward' | 'backward') => {
    const STAGES = [
      CRMStage.IDENTIFIED,
      CRMStage.INITIAL_CONTACT,
      CRMStage.AUDIT_SENT,
      CRMStage.NEGOTIATING,
      CRMStage.CLOSED_WON,
      CRMStage.CLOSED_LOST
    ];

    const currentIndex = STAGES.indexOf(currentStage);
    let nextIndex = currentIndex;

    if (direction === 'forward' && currentIndex < STAGES.length - 2) {
      // Don't auto-move to CLOSED_LOST, move to WON
      nextIndex = currentIndex + 1;
    } else if (direction === 'backward' && currentIndex > 0) {
      nextIndex = currentIndex - 1;
    }

    const nextStage = STAGES[nextIndex];

    const updatedCompanies = companies.map(c => {
      if (c.id === companyId) {
        return { ...c, crmStage: nextStage };
      }
      return c;
    });

    setCompanies(updatedCompanies);
    saveToStorage(updatedCompanies, crmCompanyIds);
  };

  const handleUpdateCompanyStageDirectly = (companyId: string, stageString: string) => {
    const updatedCompanies = companies.map(c => {
      if (c.id === companyId) {
        return { ...c, crmStage: stageString as CRMStage };
      }
      return c;
    });
    setCompanies(updatedCompanies);
    saveToStorage(updatedCompanies, crmCompanyIds);
  };

  const handleUpdateNotes = (companyId: string, notes: string) => {
    const updatedCompanies = companies.map(c => {
      if (c.id === companyId) {
        return { ...c, notes };
      }
      return c;
    });
    setCompanies(updatedCompanies);
    saveToStorage(updatedCompanies, crmCompanyIds);
  };

  const handleSaveAudit = (audit: AuditReport) => {
    const updatedAudits = { ...savedAudits, [audit.companyId]: audit };
    setSavedAudits(updatedAudits);
    
    // Also move stage in CRM to "Audit Sent"
    const updatedCompanies = companies.map(c => {
      if (c.id === audit.companyId) {
        return { ...c, crmStage: CRMStage.AUDIT_SENT };
      }
      return c;
    });

    setCompanies(updatedCompanies);
    saveToStorage(updatedCompanies, crmCompanyIds, updatedAudits);
  };

  // Filtered companies based on active state of filters
  const filteredCompanies = companies.filter((company) => {
    // 1. Text filter
    if (activeFilters.query) {
      const q = activeFilters.query.toLowerCase().replace(/[\./-]/g, '');
      const compCnpj = company.cnpj.replace(/[\./-]/g, '');
      const name = (company.nomeFantasia || '').toLowerCase();
      const social = (company.razaoSocial || '').toLowerCase();

      if (!name.includes(q) && !social.includes(q) && !compCnpj.includes(q)) {
        return false;
      }
    }

    // 2. State filter
    if (activeFilters.uf && company.uf !== activeFilters.uf) {
      return false;
    }

    // 3. City filter
    if (activeFilters.cidade && company.cidade.toLowerCase() !== activeFilters.cidade.toLowerCase()) {
      return false;
    }

    // 4. CNAE filter
    if (activeFilters.cnae && company.cnaePrincipal !== activeFilters.cnae) {
      return false;
    }

    // 5. GMB Health Health check status filter
    if (activeFilters.gmbFilter !== 'all') {
      const { exists, isClaimed, rating, hasWebsite, unansweredReviewsPercentage } = company.gmbStatus;

      if (activeFilters.gmbFilter === 'unclaimed' && (!exists || isClaimed)) return false;
      if (activeFilters.gmbFilter === 'not_exist' && exists) return false;
      if (activeFilters.gmbFilter === 'low_rating' && (!exists || rating >= 4.0 || rating === 0)) return false;
      if (activeFilters.gmbFilter === 'no_website' && (!exists || hasWebsite)) return false;
      if (activeFilters.gmbFilter === 'ignored_reviews' && (!exists || unansweredReviewsPercentage < 50)) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex" id="applet-root">
      {/* Navigation Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static transition-transform duration-200 ease-in-out flex flex-col justify-between border-r border-slate-950 shadow-lg`}>
        <div>
          {/* Brand Logo */}
          <div className="px-6 py-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-white text-sm tracking-wide">GMB Prospector</span>
                <span className="text-[10px] text-indigo-400 block font-semibold leading-none">B2B OTIMIZAÇÃO</span>
              </div>
            </div>
            <button className="lg:hidden p-1 text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => {
                setSelectedCompany(null);
                setActiveTab('search');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'search' && !selectedCompany
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <Search className="w-4.5 h-4.5" />
              Buscador de Leads CNPJ
            </button>

            <button
              onClick={() => {
                setSelectedCompany(null);
                setActiveTab('crm');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'crm' && !selectedCompany
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <span className="flex items-center gap-3">
                <FileSpreadsheet className="w-4.5 h-4.5" />
                CRM & Funil de Vendas
              </span>
              {crmCompanyIds.size > 0 && (
                <span className="bg-slate-800 text-slate-300 group-hover:bg-slate-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {crmCompanyIds.size}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSelectedCompany(null);
                setActiveTab('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard' && !selectedCompany
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              Métricas de Campanha
            </button>

            <button
              onClick={() => {
                setSelectedCompany(null);
                setActiveTab('saas');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'saas' && !selectedCompany
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <Zap className="w-4.5 h-4.5" />
              SaaS & Licenciamento
            </button>
          </nav>
        </div>

        {/* User Footwear Profile Info */}
        <div className="p-4 border-t border-slate-850 bg-slate-950/60 text-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
            RC
          </div>
          <div>
            <div className="font-bold text-white text-xs truncate max-w-[140px]">Rômulo Chaves</div>
            <div className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wide">Gerente Local</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Mobile-responsive bar */}
        <header className="bg-white border-b border-slate-150 h-16 flex items-center justify-between px-6 lg:justify-end shrink-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 font-medium">
              Ambiente de Produção • <strong>Conectado</strong>
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {selectedCompany ? (
            <CompanyAudit
              company={selectedCompany}
              onBack={() => setSelectedCompany(null)}
              onUpdateCompanyStage={handleUpdateCompanyStageDirectly}
              savedAudit={savedAudits[selectedCompany.id]}
              onSaveAudit={handleSaveAudit}
            />
          ) : activeTab === 'search' ? (
            <div className="space-y-6">
              <SearchFilters onSearch={handleSearch} onAddCompany={handleAddCompany} onAddCompanies={handleAddCompanies} />
              
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                    Varredura Ativa • {activeFilters.cidade ? `${activeFilters.cidade} - ${activeFilters.uf}` : 'Brasil'}
                  </span>
                  <p className="text-xs text-slate-500 leading-normal max-w-2xl">
                    Foram mapeados <strong className="text-slate-900">{filteredCompanies.length}</strong> leads com esses filtros. Dica comercial: Procure perfis <strong>"Não Reivindicados"</strong> para oferecer estruturação de SEO de R$ 300 a R$ 1.500.
                  </p>
                </div>
                {activeFilters.uf && activeFilters.cidade && (
                  <div className="flex gap-2 w-full sm:w-auto shrink-0 flex-wrap">
                    <button
                      onClick={handleAiScan}
                      disabled={isScanningAi}
                      className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-750 disabled:bg-slate-300 text-white font-extrabold rounded-xl text-xs transition-all shadow-xs shrink-0 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    >
                      {isScanningAi ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 text-white animate-spin" />
                          Escaneando com IA...
                        </>
                      ) : (
                        <>
                          <Globe className="w-3.5 h-3.5 text-emerald-200" />
                          Escanear com IA Real (Web)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <CompanyList
                companies={filteredCompanies}
                onSelectCompany={setSelectedCompany}
                onAddToCrm={handleAddToCrm}
                crmCompanyIds={crmCompanyIds}
              />
            </div>
          ) : activeTab === 'crm' ? (
            <CRMBoard
              companies={companies}
              onMoveStage={handleMoveCrmStage}
              onUpdateNotes={handleUpdateNotes}
              onRemoveFromCrm={handleRemoveFromCrm}
              onSelectCompany={setSelectedCompany}
            />
          ) : activeTab === 'dashboard' ? (
            <CampaignDashboard companies={companies} />
          ) : (
            <SaaSMonetization />
          )}
        </main>

      </div>
    </div>
  );
}
