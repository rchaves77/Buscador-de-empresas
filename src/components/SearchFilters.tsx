/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Building2, SlidersHorizontal, Plus, Briefcase, Phone, Hash } from 'lucide-react';
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
                  <input
                    type="text"
                    required
                    placeholder="00.000.000/0001-00"
                    value={newCnpj}
                    onChange={(e) => setNewCnpj(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
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
