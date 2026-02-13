"use client";

import { FormEvent, useMemo, useState } from "react";
import { buildIcs, buildPlan } from "@/lib/speaking/engine";
import { DiagnosticInput, GoalInput, PlanPayload } from "@/lib/speaking/types";

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

function track(event: string, payload?: Record<string, unknown>) {
  console.info(`[analytics] ${event}`, payload ?? {});
}

export default function Home() {
  const [goal, setGoal] = useState<GoalInput>(initialGoal);
  const [diagnostic, setDiagnostic] = useState<DiagnosticInput>(initialDiagnostic);
  const [plan, setPlan] = useState<PlanPayload | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

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
    localStorage.setItem("speaking_plan", JSON.stringify(generated));
    track("plan_generated", { profile: generated.profileLabel });
    setLoadingPlan(false);
  };

  const onDownloadIcs = () => {
    if (!plan) return;
    const ics = buildIcs(plan, goal, diagnostic);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "english-speaking-4week-plan.ics";
    link.click();
    URL.revokeObjectURL(url);
    track("ics_downloaded", { full4WeekPlan: true });
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

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button onClick={onDownloadIcs} className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white">
                4) Track This Plan (Download 4-Week ICS)
              </button>
              <a href="/checkin" className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white text-center">
                5) Go to Weekly Check-in Page
              </a>
            </div>
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
