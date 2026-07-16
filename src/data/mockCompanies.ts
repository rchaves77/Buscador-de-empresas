/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, CRMStage } from '../types';

export const BRAZIL_STATES = [
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'GO', nome: 'Goiás' }
];

export const CITIES_BY_STATE: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'São Bernardo do Campo'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Duque de Caxias', 'Cabo Frio'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Ouro Preto', 'Contagem', 'Juiz de Fora'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Gramado', 'Pelotas', 'Santa Maria'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Cascavel', 'Foz do Iguaçu'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'Balneário Camboriú', 'Chapecó'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Porto Seguro', 'Camaçari'],
  PE: ['Recife', 'Olinda', 'Caruaru', 'Petrolina', 'Jaboatão dos Guararapes'],
  DF: ['Brasília', 'Taguatinga', 'Ceilândia', 'Águas Claras', 'Gama'],
  GO: ['Goiânia', 'Anápolis', 'Aparecida de Goiânia', 'Rio Verde', 'Caldas Novas']
};

export const SECTORS = [
  { cnae: '5611-2/01', descricao: 'Restaurantes e Similares', tag: 'Alimentação' },
  { cnae: '8630-5/04', descricao: 'Atividade Odontológica', tag: 'Saúde' },
  { cnae: '4520-0/01', descricao: 'Serviços de Manutenção Automotiva', tag: 'Mecânica' },
  { cnae: '9602-5/01', descricao: 'Cabeleireiros, Manicure e Barbearia', tag: 'Beleza' },
  { cnae: '9313-1/00', descricao: 'Atividades de Condicionamento Físico (Academia)', tag: 'Fitness' },
  { cnae: '4771-7/01', descricao: 'Comércio Varejista de Medicamentos (Farmácia)', tag: 'Varejo' },
  { cnae: '7500-1/00', descricao: 'Atividades Veterinárias e Pet Shop', tag: 'Pets' },
  { cnae: '6911-7/01', descricao: 'Serviços de Advocacia', tag: 'Profissional' },
  { cnae: '1091-1/02', descricao: 'Padaria e Confeitaria', tag: 'Alimentação' },
  { cnae: '5510-8/01', descricao: 'Hotéis e Pousadas', tag: 'Turismo' }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp_1',
    cnpj: '45.183.921/0001-44',
    razaoSocial: 'SILVA & SANTOS RESTAURANTE LTDA',
    nomeFantasia: 'Pizzaria Bella Italia',
    uf: 'SP',
    cidade: 'São Paulo',
    bairro: 'Pinheiros',
    telefone: '(11) 98122-3456',
    email: 'contato@bellaitaliapizza.com.br',
    cnaePrincipal: '5611-2/01',
    cnaeDescricao: 'Restaurantes e Similares',
    dataAbertura: '2023-04-12',
    capitalSocial: 45000,
    gmbStatus: {
      exists: true,
      isClaimed: false, // NOT CLAIMED! Huge leverage point.
      rating: 3.8,
      reviewsCount: 14,
      hasWebsite: false, // NO WEBSITE!
      hasPhoneNumber: true,
      photosCount: 2, // Almost no photos
      missingHours: true, // Missing opening hours!
      unansweredReviewsPercentage: 85 // Not replying to customers!
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_2',
    cnpj: '23.844.112/0001-90',
    razaoSocial: 'ODONTO CLINICA SORRISO PERFEITO LTDA',
    nomeFantasia: 'OdontoSorriso Pinheiros',
    uf: 'SP',
    cidade: 'São Paulo',
    bairro: 'Jardins',
    telefone: '(11) 97321-4433',
    email: 'financeiro@odontosorriso.com.br',
    cnaePrincipal: '8630-5/04',
    cnaeDescricao: 'Atividade Odontológica',
    dataAbertura: '2022-09-18',
    capitalSocial: 120000,
    gmbStatus: {
      exists: true,
      isClaimed: true,
      rating: 4.1,
      reviewsCount: 8,
      hasWebsite: true,
      hasPhoneNumber: true,
      photosCount: 1,
      missingHours: false,
      unansweredReviewsPercentage: 100 // Never replied to a review
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_3',
    cnpj: '12.001.984/0001-02',
    razaoSocial: 'CENTRO DE ESTETICA E BELEZA GLAMOUR LTDA',
    nomeFantasia: 'Glamour Hair & Spa',
    uf: 'RJ',
    cidade: 'Rio de Janeiro',
    bairro: 'Copacabana',
    telefone: '(21) 99182-7744',
    email: 'contato@glamourcopa.com.br',
    cnaePrincipal: '9602-5/01',
    cnaeDescricao: 'Cabeleireiros, Manicure e Barbearia',
    dataAbertura: '2024-01-10',
    capitalSocial: 30000,
    gmbStatus: {
      exists: false, // DOES NOT EVEN EXIST ON GOOGLE MAPS! Excellent opportunity.
      isClaimed: false,
      rating: 0,
      reviewsCount: 0,
      hasWebsite: false,
      hasPhoneNumber: false,
      photosCount: 0,
      missingHours: true,
      unansweredReviewsPercentage: 0
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_4',
    cnpj: '38.291.022/0001-78',
    razaoSocial: 'OFICINA AUTOMOTIVA MOTORTECH LTDA',
    nomeFantasia: 'MotorTech Auto Center',
    uf: 'MG',
    cidade: 'Belo Horizonte',
    bairro: 'Savassi',
    telefone: '(31) 98822-1100',
    email: 'atendimento@motortechbh.com',
    cnaePrincipal: '4520-0/01',
    cnaeDescricao: 'Serviços de Manutenção Automotiva',
    dataAbertura: '2021-11-05',
    capitalSocial: 85000,
    gmbStatus: {
      exists: true,
      isClaimed: false, // Unclaimed GMB profile
      rating: 3.4, // Low rating
      reviewsCount: 22,
      hasWebsite: false,
      hasPhoneNumber: true,
      photosCount: 4,
      missingHours: true,
      unansweredReviewsPercentage: 90
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_5',
    cnpj: '09.341.281/0001-15',
    razaoSocial: 'ACADEMIA FIT FOR LIFE LTDA',
    nomeFantasia: 'Fit For Life Club',
    uf: 'RS',
    cidade: 'Porto Alegre',
    bairro: 'Moinhos de Vento',
    telefone: '(51) 99311-8844',
    email: 'comercial@fitforlifeclub.com.br',
    cnaePrincipal: '9313-1/00',
    cnaeDescricao: 'Atividades de Condicionamento Físico (Academia)',
    dataAbertura: '2023-08-22',
    capitalSocial: 250000,
    gmbStatus: {
      exists: true,
      isClaimed: true,
      rating: 4.6,
      reviewsCount: 154,
      hasWebsite: true,
      hasPhoneNumber: true,
      photosCount: 48,
      missingHours: false,
      unansweredReviewsPercentage: 10 // Well optimized (Good benchmark)
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_6',
    cnpj: '18.232.091/0001-09',
    razaoSocial: 'PADARIA ESPACO DO PAO LTDA',
    nomeFantasia: 'Espaço do Pão & Confeitaria',
    uf: 'SC',
    cidade: 'Florianópolis',
    bairro: 'Centro',
    telefone: '(48) 99151-2299',
    email: 'espacodopao@gmail.com',
    cnaePrincipal: '1091-1/02',
    cnaeDescricao: 'Padaria e Confeitaria',
    dataAbertura: '2024-03-01',
    capitalSocial: 60000,
    gmbStatus: {
      exists: true,
      isClaimed: false, // Unclaimed!
      rating: 4.2,
      reviewsCount: 12,
      hasWebsite: false,
      hasPhoneNumber: true,
      photosCount: 1,
      missingHours: true,
      unansweredReviewsPercentage: 92
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_7',
    cnpj: '28.329.412/0001-33',
    razaoSocial: 'PET SHOP E CLINICA VET CAO FELIZ LTDA',
    nomeFantasia: 'Pet Shop Cão Feliz',
    uf: 'PR',
    cidade: 'Curitiba',
    bairro: 'Batel',
    telefone: '(41) 99555-4321',
    email: 'contato@caofelizcuritiba.com.br',
    cnaePrincipal: '7500-1/00',
    cnaeDescricao: 'Atividades Veterinárias e Pet Shop',
    dataAbertura: '2023-01-15',
    capitalSocial: 50000,
    gmbStatus: {
      exists: true,
      isClaimed: false,
      rating: 3.1, // Bad rating, needs rescue!
      reviewsCount: 31,
      hasWebsite: false,
      hasPhoneNumber: true,
      photosCount: 3,
      missingHours: false,
      unansweredReviewsPercentage: 95
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_8',
    cnpj: '04.192.831/0001-22',
    razaoSocial: 'HOTEL E POUSADA PARADISO DOS CORAIS LTDA',
    nomeFantasia: 'Pousada Paradiso dos Corais',
    uf: 'BA',
    cidade: 'Porto Seguro',
    bairro: 'Praia de Taperapuan',
    telefone: '(73) 98111-9922',
    email: 'reservas@paradisodoscorais.com.br',
    cnaePrincipal: '5510-8/01',
    cnaeDescricao: 'Hotéis e Pousadas',
    dataAbertura: '2020-07-20',
    capitalSocial: 450000,
    gmbStatus: {
      exists: true,
      isClaimed: true,
      rating: 3.9,
      reviewsCount: 88,
      hasWebsite: true,
      hasPhoneNumber: true,
      photosCount: 12, // Needs way more high quality guest photos
      missingHours: false,
      unansweredReviewsPercentage: 70
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_9',
    cnpj: '88.312.043/0001-66',
    razaoSocial: 'MERCADO E FARMACIA POPULAR DE RECIFE LTDA',
    nomeFantasia: 'Drogaria Popular Recife',
    uf: 'PE',
    cidade: 'Recife',
    bairro: 'Boa Viagem',
    telefone: '(81) 99772-4411',
    email: 'popular@farmaciarecife.com.br',
    cnaePrincipal: '4771-7/01',
    cnaeDescricao: 'Comércio Varejista de Medicamentos (Farmácia)',
    dataAbertura: '2021-02-15',
    capitalSocial: 180000,
    gmbStatus: {
      exists: true,
      isClaimed: false,
      rating: 3.7,
      reviewsCount: 15,
      hasWebsite: false,
      hasPhoneNumber: true,
      photosCount: 2,
      missingHours: true,
      unansweredReviewsPercentage: 80
    },
    crmStage: CRMStage.IDENTIFIED
  },
  {
    id: 'comp_10',
    cnpj: '31.902.182/0001-44',
    razaoSocial: 'ALMEIDA E ADVOGADOS ASSOCIADOS S/C',
    nomeFantasia: 'Almeida Advocacia Empresarial',
    uf: 'DF',
    cidade: 'Brasília',
    bairro: 'Asa Sul',
    telefone: '(61) 99223-4567',
    email: 'contato@almeidaadvocacia.com.br',
    cnaePrincipal: '6911-7/01',
    cnaeDescricao: 'Serviços de Advocacia',
    dataAbertura: '2019-10-01',
    capitalSocial: 90000,
    gmbStatus: {
      exists: true,
      isClaimed: true,
      rating: 4.8,
      reviewsCount: 3, // Excellent rating but only 3 reviews! Needs review funnel.
      hasWebsite: true,
      hasPhoneNumber: true,
      photosCount: 5,
      missingHours: false,
      unansweredReviewsPercentage: 33
    },
    crmStage: CRMStage.IDENTIFIED
  }
];

export function generateRandomCompanies(uf: string, city: string, count: number): Company[] {
  const customSectors = [...SECTORS];
  const bneighborhoods: Record<string, string[]> = {
    SP: ['Moema', 'Vila Mariana', 'Tatuapé', 'Itaim Bibi', 'Santana'],
    RJ: ['Ipanema', 'Botafogo', 'Barra da Tijuca', 'Leblon', 'Flamengo'],
    MG: ['Lourdes', 'Pampulha', 'Funcionários', 'Anchieta', 'Prado'],
    RS: ['Bela Vista', 'Moinhos', 'Bom Fim', 'Petrópolis', 'Tristeza'],
    SC: ['Trindade', 'Estreito', 'Coqueiros', 'Agronômica', 'Jurerê'],
    PR: ['Portão', 'Água Verde', 'Cabral', 'Mercês', 'Jardim Social'],
    BA: ['Pituba', 'Barra', 'Caminho das Árvores', 'Rio Vermelho', 'Graça'],
    PE: ['Graças', 'Pina', 'Espinheiro', 'Casa Forte', 'Madalena'],
    DF: ['Asa Norte', 'Lago Sul', 'Lago Norte', 'Sudoeste', 'Guará'],
    GO: ['Setor Bueno', 'Setor Oeste', 'Setor Marista', 'Setor Sul', 'Jardim Goiás']
  };

  const neighborhoods = bneighborhoods[uf] || ['Centro', 'Bairro Novo', 'Industrial'];
  const companies: Company[] = [];

  for (let i = 0; i < count; i++) {
    const sectorIndex = Math.floor(Math.random() * customSectors.length);
    const sector = customSectors[sectorIndex];
    const neighborhood = neighborhoods[Math.floor(Math.random() * neighborhoods.length)];

    const idNum = Math.floor(1000 + Math.random() * 9000);
    const cnpj = `${Math.floor(10 + Math.random() * 89)}.${Math.floor(100 + Math.random() * 899)}.${Math.floor(100 + Math.random() * 899)}/0001-${Math.floor(10 + Math.random() * 89)}`;
    const randomYear = Math.floor(2020 + Math.random() * 6);
    const randomMonth = String(Math.floor(1 + Math.random() * 11)).padStart(2, '0');
    const randomDay = String(Math.floor(1 + Math.random() * 27)).padStart(2, '0');
    const dataAbertura = `${randomYear}-${randomMonth}-${randomDay}`;

    const fantList = {
      '5611-2/01': ['Gourmet Corner', 'Cantina di Roma', 'Sabor Mineiro', 'Burger House', 'Sushi Way'],
      '8630-5/04': ['Odonto Clinic', 'Sorriso & Arte', 'Dental Care', 'Ortho Smile', 'Viva Odonto'],
      '4520-0/01': ['Stop Car', 'Auto Centro Mecânico', 'Precision Motors', 'Car Diagnostic', 'Box Oficina'],
      '9602-5/01': ['Studio de Beleza', 'Barbearia Vintage', 'Glow Hair Design', 'Nails & Beauty', 'Bella Donna Salon'],
      '9313-1/00': ['Oxygen Gym', 'Power Training', 'Vibe Fitness', 'CrossFit Box', 'Corpo e Alma Academia'],
      '4771-7/01': ['Farmácia Central', 'Drogaria MultiFarma', 'Farma Vida', 'Drogaria Popular', 'PharmaCare'],
      '7500-1/00': ['Amigo Pet Shop', 'Clínica Vet Patinhas', 'Mundo Animal', 'Pet Elegance', 'Cuidado Animal'],
      '6911-7/01': ['Oliveira & Associados', 'Advocacia Integrada', 'Consultoria Jurídica', 'Pinto & Silva Advogados', 'Luz e Defesa'],
      '1091-1/02': ['Pão Quente', 'Trigo de Ouro', 'Delícias da Padaria', 'Sweet Bakery', 'Espaço Doce Confeitaria'],
      '5510-8/01': ['Pousada Mar Azul', 'Hotel Sol Nascente', 'Green Valley Inn', 'Pousada da Colina', 'Palace Hotel']
    };

    const fantNameChoices = fantList[sector.cnae as keyof typeof fantList] || ['Comércio Geral', 'Serviços do Bairro'];
    const nomeFantasia = `${fantNameChoices[Math.floor(Math.random() * fantNameChoices.length)]} ${city}`;
    const razaoSocial = `${nomeFantasia.toUpperCase()} LTDA`;

    const exists = Math.random() > 0.15;
    const isClaimed = exists ? Math.random() > 0.6 : false;
    const rating = exists ? parseFloat((3.0 + Math.random() * 2.0).toFixed(1)) : 0;
    const reviewsCount = exists ? (Math.random() > 0.5 ? Math.floor(1 + Math.random() * 15) : Math.floor(15 + Math.random() * 120)) : 0;
    const hasWebsite = exists ? Math.random() > 0.5 : false;
    const hasPhoneNumber = exists ? Math.random() > 0.1 : false;
    const photosCount = exists ? Math.floor(Math.random() * 15) : 0;
    const missingHours = exists ? Math.random() > 0.4 : true;
    const unansweredReviewsPercentage = reviewsCount > 0 ? Math.floor(40 + Math.random() * 60) : 0;

    companies.push({
      id: `comp_rand_${idNum}_${uf}_${i}`,
      cnpj,
      razaoSocial,
      nomeFantasia,
      uf,
      cidade: city,
      bairro: neighborhood,
      telefone: `(${uf === 'SP' ? '11' : uf === 'RJ' ? '21' : '41'}) 9${Math.floor(8000 + Math.random() * 1999)}-${Math.floor(1000 + Math.random() * 8999)}`,
      email: `contato@${nomeFantasia.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.br`,
      cnaePrincipal: sector.cnae,
      cnaeDescricao: sector.descricao,
      dataAbertura,
      capitalSocial: Math.floor(10000 + Math.random() * 200000),
      gmbStatus: {
        exists,
        isClaimed,
        rating,
        reviewsCount,
        hasWebsite,
        hasPhoneNumber,
        photosCount,
        missingHours,
        unansweredReviewsPercentage
      },
      crmStage: CRMStage.IDENTIFIED
    });
  }

  return companies;
}
