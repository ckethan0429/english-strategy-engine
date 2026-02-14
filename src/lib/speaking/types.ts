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
  executionRate?: "0" | "25" | "50" | "75" | "100" | "";
  missedDays?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "";
  blockerTags?: string[];
  difficultTask?: "Shadowing" | "Free Talk" | "Recording" | "Situation Drill" | "";
  difficultyLevel?: "1" | "2" | "3" | "4" | "5" | "";
  anxietyLevel?: "1" | "2" | "3" | "4" | "5" | "";
  avoidanceLevel?: "1" | "2" | "3" | "4" | "5" | "";
  scheduleFit?: "High" | "Medium" | "Low" | "";
  nextWeekPreference?: "Reduce time" | "Reduce frequency" | "Reduce difficulty" | "Change task type" | "Keep" | "";
};
