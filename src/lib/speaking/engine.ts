import { DiagnosticInput, GoalInput, PlanPayload, CheckinInput } from "./types";

export function buildProfile(goal: GoalInput, diagnostic: DiagnosticInput) {
  if (diagnostic.resistanceLevel === "High") return "Avoidant Speaker";
  if (goal.struggle === "Confidence") return "Confidence-Low Active Learner";
  if (goal.struggle === "Natural flow") return "Pattern-Based Learner";
  if (diagnostic.recentSpeakingCount === "0-1 times") return "Passive Input-Heavy Learner";
  return "Goal-Oriented Speaking Builder";
}

export function buildPlan(goal: GoalInput, diagnostic: DiagnosticInput): PlanPayload {
  const profileLabel = buildProfile(goal, diagnostic);

  const blockers = [goal.struggle, diagnostic.avoidSituation].filter(Boolean);

  const riskFactors = [
    diagnostic.resistanceLevel === "High" ? "High psychological resistance" : "Moderate psychological resistance",
    diagnostic.energyTime === "Unclear" ? "No fixed energy window" : `Preferred energy window: ${diagnostic.energyTime}`,
    diagnostic.pastFailure ? `Past failure pattern: ${diagnostic.pastFailure}` : "No major past failure reported",
  ];

  const weekPlans = [
    "Week 1: 10-min shadowing daily + 3 spoken sentences recorded daily + 3 short scenario drills/week.",
    "Week 2: 5-min free talk daily + 3-min recording 5 times/week + train 3 high-frequency situations.",
    "Week 3: 5-min open speaking challenge + 1-min native clip imitation + apply real dialogue scripts.",
    "Week 4: 7-min speaking mission + compare with Week 1 recording + check speed and naturalness.",
  ];

  if (goal.timePerDay === "5-10 min") {
    weekPlans[0] = "Week 1: 5-min micro shadowing + 1 sentence recording daily + 2 short drills/week.";
  }

  if (goal.struggle === "Confidence") {
    weekPlans[1] =
      "Week 2: confidence loop — 2-min low-pressure talk + positive replay, 5 times/week.";
  }

  const dailyActionUnits = [
    "Minimum speaking time: 5-10 min/day",
    "Minimum recordings: 5 per week",
    "Weekly accumulated speaking target: 40-60 min",
  ];

  const successCriteria = [
    "Total recordings in 4 weeks ≥ 20",
    "Speaking time increases week by week",
    "Frequency of speech blocks decreases (self-report)",
  ];

  return { profileLabel, riskFactors, blockers, weekPlans, dailyActionUnits, successCriteria };
}

export function buildAdjustment(checkin: CheckinInput, failStreak: number, successStreak: number) {
  if (failStreak >= 3) {
    return "3회 연속 실패 감지: 다음 주 난이도를 30% 축소하고 과제를 10분→5분 구조로 조정합니다.";
  }
  if (successStreak >= 2) {
    return "2주 연속 성공: 다음 주 발화 시간을 +20% 확장하고 실전 과제를 추가합니다.";
  }
  if (checkin.reason.toLowerCase().includes("time") || checkin.reason.includes("시간")) {
    return "시간 부족 패턴: 마이크로 루틴(5분)으로 분해하고 에너지 시간대에 고정 배치합니다.";
  }
  if (checkin.reason.toLowerCase().includes("confidence") || checkin.reason.includes("자신감")) {
    return "자신감 부족 패턴: 녹음 난이도를 낮추고 1:1 대화 시뮬레이션을 우선 적용합니다.";
  }
  return "기본 전략 유지 + 장애 요인 1개 집중 개선으로 다음 주 플랜을 조정합니다.";
}

export function buildIcs(plan: PlanPayload, goal: GoalInput, diagnostic: DiagnosticInput) {
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const baseHour = diagnostic.energyTime === "Morning" ? 7 : 20;

  const firstDay = new Date(now);
  firstDay.setDate(firstDay.getDate() + 1);
  firstDay.setHours(baseHour, 0, 0, 0);

  const durationMin = goal.timePerDay === "30+ min" ? 30 : goal.timePerDay === "10-20 min" ? 15 : 10;

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const weekTitles = [
    "[Speak] Week1 Shadowing + Recording",
    "[Speak] Week2 Free Talk + Recording",
    "[Speak] Week3 Open Speaking + Imitation",
    "[Speak] Week4 Mission + Comparison Review",
  ];

  const events = weekTitles.map((title, idx) => {
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() + idx * 7);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + durationMin);

    const weekDesc = plan.weekPlans[idx] ?? "Weekly speaking block";

    return `BEGIN:VEVENT\nUID:speak-week-${idx + 1}-${Date.now()}@leadgen\nDTSTAMP:${dtstamp}\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nRRULE:FREQ=DAILY;COUNT=5\nSUMMARY:${title}\nDESCRIPTION:${weekDesc}\nEND:VEVENT`;
  });

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//English Strategy Engine//EN\nCALSCALE:GREGORIAN\n${events.join("\n")}\nEND:VCALENDAR`;
}
