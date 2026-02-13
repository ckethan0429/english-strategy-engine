export type GoalInput = {
  level: string;
  goal: string;
  duration: string;
  timePerDay: string;
  struggle: string;
};

export type DiagnosticInput = {
  recentSpeakingCount: string;
  avoidSituation: string;
  pastFailure: string;
  energyTime: string;
  resistanceLevel: string;
};

export type PlanPayload = {
  profileLabel: string;
  riskFactors: string[];
  blockers: string[];
  weekPlans: string[];
  dailyActionUnits: string[];
  successCriteria: string[];
};

export type CheckinInput = {
  success: "Yes" | "No" | "";
  reason: string;
  energy: string;
  adjustNeed: "Yes" | "No" | "";
};
