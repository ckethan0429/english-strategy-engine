import { TemplateKey } from "./templates";

export type HeroVariant = {
  id: "A" | "B";
  headline?: string;
  subheadline?: string;
  cta?: string;
};

const variants: Record<TemplateKey, HeroVariant[]> = {
  default: [
    { id: "A" },
    {
      id: "B",
      headline: "Get a Clear Action Plan, Not More Guesswork",
      subheadline: "A short assessment gives you a personalized roadmap in minutes.",
      cta: "Get My Plan",
    },
  ],
  "real-estate": [
    { id: "A" },
    {
      id: "B",
      headline: "Stop Guessing Deals. Use a Proven Property Framework",
      subheadline: "Get a personalized property action plan based on your budget and risk profile.",
      cta: "Get My Property Plan",
    },
  ],
  marketing: [
    { id: "A" },
    {
      id: "B",
      headline: "Fix Your Funnel Bottleneck in 3 Minutes",
      subheadline: "Diagnose your growth blocker and get a conversion-focused execution plan.",
      cta: "Diagnose My Funnel",
    },
  ],
  "ai-productivity": [
    { id: "A" },
    {
      id: "B",
      headline: "Automate Busywork and Win Back Your Time",
      subheadline: "Identify your highest-ROI AI workflow and execute it this month.",
      cta: "Build My AI Workflow",
    },
  ],
};

export function pickVariant(template: TemplateKey): HeroVariant {
  if (typeof window === "undefined") return variants[template][0];

  const key = `ab_variant_${template}`;
  const existing = window.localStorage.getItem(key);
  if (existing === "A" || existing === "B") {
    return variants[template].find((v) => v.id === existing) ?? variants[template][0];
  }

  const assigned: "A" | "B" = Math.random() < 0.5 ? "A" : "B";
  window.localStorage.setItem(key, assigned);
  return variants[template].find((v) => v.id === assigned) ?? variants[template][0];
}
