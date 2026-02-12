import { TemplateConfig } from "../types";

export const realEstateTemplate: TemplateConfig = {
  productName: "Real Estate Deal Clarity Generator",
  heroHeadline: "Find Your Best Property Strategy in 3 Minutes",
  heroSubheadline:
    "Answer a few questions and get a practical 4-week action plan for your real estate goal.",
  startCta: "Start Property Assessment",
  submitCta: "See My Property Plan",
  resultTitle: "Your Property Action Blueprint",
  bonusHeadline: "Unlock: Top 10 Deal-Check Checklist",
  unlockCta: "Unlock Checklist",
  bonusType: "download",
  bonusUrl: "/bonus/real-estate-checklist.md",
  questions: [
    {
      id: "capital",
      label: "Current investable capital",
      options: ["Under 50M KRW", "50M-100M KRW", "100M-300M KRW", "300M+ KRW"],
    },
    {
      id: "goal",
      label: "Primary goal",
      options: ["Monthly cashflow", "Long-term appreciation", "Tax optimization", "First home + investment"],
    },
    {
      id: "horizon",
      label: "Investment horizon",
      options: ["1 year", "2-3 years", "4-7 years", "8+ years"],
    },
    {
      id: "risk",
      label: "Risk tolerance",
      options: ["Conservative", "Balanced", "Growth-oriented", "Aggressive"],
    },
    {
      id: "blocker",
      label: "Biggest blocker",
      options: ["No clear criteria", "Fear of bad deals", "Financing complexity", "Market timing anxiety"],
    },
  ],
};
