import { TemplateKey } from "./templates";

export type OfferTier = {
  name: string;
  price: string;
  description: string;
  ctaLabel: string;
};

export type OfferPack = {
  tripwire: OfferTier;
  core: OfferTier;
};

const packs: Record<TemplateKey, OfferPack> = {
  default: {
    tripwire: {
      name: "Quick Action Kit",
      price: "₩9,900",
      description: "템플릿 + 체크리스트 + 7일 실행 플랜",
      ctaLabel: "Get Starter Kit",
    },
    core: {
      name: "Execution Accelerator",
      price: "₩290,000",
      description: "맞춤 피드백 + 실행 시스템 구축",
      ctaLabel: "Book Strategy Call",
    },
  },
  "real-estate": {
    tripwire: {
      name: "Deal Check Pro Sheet",
      price: "₩19,000",
      description: "실전 매물 평가 시트 + 수익률 계산기",
      ctaLabel: "Get Deal Sheet",
    },
    core: {
      name: "Property Strategy Session",
      price: "₩390,000",
      description: "1:1 포트폴리오/매수전략 컨설팅",
      ctaLabel: "Book Property Session",
    },
  },
  marketing: {
    tripwire: {
      name: "Hook & Funnel Kit",
      price: "₩15,000",
      description: "고전환 카피 템플릿 + 랜딩 구조",
      ctaLabel: "Get Funnel Kit",
    },
    core: {
      name: "Growth Sprint Program",
      price: "₩490,000",
      description: "4주 퍼널 개선 + 전환 최적화",
      ctaLabel: "Book Growth Sprint",
    },
  },
  "ai-productivity": {
    tripwire: {
      name: "AI Workflow Starter",
      price: "₩12,000",
      description: "50개 프롬프트 + 자동화 미니 가이드",
      ctaLabel: "Get AI Starter",
    },
    core: {
      name: "AI Ops Build",
      price: "₩590,000",
      description: "실무 자동화 워크플로우 설계/구축",
      ctaLabel: "Book AI Ops Build",
    },
  },
};

export function getOffers(template: TemplateKey, leadGrade: "COLD" | "WARM" | "HOT") {
  const pack = packs[template] ?? packs.default;

  if (leadGrade === "HOT") {
    return [pack.core, pack.tripwire];
  }
  return [pack.tripwire, pack.core];
}
