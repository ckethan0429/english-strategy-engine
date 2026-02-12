export type Question = {
  id: string;
  label: string;
  options: string[];
};

export type TemplateConfig = {
  productName: string;
  heroHeadline: string;
  heroSubheadline: string;
  startCta: string;
  submitCta: string;
  resultTitle: string;
  bonusHeadline: string;
  unlockCta: string;
  questions: Question[];
  bonusType: "video" | "download" | "custom";
  bonusUrl?: string;
};

export type Answers = Record<string, string>;

export type ResultPayload = {
  profileLabel: string;
  summary: string;
  actionPlan: string[];
  suggestedTools: string[];
  trackingMethod: string;
};

export type LeadPayload = {
  email: string;
  source: string;
  answers: Answers;
  profileLabel: string;
  leadScore?: number;
  leadGrade?: "COLD" | "WARM" | "HOT";
  scoreReasons?: string[];
  abVariant?: "A" | "B";
  selectedOffer?: string;
  consentAccepted: boolean;
  consentAcceptedAt: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
  };
};
