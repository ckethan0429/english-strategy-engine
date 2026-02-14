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
    return "조정사항: (1) 다음 주 과제량 30% 축소, (2) 10분 태스크를 5분 마이크로 태스크로 분해, (3) 주 5회 대신 주 4회로 시작 후 재확장.";
  }
  if (successStreak >= 2) {
    return "조정사항: (1) 일일 발화 시간 +20%, (2) 주 1회 실전 대화 미션 추가, (3) 녹음 길이 3분 → 5분으로 상향.";
  }
  if (checkin.reason.toLowerCase().includes("time") || checkin.reason.includes("시간")) {
    return "조정사항: (1) 매일 고정 5분 슬롯으로 축소, (2) 에너지 높은 시간대 1개로 고정, (3) 녹음 목표 주 5회 → 주 3회로 임시 조정.";
  }
  if (checkin.reason.toLowerCase().includes("confidence") || checkin.reason.includes("자신감")) {
    return "조정사항: (1) 자유발화 대신 스크립트 기반 발화로 전환, (2) 녹음 길이 3분 → 1분으로 축소, (3) 1:1 대화 시뮬레이션 태스크 주 3회 추가.";
  }
  if (checkin.adjustNeed === "Yes") {
    return "조정사항: (1) 난이도는 유지, (2) 반복 실패한 과제 1개를 교체, (3) 체크인 전날 리마인더 1회 추가.";
  }
  return "조정사항: (1) 기존 플랜 유지, (2) 이번 주 장애요인 1개(시간/자신감/루틴)만 집중 개선, (3) 다음 체크인에서 실행률 재평가.";
}

function fmtUtc(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function durationMinutes(goal: GoalInput) {
  return goal.timePerDay === "30+ min" ? 30 : goal.timePerDay === "10-20 min" ? 15 : 10;
}

export function buildWeekIcs(
  plan: PlanPayload,
  goal: GoalInput,
  diagnostic: DiagnosticInput,
  weekNumber: number,
) {
  const now = new Date();
  const dtstamp = fmtUtc(now);
  const baseHour = diagnostic.energyTime === "Morning" ? 7 : 20;

  const start = new Date(now);
  start.setDate(start.getDate() + 1 + (weekNumber - 1) * 7);
  start.setHours(baseHour, 0, 0, 0);

  const end = new Date(start);
  end.setMinutes(end.getMinutes() + durationMinutes(goal));

  const title = `[Speak] Week${weekNumber} Focus Session`;
  const desc = plan.weekPlans[weekNumber - 1] ?? "Weekly speaking block";

  const event = `BEGIN:VEVENT\nUID:speak-week-${weekNumber}-${Date.now()}@leadgen\nDTSTAMP:${dtstamp}\nDTSTART:${fmtUtc(start)}\nDTEND:${fmtUtc(end)}\nRRULE:FREQ=DAILY;COUNT=5\nSUMMARY:${title}\nDESCRIPTION:${desc}\nEND:VEVENT`;

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//English Strategy Engine//EN\nCALSCALE:GREGORIAN\n${event}\nEND:VCALENDAR`;
}

export function buildIcs(plan: PlanPayload, goal: GoalInput, diagnostic: DiagnosticInput) {
  const weeks = [1, 2, 3, 4].map((w) => {
    const text = buildWeekIcs(plan, goal, diagnostic, w);
    return text
      .replace("BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//English Strategy Engine//EN\nCALSCALE:GREGORIAN\n", "")
      .replace("\nEND:VCALENDAR", "");
  });

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//English Strategy Engine//EN\nCALSCALE:GREGORIAN\n${weeks.join("\n")}\nEND:VCALENDAR`;
}
