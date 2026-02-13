"use client";

import { FormEvent, useMemo, useState } from "react";

type GoalInput = {
  level: string;
  goal: string;
  duration: string;
  timePerDay: string;
  struggle: string;
};

type DiagnosticInput = {
  recentSpeakingCount: string;
  avoidSituation: string;
  pastFailure: string;
  energyTime: string;
  resistanceLevel: string;
};

type PlanPayload = {
  profileLabel: string;
  riskFactors: string[];
  blockers: string[];
  weekPlans: string[];
  dailyActionUnits: string[];
  successCriteria: string[];
};

type CheckinInput = {
  success: "Yes" | "No" | "";
  reason: string;
  energy: string;
  adjustNeed: "Yes" | "No" | "";
};

const initialGoal: GoalInput = {
  level: "",
  goal: "",
  duration: "4 weeks",
  timePerDay: "",
  struggle: "",
};

const initialDiagnostic: DiagnosticInput = {
  recentSpeakingCount: "",
  avoidSituation: "",
  pastFailure: "",
  energyTime: "",
  resistanceLevel: "",
};

const initialCheckin: CheckinInput = {
  success: "",
  reason: "",
  energy: "",
  adjustNeed: "",
};

function track(event: string, payload?: Record<string, unknown>) {
  console.info(`[analytics] ${event}`, payload ?? {});
}

function buildProfile(goal: GoalInput, diagnostic: DiagnosticInput) {
  if (diagnostic.resistanceLevel === "High") return "Avoidant Speaker";
  if (goal.struggle === "Confidence") return "Confidence-Low Active Learner";
  if (goal.struggle === "Natural flow") return "Pattern-Based Learner";
  if (diagnostic.recentSpeakingCount === "0-1 times") return "Passive Input-Heavy Learner";
  return "Goal-Oriented Speaking Builder";
}

function buildPlan(goal: GoalInput, diagnostic: DiagnosticInput): PlanPayload {
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

function buildAdjustment(checkin: CheckinInput, failStreak: number, successStreak: number) {
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

function buildIcs(goal: GoalInput, diagnostic: DiagnosticInput) {
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const baseHour = diagnostic.energyTime === "Morning" ? 7 : 20;
  const start = new Date(now);
  start.setDate(start.getDate() + 1);
  start.setHours(baseHour, 0, 0, 0);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + (goal.timePerDay === "30+ min" ? 30 : goal.timePerDay === "10-20 min" ? 15 : 10));

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const events = [
    {
      uid: `speak-shadowing-${Date.now()}@leadgen`,
      title: "[Speak] 10-min Shadowing",
      desc: "English speaking execution block",
    },
    {
      uid: `speak-freetalk-${Date.now()}@leadgen`,
      title: "[Speak] 3-min Free Talk",
      desc: "Low-pressure speaking output block",
    },
  ];

  const body = events
    .map(
      (e) => `BEGIN:VEVENT\nUID:${e.uid}\nDTSTAMP:${dtstamp}\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nRRULE:FREQ=WEEKLY;COUNT=4;BYDAY=MO,TU,WE,TH,FR\nSUMMARY:${e.title}\nDESCRIPTION:${e.desc}\nEND:VEVENT`,
    )
    .join("\n");

  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//English Strategy Engine//EN\nCALSCALE:GREGORIAN\n${body}\nEND:VCALENDAR`;
}

export default function Home() {
  const [goal, setGoal] = useState<GoalInput>(initialGoal);
  const [diagnostic, setDiagnostic] = useState<DiagnosticInput>(initialDiagnostic);
  const [plan, setPlan] = useState<PlanPayload | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [email, setEmail] = useState("");
  const [checkin, setCheckin] = useState<CheckinInput>(initialCheckin);
  const [failStreak, setFailStreak] = useState(0);
  const [successStreak, setSuccessStreak] = useState(0);
  const [adjustmentNote, setAdjustmentNote] = useState("");

  const goalComplete = useMemo(() => Object.values(goal).every(Boolean), [goal]);
  const diagnosticComplete = useMemo(() => Object.values(diagnostic).every(Boolean), [diagnostic]);

  const onGeneratePlan = async (e: FormEvent) => {
    e.preventDefault();
    if (!goalComplete || !diagnosticComplete) return;

    setLoadingPlan(true);
    track("plan_generation_started");
    await new Promise((r) => setTimeout(r, 600));
    const generated = buildPlan(goal, diagnostic);
    setPlan(generated);
    setLoadingPlan(false);
    track("plan_generated", { profile: generated.profileLabel });
  };

  const onDownloadIcs = () => {
    const ics = buildIcs(goal, diagnostic);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "english-speaking-plan.ics";
    link.click();
    URL.revokeObjectURL(url);
    track("ics_downloaded");
  };

  const onWeeklyCheckin = (e: FormEvent) => {
    e.preventDefault();
    if (!checkin.success || !checkin.reason || !checkin.energy || !checkin.adjustNeed) return;

    const nextFail = checkin.success === "No" ? failStreak + 1 : 0;
    const nextSuccess = checkin.success === "Yes" ? successStreak + 1 : 0;

    setFailStreak(nextFail);
    setSuccessStreak(nextSuccess);

    const note = buildAdjustment(checkin, nextFail, nextSuccess);
    setAdjustmentNote(note);
    track("weekly_checkin_submitted", { checkin, nextFail, nextSuccess });
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Behavior Loop Engine · v1.1
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">English Speaking Personal Strategy Engine</h1>
          <p className="mt-3 text-slate-600">
            Diagnose → Execute → Check-in → Adjust. Become someone who actually speaks English.
          </p>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">1) Goal Input Layer</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Select label="Current speaking level" value={goal.level} options={["A1-A2", "A2-B1", "B1", "B2+"]} onChange={(v) => setGoal((p) => ({ ...p, level: v }))} />
            <Select label="Primary goal" value={goal.goal} options={["Travel conversation", "Interview", "Presentation", "Daily speaking confidence"]} onChange={(v) => setGoal((p) => ({ ...p, goal: v }))} />
            <Select label="Duration" value={goal.duration} options={["4 weeks", "6 weeks", "8 weeks"]} onChange={(v) => setGoal((p) => ({ ...p, duration: v }))} />
            <Select label="Time per day" value={goal.timePerDay} options={["5-10 min", "10-20 min", "30+ min"]} onChange={(v) => setGoal((p) => ({ ...p, timePerDay: v }))} />
            <Select label="Hardest part" value={goal.struggle} options={["Vocabulary", "Grammar", "Confidence", "Natural flow"]} onChange={(v) => setGoal((p) => ({ ...p, struggle: v }))} />
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">2) Diagnostic Interview Layer</h2>
          <form className="mt-4 grid gap-4 sm:grid-cols-2" onSubmit={onGeneratePlan}>
            <Select label="Spoken count in last 2 weeks" value={diagnostic.recentSpeakingCount} options={["0-1 times", "2-4 times", "5-8 times", "9+ times"]} onChange={(v) => setDiagnostic((p) => ({ ...p, recentSpeakingCount: v }))} />
            <Select label="Avoided situation" value={diagnostic.avoidSituation} options={["Phone call", "Meeting", "Interview", "Small talk"]} onChange={(v) => setDiagnostic((p) => ({ ...p, avoidSituation: v }))} />
            <Select label="Past failure pattern" value={diagnostic.pastFailure} options={["Stopped after 1 week", "No feedback loop", "Too difficult plan", "No fixed schedule"]} onChange={(v) => setDiagnostic((p) => ({ ...p, pastFailure: v }))} />
            <Select label="Energy time window" value={diagnostic.energyTime} options={["Morning", "Evening", "Unclear"]} onChange={(v) => setDiagnostic((p) => ({ ...p, energyTime: v }))} />
            <Select label="Psychological resistance level" value={diagnostic.resistanceLevel} options={["Low", "Medium", "High"]} onChange={(v) => setDiagnostic((p) => ({ ...p, resistanceLevel: v }))} />

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={!goalComplete || !diagnosticComplete || loadingPlan}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:bg-slate-300"
              >
                {loadingPlan ? "Generating strategy..." : "3) Generate 4-Week Strategy"}
              </button>
            </div>
          </form>
        </section>

        {plan && (
          <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">Speaking Profile: {plan.profileLabel}</h3>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="font-medium">Main blockers</p>
              <ul className="mt-2 list-disc pl-5 text-slate-700">
                {plan.blockers.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl bg-amber-50 p-4">
              <p className="font-medium">Failure risk factors</p>
              <ul className="mt-2 list-disc pl-5 text-slate-700">
                {plan.riskFactors.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="font-medium">4-Week Roadmap</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
                {plan.weekPlans.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="font-medium">Daily Action Units</p>
                <ul className="mt-2 list-disc pl-5 text-slate-700">
                  {plan.dailyActionUnits.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="font-medium">Success Criteria</p>
                <ul className="mt-2 list-disc pl-5 text-slate-700">
                  {plan.successCriteria.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button onClick={onDownloadIcs} className="mt-5 rounded-xl bg-slate-900 px-5 py-3 font-medium text-white">
              4) Track This Plan (Download ICS)
            </button>
          </section>
        )}

        {plan && (
          <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">5) Weekly Check-in System</h3>
            <p className="mt-2 text-sm text-slate-600">Weekly check-in email simulation for MVP</p>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">Email for weekly check-in</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>

            <form onSubmit={onWeeklyCheckin} className="mt-4 grid gap-4 sm:grid-cols-2">
              <Select label="1) Goal achieved this week?" value={checkin.success} options={["Yes", "No"]} onChange={(v) => setCheckin((p) => ({ ...p, success: v as "Yes" | "No" }))} />
              <Select label="2) Main reason for failed days" value={checkin.reason} options={["Time shortage", "Low confidence", "Plan too difficult", "No fixed schedule"]} onChange={(v) => setCheckin((p) => ({ ...p, reason: v }))} />
              <Select label="3) Energy level" value={checkin.energy} options={["High", "Medium", "Low"]} onChange={(v) => setCheckin((p) => ({ ...p, energy: v }))} />
              <Select label="4) Need difficulty adjustment?" value={checkin.adjustNeed} options={["Yes", "No"]} onChange={(v) => setCheckin((p) => ({ ...p, adjustNeed: v as "Yes" | "No" }))} />

              <div className="sm:col-span-2">
                <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white">
                  6) Submit Weekly Check-in
                </button>
              </div>
            </form>

            {adjustmentNote && (
              <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="font-medium">7) Strategy Auto-Adjustment</p>
                <p className="mt-2 text-slate-700">{adjustmentNote}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-medium text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
      >
        <option value="">Select one</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
