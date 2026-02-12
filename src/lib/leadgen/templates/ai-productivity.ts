import { TemplateConfig } from "../types";

export const aiProductivityTemplate: TemplateConfig = {
  productName: "AI Productivity System Builder",
  heroHeadline: "Design Your AI Workflow in 3 Minutes",
  heroSubheadline:
    "Get a personalized plan to save time and automate repetitive work with AI.",
  startCta: "Start AI Workflow Assessment",
  submitCta: "See My AI Plan",
  resultTitle: "Your AI Productivity Blueprint",
  bonusHeadline: "Unlock: 50 Practical AI Prompts for Work",
  unlockCta: "Unlock Prompt Pack",
  bonusType: "download",
  questions: [
    {
      id: "role",
      label: "Your current role",
      options: ["Founder/Owner", "Manager", "Marketer", "Creator/Operator"],
    },
    {
      id: "time",
      label: "Time spent on repetitive tasks (daily)",
      options: ["Under 30 min", "30-60 min", "1-2 hours", "2+ hours"],
    },
    {
      id: "goal",
      label: "Primary AI goal",
      options: ["Save time", "Improve output quality", "Automate workflows", "Scale content/output"],
    },
    {
      id: "stack",
      label: "Current tool stack maturity",
      options: ["Almost none", "Basic AI chat", "Multiple tools", "Automation already running"],
    },
    {
      id: "blocker",
      label: "Biggest blocker",
      options: ["Prompt quality", "No clear process", "Tool overwhelm", "Team adoption"],
    },
  ],
};
