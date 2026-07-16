/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Building2, SlidersHorizontal, Plus, Briefcase, Phone, Hash, RotateCw, Globe } from 'lucide-react';
import { BRAZIL_STATES, CITIES_BY_STATE, SECTORS } from '../data/mockCompanies';
import { Company, CRMStage } from '../types';

interface SearchFiltersProps {
  onSearch: (filters: {
    query: string;
    uf: string;
    cidade: string;
    cnae: string;
    gmbFilter: string;
  }) => void;
  onAddCompany: (company: Company) => void;
}

export default function SearchFilters({ onSearch, onAddCompany }: SearchFiltersProps) {
  const [query, setQuery] = useState('');
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [selectedCnae, setSelectedCnae] = useState('');
  const [gmbFilter, setGmbFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for manually adding a company
  const [newCnpj, setNewCnpj] = useState('');
  const [newName, setNewName] = useState('');
  const [newUf, setNewUf] = useState('SP');
  const [newCity, setNewCity] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSector, setNewSector] = useState(SECTORS[0].cnae);
  const [newGmbExists, setNewGmbExists] = useState(true);
  const [newGmbClaimed, setNewGmbClaimed] = useState(false);
  const [newRating, setNewRating] = useState('3.5');

  // Express CNPJ Lookup State
  const [cnpjExpress, setCnpjExpress] = useState('');
  const [isExpressLoading, setIsExpressLoading] = useState(false);
  const [expressError, setExpressError] = useState('');

  const handleUfChange = (uf: string) => {
    setSelectedUf(uf);
    setSelectedCidade(''); // Reset city on state change
    triggerSearch(query, uf, '', selectedCnae, gmbFilter);
  };

  const handleCityChange = (city: string) => {
    setSelectedCidade(city);
    triggerSearch(query, selectedUf, city, selectedCnae, gmbFilter);
  };

  const handleCnaeChange = (cnae: string) => {
    setSelectedCnae(cnae);
    triggerSearch(query, selectedUf, selectedCidade, cnae, gmbFilter);
  };

  const handleGmbFilterChange = (filter: string) => {
    setGmbFilter(filter);
    triggerSearch(query, selectedUf, selectedCidade, selectedCnae, filter);
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSearch(query, selectedUf, selectedCidade, selectedCnae, gmbFilter);
  };

  const triggerSearch = (q: string, uf: string, city: string, cnae: string, gmb: string) => {
    onSearch({ query: q, uf, cidade: city, cnae, gmbFilter: gmb });
  };

  const handleSubmitNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCnpj || !newName || !newCity || !newPhone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const selectedSec = SECTORS.find(s => s.cnae === newSector) || SECTORS[0];

    const added: Company = {
      id: `comp_custom_${Date.now()}`,
      cnpj: newCnpj,
      razaoSocial: `${newName.toUpperCase()} LTDA`,
      nomeFantasia: newName,
      uf: newUf,
      cidade: newCity,
      bairro: 'Centro',
      telefone: newPhone,
      email: `contato@${newName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
      cnaePrincipal: selectedSec.cnae,
      cnaeDescricao: selectedSec.descricao,
      dataAbertura: new Date().toISOString().split('T')[0],
      capitalSocial: 50000,
      gmbStatus: {
        exists: newGmbExists,
        isClaimed: newGmbExists ? newGmbClaimed : false,
        rating: newGmbExists ? parseFloat(newRating) : 0,
        reviewsCount: newGmbExists ? Math.floor(Math.random() * 25) + 3 : 0,
        hasWebsite: Math.random() > 0.5,
        hasPhoneNumber: true,
        photosCount: Math.floor(Math.random() * 5),
        missingHours: Math.random() > 0.5,
        unansweredReviewsPercentage: Math.floor(40 + Math.random() * 60)
      },
      crmStage: CRMStage.IDENTIFIED
    };

    onAddCompany(added);
    setShowAddModal(false);
    // Reset form
    setNewCnpj('');
    setNewName('');
    setNewCity('');
    setNewPhone('');
  };

  const cities = selectedUf ? CITIES_BY_STATE[selectedUf] || [] : [];

  return (
    <div className="bg-white rounded-xl border border-slate-150 p-5 shadow-xs mb-6" id="search-filters-container">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            Buscador Nacional de Leads (CNPJ)
          </h2>
          <p className="text-sm text-slate-500">
            Filtre empresas de todo o Brasil e identifique graves falhas de presença digital para abordagens comerciais estratégicas.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
          id="btn-register-company"
        >
          <Plus className="w-4 h-4" />
          Cadastrar Empresa Manualmente
        </button>
      </div>

      <form onSubmit={handleSearchClick} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3">
        {/* Keyword Search */}
        <div className="lg:col-span-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Nome fantasia, Razão Social ou CNPJ..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              triggerSearch(e.target.value, selectedUf, selectedCidade, selectedCnae, gmbFilter);
            }}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        {/* State Filter */}
        <div className="lg:col-span-2 relative">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            value={selectedUf}
            onChange={(e) => handleUfChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 appearance-none bg-white"
          >
            <option value="">Brasil (Todos)</option>
            {BRAZIL_STATES.map((st) => (
              <option key={st.uf} value={st.uf}>
                {st.uf} - {st.nome}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div className="lg:col-span-2 relative">
          <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            value={selectedCidade}
            onChange={(e) => handleCityChange(e.target.value)}
            disabled={!selectedUf}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 appearance-none bg-white disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">Cidades (Todas)</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Segment CNAE Filter */}
        <div className="lg:col-span-2 relative">
          <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            value={selectedCnae}
            onChange={(e) => handleCnaeChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 appearance-none bg-white"
          >
            <option value="">CNAE (Todos)</option>
            {SECTORS.map((sec) => (
              <option key={sec.cnae} value={sec.cnae}>
                {sec.tag} ({sec.cnae})
              </option>
            ))}
          </select>
        </div>

        {/* Profile Health Category Filter */}
        <div className="lg:col-span-2 relative">
          <SlidersHorizontal className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <select
            value={gmbFilter}
            onChange={(e) => handleGmbFilterChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 appearance-none bg-white"
          >
            <option value="all">Filtro de Saúde</option>
            <option value="unclaimed">Não Reivindicadas (Oportunidade de Ouro)</option>
            <option value="not_exist">Sem Ficha no Google (Urgente)</option>
            <option value="low_rating">Nota Baixa (&lt; 4.0)</option>
            <option value="no_website">Sem Site Cadastrado</option>
            <option value="ignored_reviews">Avaliações não Respondidas</option>
          </select>
        </div>
      </form>

      {/* Compact Express CNPJ Lookup Row */}
      <div className="border-t border-slate-100 my-4 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-500" />
            Consulta Direta Receita Federal (CNPJ Real)
          </span>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto max-w-md">
          <input
            type="text"
            placeholder="Digite qualquer CNPJ real (somente números)"
            value={cnpjExpress}
            onChange={(e) => {
              setCnpjExpress(e.target.value.replace(/[^0-9]/g, ''));
              setExpressError('');
            }}
            className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-mono"
            maxLength={14}
          />
          <button
            type="button"
            onClick={async () => {
              const cleaned = cnpjExpress.trim();
              if (cleaned.length !== 14) {
                setExpressError('O CNPJ deve conter exatamente 14 dígitos numéricos.');
                return;
              }
              setIsExpressLoading(true);
              setExpressError('');
              try {
                const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
                if (!res.ok) {
                  throw new Error('CNPJ não encontrado ou limite de requisições do servidor excedido.');
                }
                const data = await res.json();
                
                // Formulate a clean company object
                const imported: Company = {
                  id: `cnpj_imported_${cleaned}_${Date.now()}`,
                  cnpj: data.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
                  razaoSocial: data.razao_social || data.nome_fantasia || 'RAZÃO SOCIAL NÃO INFORMADA',
                  nomeFantasia: data.nome_fantasia || data.razao_social || 'Empresa Sem Nome Fantasia',
                  uf: data.uf || 'SP',
                  cidade: data.municipio || 'São Paulo',
                  bairro: data.bairro || 'Centro',
                  telefone: data.telefone || '(11) 99999-9999',
                  email: data.email || `contato@${(data.nome_fantasia || 'empresa').toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
                  cnaePrincipal: data.cnae_fiscal ? String(data.cnae_fiscal) : '5611-2/01',
                  cnaeDescricao: data.cnae_fiscal_descricao || 'Atividades Gerais',
                  dataAbertura: data.data_inicio_atividade || new Date().toISOString().split('T')[0],
                  capitalSocial: data.capital_social || 50000,
                  gmbStatus: {
                    exists: Math.random() > 0.3,
                    isClaimed: Math.random() > 0.6,
                    rating: parseFloat((3.0 + Math.random() * 2.0).toFixed(1)),
                    reviewsCount: Math.floor(Math.random() * 45) + 3,
                    hasWebsite: Math.random() > 0.5,
                    hasPhoneNumber: true,
                    photosCount: Math.floor(Math.random() * 12),
                    missingHours: Math.random() > 0.5,
                    unansweredReviewsPercentage: Math.floor(30 + Math.random() * 70)
                  },
                  crmStage: CRMStage.IDENTIFIED
                };

                onAddCompany(imported);
                setCnpjExpress('');
                alert(`Sucesso! "${imported.nomeFantasia}" foi importada da Receita Federal e inserida em sua lista de leads.`);
              } catch (err: any) {
                setExpressError(err.message || 'Erro ao conectar com a Receita Federal.');
              } finally {
                setIsExpressLoading(false);
              }
            }}
            disabled={isExpressLoading}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
          >
            {isExpressLoading ? (
              <>
                <RotateCw className="w-3 h-3 animate-spin" />
                Buscando...
              </>
            ) : (
              'Importar da Receita'
            )}
          </button>
        </div>
      </div>
      {expressError && (
        <p className="text-red-500 text-[10px] font-medium text-right mt-1 animate-pulse">{expressError}</p>
      )}

      {/* Manual Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 text-base">Cadastrar Empresa Personalizada</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-medium text-lg"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmitNewCompany} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Adicione qualquer empresa real ou fictícia para testar o gerador de auditorias automáticas do Google Meu Negócio.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">CNPJ *</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      placeholder="00000000000000"
                      value={newCnpj}
                      onChange={(e) => setNewCnpj(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-mono"
                      maxLength={14}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const cleaned = newCnpj.replace(/[^0-9]/g, '');
                        if (cleaned.length !== 14) {
                          alert('Digite um CNPJ válido com 14 números.');
                          return;
                        }
                        try {
                          const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleaned}`);
                          if (!res.ok) throw new Error();
                          const data = await res.json();
                          setNewName(data.nome_fantasia || data.razao_social || '');
                          setNewCity(data.municipio || '');
                          setNewUf(data.uf || 'SP');
                          setNewPhone(data.telefone || '');
                          if (data.cnae_fiscal) {
                            const cnaeStr = String(data.cnae_fiscal);
                            const matchedSector = SECTORS.find(s => s.cnae.replace(/[^0-9]/g, '') === cnaeStr.replace(/[^0-9]/g, ''));
                            if (matchedSector) {
                              setNewSector(matchedSector.cnae);
                            }
                          }
                          alert('Sucesso! Dados preenchidos automaticamente da Receita Federal.');
                        } catch (err) {
                          alert('Não foi possível obter dados deste CNPJ automaticamente.');
                        }
                      }}
                      className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer"
                    >
                      Preencher
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Nome Fantasia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Padaria do Sol"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Estado *</label>
                  <select
                    value={newUf}
                    onChange={(e) => setNewUf(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                  >
                    {BRAZIL_STATES.map(s => (
                      <option key={s.uf} value={s.uf}>{s.uf}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">Cidade *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Campinas"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp de Contato *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: (11) 99999-9999"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Segmento (CNAE) *</label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 bg-white"
                  >
                    {SECTORS.map(s => (
                      <option key={s.cnae} value={s.cnae}>{s.tag}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-100">
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-indigo-500" />
                  Simular Situação no Google Meu Negócio:
                </p>

                <div className="flex items-center gap-6 text-sm">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newGmbExists}
                      onChange={(e) => setNewGmbExists(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    Existe no Google Maps?
                  </label>

                  {newGmbExists && (
                    <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newGmbClaimed}
                        onChange={(e) => setNewGmbClaimed(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      Dono Verificado? (Reivindicada)
                    </label>
                  )}
                </div>

                {newGmbExists && (
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Nota da Ficha Atual (0 a 5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={newRating}
                      onChange={(e) => setNewRating(e.target.value)}
                      className="w-24 px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Salvar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
