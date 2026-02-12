import { TemplateConfig } from "../types";

export const defaultTemplate: TemplateConfig = {
  productName: "Universal Lead Generator",
  heroHeadline: "Get a Personalized Action Plan in Minutes",
  heroSubheadline:
    "Answer a few quick questions and receive a tailored plan based on your goals.",
  startCta: "Start Assessment",
  submitCta: "See My Result",
  resultTitle: "Your Personalized Result",
  bonusHeadline: "Unlock Bonus Guide",
  unlockCta: "Unlock Bonus",
  bonusType: "custom",
  questions: [
    {
      id: "stage",
      label: "Current stage",
      options: ["Just starting", "Early traction", "Growing", "Scaling"],
    },
    {
      id: "time",
      label: "Available time per day",
      options: ["0-15 min", "15-30 min", "30-60 min", "60+ min"],
    },
    {
      id: "goal",
      label: "Primary goal",
      options: ["Get first results", "Increase conversion", "Improve consistency", "Save time"],
    },
    {
      id: "style",
      label: "Preferred approach",
      options: ["Step-by-step", "Templates", "Examples", "Hands-on practice"],
    },
    {
      id: "blocker",
      label: "Biggest blocker",
      options: ["Not enough clarity", "Low confidence", "Lack of system", "Execution gaps"],
    },
  ],
};
