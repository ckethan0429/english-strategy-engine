import { TemplateConfig } from "../types";

export const marketingTemplate: TemplateConfig = {
  productName: "Marketing Growth Plan Generator",
  heroHeadline: "Build a Better Lead Funnel in 3 Minutes",
  heroSubheadline:
    "Get a personalized 4-week plan to improve traffic, conversion, and lead quality.",
  startCta: "Start Growth Audit",
  submitCta: "See My Growth Plan",
  resultTitle: "Your Marketing Growth Plan",
  bonusHeadline: "Unlock: 30 High-Converting Campaign Hooks",
  unlockCta: "Unlock Bonus Hooks",
  bonusType: "download",
  questions: [
    {
      id: "stage",
      label: "Business stage",
      options: ["Pre-revenue", "Early revenue", "Growing steadily", "Scaling"],
    },
    {
      id: "channel",
      label: "Main acquisition channel",
      options: ["Content/SNS", "Paid Ads", "SEO", "Referral/Partnership"],
    },
    {
      id: "goal",
      label: "Primary growth goal",
      options: ["More leads", "Better conversion", "Lower CAC", "Higher LTV"],
    },
    {
      id: "resource",
      label: "Execution resource",
      options: ["Solo founder", "Small team", "In-house marketer", "Agency + team"],
    },
    {
      id: "blocker",
      label: "Biggest growth blocker",
      options: ["No clear message", "Weak landing page", "Low ad efficiency", "No follow-up system"],
    },
  ],
};
