import { Answers } from "./types";

export type LeadScoreResult = {
  score: number; // 0-100
  grade: "COLD" | "WARM" | "HOT";
  reasons: string[];
};

function pick(answers: Answers, keys: string[]) {
  for (const key of keys) {
    if (answers[key]) return answers[key];
  }
  return "";
}

export function scoreLead(answers: Answers): LeadScoreResult {
  const goal = pick(answers, ["goal", "primaryGoal"]).toLowerCase();
  const time = pick(answers, ["time", "capacity", "exposure"]).toLowerCase();
  const stage = pick(answers, ["stage", "level", "capital", "resource"]).toLowerCase();
  const blocker = pick(answers, ["blocker", "pain", "struggle"]).toLowerCase();

  let score = 40;
  const reasons: string[] = [];

  if (goal.includes("conversion") || goal.includes("automate") || goal.includes("cashflow")) {
    score += 15;
    reasons.push("Clear commercial goal");
  }

  if (time.includes("30-60") || time.includes("1-2") || time.includes("60+") || time.includes("2+")) {
    score += 15;
    reasons.push("Execution capacity is moderate/high");
  } else if (time.includes("0-15") || time.includes("under 30") || time.includes("0-10")) {
    score -= 5;
    reasons.push("Execution capacity is currently limited");
  }

  if (stage.includes("growing") || stage.includes("scaling") || stage.includes("early revenue") || stage.includes("100m") || stage.includes("300m")) {
    score += 15;
    reasons.push("Stage suggests budget/readiness");
  }

  if (blocker.includes("system") || blocker.includes("follow-up") || blocker.includes("execution")) {
    score += 10;
    reasons.push("Fixable operational blocker identified");
  }

  if (blocker.includes("anxiety") || blocker.includes("fear")) {
    score -= 5;
    reasons.push("Psychological blocker may slow conversion");
  }

  score = Math.max(0, Math.min(100, score));

  const grade: LeadScoreResult["grade"] = score >= 75 ? "HOT" : score >= 55 ? "WARM" : "COLD";

  return { score, grade, reasons };
}
