import { Answers, ResultPayload } from "./types";

function pick(answers: Answers, keys: string[]) {
  for (const key of keys) {
    if (answers[key]) return answers[key];
  }
  return "";
}

export function buildResult(answers: Answers): ResultPayload {
  const goal = pick(answers, ["goal", "primaryGoal"]);
  const blocker = pick(answers, ["blocker", "pain", "struggle"]);
  const time = pick(answers, ["time", "capacity", "exposure"]);
  const style = pick(answers, ["style", "approach"]);
  const stage = pick(answers, ["stage", "level", "role", "capital"]);

  const profileLabel =
    blocker.includes("system") || blocker.includes("process")
      ? "System Builder"
      : goal.toLowerCase().includes("conversion")
        ? "Conversion Optimizer"
        : goal.toLowerCase().includes("automate")
          ? "Automation Operator"
          : style.toLowerCase().includes("template")
            ? "Template-Driven Executor"
            : "Focused Growth Implementer";

  const summary = `Current context: ${stage || "Custom profile"}. Main goal: ${goal || "growth"}. This 4-week plan prioritizes practical execution and removes the blocker: ${blocker || "inconsistency"}.`;

  const actionPlan = [
    "Week 1: Clarify one measurable target and define a simple daily routine.",
    "Week 2: Apply one repeatable workflow/template every day.",
    "Week 3: Review outcomes and improve the highest-leverage step.",
    "Week 4: Standardize the process into a sustainable weekly system.",
  ];

  if (time.includes("0-15") || time.includes("Under 30") || time.includes("0-10")) {
    actionPlan[0] = "Week 1: Run a micro-routine (10-15 min/day) on one high-impact action.";
  }

  if (goal.toLowerCase().includes("conversion")) {
    actionPlan[2] = "Week 3: Test one conversion improvement each day and keep winning variants.";
  }

  if (goal.toLowerCase().includes("cashflow")) {
    actionPlan[2] = "Week 3: Validate cashflow assumptions with conservative downside scenarios.";
  }

  if (goal.toLowerCase().includes("automate") || goal.toLowerCase().includes("save time")) {
    actionPlan[1] = "Week 2: Map repetitive tasks and automate one workflow end-to-end.";
  }

  return {
    profileLabel,
    summary,
    actionPlan,
    suggestedTools: ["Notion/Docs", "Simple KPI tracker", "Weekly review checklist"],
    trackingMethod: "Track daily completion rate + one weekly KPI review.",
  };
}
