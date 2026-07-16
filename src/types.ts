/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CRMStage {
  IDENTIFIED = 'identified',
  INITIAL_CONTACT = 'initial_contact',
  AUDIT_SENT = 'audit_sent',
  NEGOTIATING = 'negotiating',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost'
}

export interface GoogleProfileSimulation {
  exists: boolean;
  isClaimed: boolean;
  rating: number; // e.g. 3.4
  reviewsCount: number;
  hasWebsite: boolean;
  hasPhoneNumber: boolean;
  photosCount: number;
  missingHours: boolean;
  unansweredReviewsPercentage: number; // e.g. 80
}

export interface Company {
  id: string;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  uf: string;
  cidade: string;
  bairro: string;
  telefone: string;
  email: string;
  cnaePrincipal: string;
  cnaeDescricao: string;
  dataAbertura: string;
  capitalSocial: number;
  // Simulated GMB Status
  gmbStatus: GoogleProfileSimulation;
  // CRM Tracking
  crmStage: CRMStage;
  notes?: string;
  lastContactedAt?: string;
}

export interface AuditReport {
  companyId: string;
  overallScore: number; // 0 - 100
  criticalGaps: string[];
  opportunityLossEstimated: number; // Estimated R$ lost per month due to low visibility
  aiAnalysisText: string;
  actionPlan: {
    title: string;
    description: string;
    impact: 'Alto' | 'Médio' | 'Baixo';
    difficulty: 'Fácil' | 'Médio' | 'Difícil';
  }[];
  generatedAt: string;
}

export interface OutreachTemplate {
  id: string;
  name: string;
  category: 'first_contact' | 'audit_pitch' | 'follow_up' | 'closing';
  text: string;
}

export interface CampaignMetric {
  date: string;
  sent: number;
  opened: number;
  interested: number;
  closed: number;
}
