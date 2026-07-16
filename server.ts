/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Google GenAI
let ai: GoogleGenAI | null = null;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini AI initialized successfully.');
  } catch (err) {
    console.error('Error initializing Gemini AI:', err);
  }
} else {
  console.log('Using simulated auditor engine (no valid GEMINI_API_KEY configured).');
}

// 1. Audit API Endpoint
app.post('/api/audit', async (req, res) => {
  const { company } = req.body;

  if (!company) {
    return res.status(400).json({ error: 'Os dados da empresa são obrigatórios.' });
  }

  const { nomeFantasia, razaoSocial, uf, cidade, bairro, cnaeDescricao, gmbStatus } = company;

  // Build a highly detailed prompt to make Gemini create a premium, consultative B2B audit report
  const prompt = `Você é um Engenheiro de SEO Local e Especialista em Perfil de Empresa do Google (Google Meu Negócio).
Gere uma auditoria detalhada e profissional em PORTUGUÊS BRASILEIRO para a seguinte empresa:
- Nome Fantasia: ${nomeFantasia}
- Razão Social: ${razaoSocial}
- CNAE/Segmento: ${cnaeDescricao}
- Localização: ${bairro}, ${cidade} - ${uf}

Status Atual do Perfil no Google (Simulação de Varredura):
- Existe no Google Maps? ${gmbStatus.exists ? 'Sim' : 'Não'}
- Reivindicado/Dono Verificado? ${gmbStatus.isClaimed ? 'Sim' : 'Não'}
- Nota Média: ${gmbStatus.rating} estrelas (Total de avaliações: ${gmbStatus.reviewsCount})
- Possui Website cadastrado? ${gmbStatus.hasWebsite ? 'Sim' : 'Não'}
- Possui Telefone visível? ${gmbStatus.hasPhoneNumber ? 'Sim' : 'Não'}
- Quantidade de fotos: ${gmbStatus.photosCount}
- Horário de funcionamento cadastrado? ${gmbStatus.missingHours ? 'Não' : 'Sim'}
- Porcentagem de avaliações sem resposta do proprietário: ${gmbStatus.unansweredReviewsPercentage}%

Gere um JSON com o seguinte formato exato (sem Markdown ao redor, apenas o objeto JSON puro):
{
  "overallScore": <número de 0 a 100 representando a saúde geral do perfil>,
  "criticalGaps": ["gargalo 1", "gargalo 2", "gargalo 3"],
  "opportunityLossEstimated": <número representando estimativa realista de perda financeira mensal em Reais (R$) por não estar otimizado, baseado no segmento da empresa>,
  "aiAnalysisText": "<Uma análise extremamente consultiva de 3 parágrafos curtos explicando o impacto dessa situação local. Explique como clientes estão deixando de ligar ou visitar e indo para os concorrentes de forma persuasiva, de modo que convença a empresa a contratar um gerente de perfil>",
  "actionPlan": [
    {
      "title": "<título do passo de otimização>",
      "description": "<explicação curta em português>",
      "impact": "Alto" | "Médio" | "Baixo",
      "difficulty": "Fácil" | "Médio" | "Difícil"
    }
  ]
}`;

  // If Gemini client is active, call it
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
      });

      const responseText = response.text;
      if (responseText) {
        const cleanedText = responseText.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        const parsedReport = JSON.parse(cleanedText);
        return res.json(parsedReport);
      }
    } catch (apiError) {
      console.error('Gemini API call failed, reverting to local backup:', apiError);
    }
  }

  // Robust Fallback calculations when Gemini is offline or not configured
  // This ensures high-fidelity simulations that perfectly illustrate the business logic
  const missingPoints = [
    !gmbStatus.exists ? 40 : 0,
    !gmbStatus.isClaimed ? 20 : 0,
    gmbStatus.rating < 4.0 ? 15 : 0,
    !gmbStatus.hasWebsite ? 10 : 0,
    !gmbStatus.hasPhoneNumber ? 10 : 0,
    gmbStatus.photosCount < 5 ? 10 : 0,
    gmbStatus.missingHours ? 10 : 0,
    gmbStatus.unansweredReviewsPercentage > 50 ? 10 : 0
  ];
  const calculatedScore = Math.max(15, 100 - missingPoints.reduce((a, b) => a + b, 0));

  const gaps: string[] = [];
  if (!gmbStatus.exists) gaps.push('A empresa sequer existe no Google Maps, impedindo qualquer descoberta local.');
  else if (!gmbStatus.isClaimed) gaps.push('Perfil não reivindicado: qualquer pessoa ou concorrente pode alterar os dados ou marcar como "fechado permanentemente".');
  if (gmbStatus.rating > 0 && gmbStatus.rating < 4.2) gaps.push(`A reputação de ${gmbStatus.rating} estrelas afasta potenciais clientes exigentes.`);
  if (!gmbStatus.hasWebsite) gaps.push('Falta de site/link de agendamento que converta cliques em vendas imediatas.');
  if (gmbStatus.missingHours) gaps.push('Falta de horário de funcionamento, causando frustração se o cliente for até o local físico.');
  if (gmbStatus.unansweredReviewsPercentage > 50) gaps.push(`${gmbStatus.unansweredReviewsPercentage}% das opiniões dos clientes são ignoradas, o que reduz o ranking do Google.`);

  if (gaps.length === 0) {
    gaps.push('Falta de fotos profissionais atualizadas frequentemente.');
    gaps.push('Ausência de postagens semanais com ofertas para atrair tráfego orgânico.');
  }

  // Standard lost revenue models based on typical niches
  let baseLoss = 2200;
  if (cnaeDescricao.toLowerCase().includes('odont') || cnaeDescricao.toLowerCase().includes('vet')) baseLoss = 8500;
  else if (cnaeDescricao.toLowerCase().includes('restaurante') || cnaeDescricao.toLowerCase().includes('padaria')) baseLoss = 4500;
  else if (cnaeDescricao.toLowerCase().includes('academia')) baseLoss = 6000;
  else if (cnaeDescricao.toLowerCase().includes('hotel')) baseLoss = 12000;

  const opportunityLossEstimated = Math.round(baseLoss * (gaps.length * 0.4));

  const aiAnalysisText = `Ao analisarmos o perfil da "${nomeFantasia}" em ${cidade}, identificamos vulnerabilidades críticas de presença digital local que impactam diretamente o faturamento. Atualmente, mais de 84% das pessoas usam o Google Maps para encontrar serviços próximos. A ausência de otimizações de SEO local faz com que sua empresa seja escondida pelo algoritmo, enviando clientes qualificados diretamente para seus concorrentes diretos que estão melhores ranqueados.

${!gmbStatus.isClaimed ? 'O fato de o perfil não estar oficialmente reivindicado representa um risco de segurança digital sério. Qualquer usuário mal-intencionado ou concorrente pode sugerir modificações de telefone, endereço ou até mesmo alterar o status para "fechado".' : 'A falta de interações ativas e de postagens semanais sinaliza para o Google que o negócio pode estar inativo.'} Além disso, a alta taxa de avaliações sem resposta (${gmbStatus.unansweredReviewsPercentage}%) reduz a confiabilidade e desestimula novos contatos.

O potencial de recuperação de faturamento é expressivo. Pequenas correções estratégicas na ficha (imagens geo-referenciadas, respostas estruturadas com palavras-chave de busca e atualização cadastral) podem elevar o perfil para as primeiras posições da pesquisa local (Local 3-Pack), aumentando as ligações e visitas físicas sem a necessidade de gastar com anúncios pagos.`;

  const actionPlan = [
    {
      title: !gmbStatus.exists ? 'Criação e Registro da Ficha' : (!gmbStatus.isClaimed ? 'Reivindicação e Verificação da Ficha' : 'Blindagem de Perfil contra alterações'),
      description: !gmbStatus.exists ? 'Registrar a empresa oficialmente no Google Maps.' : 'Assumir controle administrativo do perfil para evitar alterações de terceiros.',
      impact: 'Alto' as const,
      difficulty: 'Médio' as const
    },
    {
      title: 'Configuração de Funil Automatizado de Avaliações 5 Estrelas',
      description: 'Implementar QR Code físico e link curto para captar novas avaliações de clientes satisfeitos.',
      impact: 'Alto' as const,
      difficulty: 'Fácil' as const
    },
    {
      title: 'Geolocalização de Imagens e SEO Local',
      description: 'Inserir fotos reais com metadados geográficos para forçar o algoritmo do Google a recomendar o local para pessoas muito próximas.',
      impact: 'Médio' as const,
      difficulty: 'Médio' as const
    },
    {
      title: 'Criação de FAQ e Postagens Semanais de Ofertas',
      description: 'Publicar novidades e produtos diretamente na ficha para manter o perfil com status "Ativo e Relevante".',
      impact: 'Médio' as const,
      difficulty: 'Fácil' as const
    }
  ];

  res.json({
    overallScore: calculatedScore,
    criticalGaps: gaps.slice(0, 3),
    opportunityLossEstimated,
    aiAnalysisText,
    actionPlan
  });
});

// 2. Outreach Pitch Generator API Endpoint
app.post('/api/suggest-pitch', async (req, res) => {
  const { company, auditResult } = req.body;

  if (!company || !auditResult) {
    return res.status(400).json({ error: 'Os dados da empresa e da auditoria são obrigatórios.' });
  }

  const { nomeFantasia, uf, cidade, telefone } = company;
  const { overallScore, opportunityLossEstimated, criticalGaps } = auditResult;

  const prompt = `Gere uma mensagem de contato comercial persuasiva para enviar via WhatsApp para a empresa "${nomeFantasia}".
O objetivo é vender o serviço de Gestão e Otimização do Perfil de Empresas no Google (Google Meu Negócio).
A abordagem DEVE ser altamente consultiva, focando em ajudar, educar e apontar melhorias, e NUNCA parecer spam invasivo.

Dados da Auditoria de Entrada:
- Score de Saúde do Perfil: ${overallScore}/100
- Perda Estimada Mensal de Oportunidades: R$ ${opportunityLossEstimated}
- Principais Gargalos identificados: ${criticalGaps.join(', ')}

Gere um JSON com o seguinte formato exato (apenas JSON puro):
{
  "whatsappText": "<Mensagem de WhatsApp formatada com quebras de linha e negritos (*texto*) apropriados para leitura dinâmica. Comece se apresentando profissionalmente, mencione que realizou uma análise de visibilidade gratuita para o setor deles em ${cidade} e identificou oportunidades de melhoria que estão fazendo eles perderem cerca de R$ ${opportunityLossEstimated}/mês. Seja cortês e encerre convidando para uma breve ligação de 5 minutos.>",
  "emailSubject": "Análise de Visibilidade Local e Otimização - ${nomeFantasia}",
  "emailText": "<Texto do e-mail comercial formal, explicando detalhadamente os gargalos identificados e se oferecendo para uma consultoria diagnóstica gratuita de 10 minutos.>"
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.8,
        }
      });

      const responseText = response.text;
      if (responseText) {
        const cleanedText = responseText.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        const parsedPitch = JSON.parse(cleanedText);
        return res.json(parsedPitch);
      }
    } catch (err) {
      console.error('Gemini pitch generation failed, using fallback script:', err);
    }
  }

  // High-value Portuguese Pitch Copy Fallback
  const whatsappText = `Olá! Tudo bem? Me chamo [Seu Nome], sou especialista em posicionamento local aqui em ${cidade}.

Estava realizando um levantamento de visibilidade para empresas do seu segmento e analisei a presença digital da *${nomeFantasia}*.

Identifiquei alguns pontos importantes que podem estar fazendo vocês perderem clientes qualificados todos os dias para concorrentes da região. Por exemplo:
🚨 *${criticalGaps[0] || 'Perfil incompleto e vulnerável'}*

Estimo que essas pequenas falhas possam estar gerando um impacto de até *R$ ${opportunityLossEstimated.toLocaleString('pt-BR')}* por mês em vendas perdidas por falta de visibilidade local.

Eu preparei uma análise de otimização detalhada da sua ficha e gostaria de te apresentar em uma conversa de apenas 5 minutinhos. Qual o melhor horário para ligar para você hoje ou amanhã?`;

  const emailSubject = `Diagnóstico de Visibilidade do Google Maps - ${nomeFantasia}`;
  const emailText = `Prezado(a) Gestor(a) da ${nomeFantasia},

Espero que este e-mail o(a) encontre bem.

Meu nome é [Seu Nome] e atuo como Consultor de Crescimento Local e Otimização de Perfis do Google Empresas.

Recentemente, conduzi um estudo de tráfego orgânico e geolocalização para negócios do seu nicho em ${cidade} - ${uf} e notei algumas oportunidades cruciais de melhoria na presença do Google Maps da ${nomeFantasia}.

Identificamos os seguintes pontos de atenção:
1. ${criticalGaps[0] || 'Vulnerabilidades cadastrais básicas.'}
2. ${criticalGaps[1] || 'Oportunidade de expansão de imagens indexadas.'}
3. ${criticalGaps[2] || 'Ausência de funil ativo de captação de avaliações.'}

Estes gargalos fazem com que o Google prefira exibir seus concorrentes diretos no mapa no momento em que o consumidor está ativamente buscando pelo que vocês vendem. O prejuízo mensal decorrente dessa perda de visibilidade pode atingir R$ ${opportunityLossEstimated.toLocaleString('pt-BR')}.

Desenvolvi um plano de ação simples de 3 etapas para corrigir esses pontos e blindar sua ficha. Gostaria de agendar uma breve reunião de 10 minutos para lhe apresentar estas recomendações sem qualquer custo ou compromisso.

Qual seria o seu melhor dia e horário na próxima semana?

Atenciosamente,
[Seu Nome]
Especialista em Google Perfil de Empresas`;

  res.json({
    whatsappText,
    emailSubject,
    emailText
  });
});

// 3. AI Real-time Scan with Google Search Grounding API Endpoint
app.post('/api/scan-ai', async (req, res) => {
  const { uf, cidade, cnae, cnaeDescricao } = req.body;

  if (!uf || !cidade) {
    return res.status(400).json({ error: 'UF e Cidade são obrigatórios.' });
  }

  const segment = cnaeDescricao || 'Empresas Locais';

  const prompt = `Você é um robô de inteligência de mercado especializado em SEO Local e Google Meu Negócio.
Sua missão é realizar uma busca ativa na internet por empresas REAIS que de fato existem no município de "${cidade} - ${uf}" pertencentes ao segmento de "${segment}".

Você DEVE usar a ferramenta de busca do Google (Google Search) para descobrir empresas reais atuando nessa localidade nesse segmento.
Gere uma lista de até 10 empresas REAIS encontradas. Se não souber o CNPJ delas, simule um CNPJ válido e fictício no padrão brasileiro (XX.XXX.XXX/0001-XX).
Para cada empresa mapeada, pesquise ou estime de forma extremamente precisa e realista os seguintes dados:
- id: "ai_lead_" seguido de um número aleatório único
- cnpj: CNPJ da empresa (real se souber, ou fictício formatado se não souber)
- razaoSocial: Razão Social em maiúsculas (ex: "SILVA & SOUZA LTDA" ou "CLINICA SORRISO REAL LTDA")
- nomeFantasia: Nome Fantasia real da empresa (ex: "Sorriso Real Odontologia")
- uf: "${uf}"
- cidade: "${cidade}"
- bairro: Nome de um bairro real desse município onde a empresa se localiza
- telefone: Telefone real ou simulado formatado com DDD
- email: E-mail de contato real ou simulado baseado no nome (ex: contato@sorrisoreal.com.br)
- cnaePrincipal: "${cnae || '5611-2/01'}"
- cnaeDescricao: "${segment}"
- dataAbertura: Data de abertura real ou estimada no formato YYYY-MM-DD
- capitalSocial: Capital social aproximado de 10000 a 300000 (valor numérico)
- gmbStatus: Objeto contendo:
  - exists: true se ela possui ficha no Google Maps, false se não
  - isClaimed: true se o perfil é reivindicado/verificado no Google Meu Negócio, false se não (um perfil sem site, sem respostas ou mal avaliado tende a não ser reivindicado)
  - rating: nota média de 1.0 a 5.0 (0 se exists for false)
  - reviewsCount: número de avaliações (0 se exists for false)
  - hasWebsite: true se possui site ativo cadastrado, false se não
  - hasPhoneNumber: true se possui telefone visível na busca, false se não
  - photosCount: quantidade estimada de fotos publicadas (0 a 100)
  - missingHours: true se NÃO tem horário de funcionamento cadastrado, false se tem
  - unansweredReviewsPercentage: porcentagem de avaliações sem resposta do proprietário (0 a 100)

Retorne APENAS um array JSON puro (sem Markdown como \`\`\`json ou qualquer texto explicativo antes ou depois). O JSON deve conter estritamente a lista de objetos mapeados.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }],
          temperature: 0.5,
        }
      });

      const responseText = response.text;
      if (responseText) {
        const cleanedText = responseText.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        const parsedLeads = JSON.parse(cleanedText);
        return res.json({ leads: parsedLeads, realTime: true });
      }
    } catch (apiError) {
      console.error('Gemini AI real-time scan failed, falling back to local simulation:', apiError);
    }
  }

  // Fallback to empty if Gemini is offline/not key
  res.json({ leads: [], realTime: false, message: 'Revertido para simulação local por falta de API key ou falha.' });
});

// 4. AI Real-time CNPJ Contact Enrichment API Endpoint
app.post('/api/enrich-cnpj', async (req, res) => {
  const { cnpj, name, uf, city } = req.body;

  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ é obrigatório.' });
  }

  const prompt = `Você é um robô avançado de enriquecimento de dados comerciais e SEO Local.
Sua missão é realizar uma busca minuciosa na internet real utilizando o Google Search para encontrar informações de CONTATO ATIVAS E REAIS (Telefones comerciais, WhatsApps reais, e-mails de contato ativos e o site oficial ou perfil em redes sociais como Instagram, Facebook, LinkedIn) para a seguinte empresa:
- CNPJ: ${cnpj}
- Nome sugerido: ${name || 'Não informado'}
- Cidade/UF: ${city || ''} - ${uf || ''}

ATENÇÃO CRÍTICA:
1. O usuário precisa de NÚMEROS REAIS E VERDADEIROS obtidos na internet (não simulações fakes baseadas em padrão). Procure pelo CNPJ no Google, ache o site oficial da empresa, perfil de Instagram, Facebook ou outras listagens públicas (como Guia Mais, Telelistas, ou mapas).
2. Tente extrair o telefone e WhatsApp real com o DDD. Formate no padrão brasileiro (XX) XXXXX-XXXX ou (XX) XXXX-XXXX.
3. Se não encontrar o e-mail real, retorne vazio ou busque o padrão correto da empresa.
4. Se encontrar o site oficial ou perfil de Instagram/Facebook, preencha o campo "website".
5. Extraia também o Bairro correto onde a empresa está sediada atualmente se disponível.

Retorne APENAS um objeto JSON com o seguinte formato exato (sem Markdown \`\`\`json ou explicações, apenas o JSON puro):
{
  "telefone": "<telefone real com DDD encontrado, ou vazio se não encontrar nada real>",
  "email": "<email real de contato encontrado, ou vazio se não encontrar nada real>",
  "website": "<site oficial ou link de Instagram/Facebook encontrado>",
  "bairro": "<bairro real encontrado>",
  "cidade": "<cidade real encontrada>",
  "uf": "<UF real>",
  "nomeFantasia": "<Nome Fantasia comercial real da empresa>",
  "source_urls": ["<lista de URLs de onde você encontrou essas informações reais>"]
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          tools: [{ googleSearch: {} }],
          temperature: 0.2,
        }
      });

      const responseText = response.text;
      if (responseText) {
        const cleanedText = responseText.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
        const enrichedData = JSON.parse(cleanedText);
        return res.json(enrichedData);
      }
    } catch (apiError) {
      console.error('Gemini real-time CNPJ enrichment failed:', apiError);
    }
  }

  res.json({ error: 'Nenhum resultado real retornado pelo buscador de IA ou API key não configurada.' });
});

// Serve frontend assets
async function startServer() {
  // Vite dev server middleware integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server middleware loaded.');
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static files route loaded.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
