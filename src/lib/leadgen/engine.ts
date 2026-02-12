import { Answers, ResultPayload } from "./types";

export function buildResult(answers: Answers): ResultPayload {
  const stage = answers.stage ?? "";
  const goal = answers.goal ?? "";
  const blocker = answers.blocker ?? "";
  const style = answers.style ?? "";
  const time = answers.time ?? "";

  const profileLabel =
    style === "Step-by-step"
      ? "Structured Executor"
      : style === "Templates"
        ? "Template-Driven Builder"
        : style === "Examples"
          ? "Example-Led Improver"
          : "Action-Oriented Implementer";

  const summary = `You are currently in "${stage}" and focused on "${goal}". This plan prioritizes fast wins while reducing "${blocker}" using a ${style.toLowerCase()} workflow.`;

  const actionPlan = [
    "Week 1: Define one narrow outcome and set a daily execution ritual.",
    "Week 2: Apply a repeatable template to produce consistent output.",
    "Week 3: Optimize based on feedback and measurable signals.",
    "Week 4: Consolidate into a sustainable operating routine.",
  ];

  if (time === "0-15 min") {
    actionPlan[0] = "Week 1: Use a 10-minute micro-routine focused on one priority task.";
  }

  if (goal === "Increase conversion") {
    actionPlan[2] = "Week 3: Test one conversion improvement each day and keep winners.";
  }

  if (blocker === "Lack of system") {
    actionPlan[1] = "Week 2: Build a simple checklist system and run it daily.";
  }

  return {
    profileLabel,
    summary,
    actionPlan,
    suggestedTools: ["Notion/Docs", "Simple checklist board", "Weekly review sheet"],
    trackingMethod: "Track daily completion + weekly KPI review.",
  };
}
