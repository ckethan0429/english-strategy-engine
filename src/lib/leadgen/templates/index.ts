import { defaultTemplate } from "./default";
import { realEstateTemplate } from "./real-estate";
import { marketingTemplate } from "./marketing";
import { aiProductivityTemplate } from "./ai-productivity";

export const templates = {
  default: defaultTemplate,
  "real-estate": realEstateTemplate,
  marketing: marketingTemplate,
  "ai-productivity": aiProductivityTemplate,
};

export type TemplateKey = keyof typeof templates;

export const featuredTemplates: TemplateKey[] = ["real-estate", "marketing", "ai-productivity"];
