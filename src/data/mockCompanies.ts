/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, CRMStage } from '../types';

export const BRAZIL_STATES = [
  { uf: 'AC', nome: 'Acre' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'RO', nome: 'Rondônia' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'TO', nome: 'Tocantins' }
];

export const CITIES_BY_STATE: Record<string, string[]> = {
  AC: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira', 'Tarauacá'],
  AL: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'Rio Largo'],
  AP: ['Macapá', 'Santana', 'Laranjal do Jari', 'Oiapoque'],
  AM: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna', 'Porto Seguro'],
  CE: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Sobral', 'Maracanaú'],
  DF: ['Brasília', 'Taguatinga', 'Ceilândia', 'Águas Claras', 'Gama'],
  ES: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Linhares'],
  GO: ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Caldas Novas'],
  MA: ['São Luís', 'Imperatriz', 'Timon', 'Caxias', 'Codó'],
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Sorriso'],
  MS: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá', 'Ponta Porã'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Ouro Preto'],
  PA: ['Belém', 'Ananindeua', 'Santarém', 'Marabá', 'Castanhal'],
  PB: ['João Pessoa', 'Campina Grande', 'Patos', 'Santa Rita', 'Sousa'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Cascavel', 'Foz do Iguaçu'],
  PE: ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru', 'Petrolina'],
  PI: ['Teresina', 'Parnaíba', 'Picos', 'Floriano', 'Piripiri'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Duque de Caxias', 'Cabo Frio'],
  RN: ['Natal', 'Mossoró', 'Parnamirim', 'Caicó', 'Macau'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Gramado', 'Pelotas', 'Santa Maria'],
  RO: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Cacoal', 'Vilhena'],
  RR: ['Boa Vista', 'Rorainópolis', 'Caracaraí', 'Mucajaí'],
  SC: ['Florianópolis', 'Joinville', 'Blumenau', 'Balneário Camboriú', 'Chapecó'],
  SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'São Bernardo do Campo'],
  SE: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto', 'Itabaiana'],
  TO: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional']
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

export const INITIAL_COMPANIES: Company[] = [];

export const STATE_DDD_MAP: Record<string, string> = {
  AC: '68',
  AL: '82',
  AP: '96',
  AM: '92',
  BA: '71',
  CE: '85',
  DF: '61',
  ES: '27',
  GO: '62',
  MA: '98',
  MT: '65',
  MS: '67',
  MG: '31',
  PA: '91',
  PB: '83',
  PR: '41',
  PE: '81',
  PI: '86',
  RJ: '21',
  RN: '84',
  RS: '51',
  RO: '69',
  RR: '95',
  SC: '48',
  SP: '11',
  SE: '79',
  TO: '63'
};

export function generateRandomCompanies(uf: string, city: string, count: number): Company[] {
  return [];
}
