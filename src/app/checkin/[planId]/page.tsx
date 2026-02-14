"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { buildWeekIcs } from "@/lib/speaking/engine";
import { CheckinInput, DiagnosticInput, GoalInput, PlanPayload } from "@/lib/speaking/types";

const initialCheckin: CheckinInput = {
  success: "",
  reason: "",
  energy: "",
  adjustNeed: "",
  executionRate: "",
  missedDays: "",
  blockerTags: [],
  difficultTask: "",
  difficultyLevel: "",
  anxietyLevel: "",
  avoidanceLevel: "",
  scheduleFit: "",
  nextWeekPreference: "",
};

type PlanApi = {
  ok: boolean;
  plan?: {
    weekly_structure: {
      weekPlans: string[];
      dailyActionUnits: string[];
      successCriteria: string[];
      riskFactors: string[];
    };
    constraints: {
      level: string;
      timePerDay: string;
      struggle: string;
      diagnostic: DiagnosticInput;
    };
    target_type: string;
    duration: string;
  };
  error?: string;
};

export default function CheckinByPlanPage() {
  const params = useParams<{ planId: string }>();
  const planId = useMemo(() => Number(params?.planId || 0), [params]);
  const email = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("email") ?? "";
  }, []);

  const [checkin, setCheckin] = useState<CheckinInput>(initialCheckin);
  const [weekNumber, setWeekNumber] = useState("1");
  const [failStreak, setFailStreak] = useState(0);
  const [successStreak, setSuccessStreak] = useState(0);
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  const [planData, setPlanData] = useState<PlanPayload | null>(null);
  const [goalData, setGoalData] = useState<GoalInput | null>(null);
  const [diagData, setDiagData] = useState<DiagnosticInput | null>(null);

  const hasProblemLastWeek = checkin.success === "No";

  useEffect(() => {
    async function loadPlan() {
      if (!planId) return;
      const res = await fetch(`/api/plans/${planId}`);
      const data = (await res.json()) as PlanApi;
      if (!res.ok || !data.ok || !data.plan) return;

      setPlanData({
        profileLabel: "Loaded plan",
        blockers: [],
        riskFactors: data.plan.weekly_structure.riskFactors ?? [],
        weekPlans: data.plan.weekly_structure.weekPlans ?? [],
        dailyActionUnits: data.plan.weekly_structure.dailyActionUnits ?? [],
        successCriteria: data.plan.weekly_structure.successCriteria ?? [],
      });

      setGoalData({
        level: data.plan.constraints?.level ?? "A2-B1",
        goal: data.plan.target_type ?? "Daily speaking confidence",
        duration: data.plan.duration ?? "4 weeks",
        timePerDay: data.plan.constraints?.timePerDay ?? "10-20 min",
        struggle: data.plan.constraints?.struggle ?? "Confidence",
      });

      setDiagData(data.plan.constraints?.diagnostic ?? {
        recentSpeakingCount: "2-4 times",
        avoidSituation: "Small talk",
        pastFailure: "No fixed schedule",
        energyTime: "Evening",
        resistanceLevel: "Medium",
      });
    }

    void loadPlan();
  }, [planId]);

  const onExportWeekIcs = () => {
    if (!planData || !goalData || !diagData) return;
    const ics = buildWeekIcs(planData, goalData, diagData, Number(weekNumber));
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `english-speaking-week-${weekNumber}-plan-${planId}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const toggleBlockerTag = (tag: string) => {
    setCheckin((prev) => {
      const curr = prev.blockerTags ?? [];
      return {
        ...prev,
        blockerTags: curr.includes(tag) ? curr.filter((t) => t !== tag) : [...curr, tag],
      };
    });
  };

  const onWeeklyCheckin = async (e: FormEvent) => {
    e.preventDefault();
    setSaveMsg("");
    if (!checkin.success || !checkin.reason || !checkin.energy || !checkin.adjustNeed) return;

    const nextFail = checkin.success === "No" ? failStreak + 1 : 0;
    const nextSuccess = checkin.success === "Yes" ? successStreak + 1 : 0;

    setFailStreak(nextFail);
    setSuccessStreak(nextSuccess);

    if (planId > 0) {
      setAdjusting(true);

      const adjRes = await fetch("/api/strategy-adjust", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          planId,
          weekNumber: Number(weekNumber),
          checkin,
        }),
      });
      const adjData = (await adjRes.json()) as { ok: boolean; adjustment?: string; error?: string };
      const note = adjRes.ok && adjData.ok && adjData.adjustment ? adjData.adjustment : "조정 전략 생성 실패";
      setAdjustmentNote(note);

      const res = await fetch("/api/checkins", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          planId,
          weekNumber: Number(weekNumber),
          checkin,
          adjustmentNote: note,
        }),
      });

      const data = (await res.json()) as { ok: boolean; error?: string };
      setSaveMsg(res.ok && data.ok ? "Check-in saved to DB." : `Save failed: ${data.error ?? "unknown"}`);
      setAdjusting(false);
    } else {
      setSaveMsg("Invalid planId.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Weekly Start Check-in</h1>
          <p className="mt-2 text-slate-600">At the start of each week: check in, then export this week&apos;s ICS plan.</p>
          <p className="mt-1 text-sm text-slate-500">plan_id: {planId || "invalid"}</p>
          <p className="mt-1 text-sm text-slate-500">email: {email || "unknown"}</p>

          <div className="mt-4 rounded-xl bg-slate-50 p-4">
            <label className="mb-2 block text-sm font-medium">Week to start</label>
            <select
              value={weekNumber}
              onChange={(e) => setWeekNumber(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3"
            >
              <option value="1">Week 1</option>
              <option value="2">Week 2</option>
              <option value="3">Week 3</option>
              <option value="4">Week 4</option>
            </select>
            <button
              onClick={onExportWeekIcs}
              className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Export This Week ICS
            </button>
            {planData && <p className="mt-2 text-sm text-slate-600">{planData.weekPlans[Number(weekNumber) - 1]}</p>}
          </div>

          <form onSubmit={onWeeklyCheckin} className="mt-6 grid gap-4 sm:grid-cols-2">
            {!hasProblemLastWeek && checkin.success === "Yes" && (
              <p className="sm:col-span-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                문제 없음으로 답변되어, 문제 원인/난이도 조정 질문은 자동으로 비활성화되었습니다.
              </p>
            )}
            <Select
              label="1) Last week plan completed?"
              value={checkin.success}
              options={["Yes", "No"]}
              onChange={(v) =>
                setCheckin((p) => ({
                  ...p,
                  success: v as "Yes" | "No",
                  reason: v === "Yes" ? "No major issue" : p.reason === "No major issue" ? "" : p.reason,
                  adjustNeed: v === "Yes" ? "No" : p.adjustNeed,
                }))
              }
            />
            <Select
              label="2) Main blocker last week"
              value={checkin.reason}
              options={["Time shortage", "Low confidence", "Plan too difficult", "No fixed schedule"]}
              onChange={(v) => setCheckin((p) => ({ ...p, reason: v }))}
              disabled={!hasProblemLastWeek}
            />
            <Select label="3) Current energy level" value={checkin.energy} options={["High", "Medium", "Low"]} onChange={(v) => setCheckin((p) => ({ ...p, energy: v }))} />
            <Select
              label="4) Need difficulty adjustment this week?"
              value={checkin.adjustNeed}
              options={["Yes", "No"]}
              onChange={(v) => setCheckin((p) => ({ ...p, adjustNeed: v as "Yes" | "No" }))}
              disabled={!hasProblemLastWeek}
            />

            <Select
              label="5) Execution rate (%)"
              value={checkin.executionRate ?? ""}
              options={["0", "25", "50", "75", "100"]}
              onChange={(v) => setCheckin((p) => ({ ...p, executionRate: v as CheckinInput["executionRate"] }))}
            />
            <Select
              label="6) Missed days"
              value={checkin.missedDays ?? ""}
              options={["0", "1", "2", "3", "4", "5", "6", "7"]}
              onChange={(v) => setCheckin((p) => ({ ...p, missedDays: v as CheckinInput["missedDays"] }))}
            />
            <Select
              label="7) Most difficult task"
              value={checkin.difficultTask ?? ""}
              options={["Shadowing", "Free Talk", "Recording", "Situation Drill"]}
              onChange={(v) => setCheckin((p) => ({ ...p, difficultTask: v as CheckinInput["difficultTask"] }))}
              disabled={!hasProblemLastWeek}
            />
            <Select
              label="8) Task difficulty (1-5)"
              value={checkin.difficultyLevel ?? ""}
              options={["1", "2", "3", "4", "5"]}
              onChange={(v) => setCheckin((p) => ({ ...p, difficultyLevel: v as CheckinInput["difficultyLevel"] }))}
            />
            <Select
              label="9) Anxiety level (1-5)"
              value={checkin.anxietyLevel ?? ""}
              options={["1", "2", "3", "4", "5"]}
              onChange={(v) => setCheckin((p) => ({ ...p, anxietyLevel: v as CheckinInput["anxietyLevel"] }))}
            />
            <Select
              label="10) Avoidance level (1-5)"
              value={checkin.avoidanceLevel ?? ""}
              options={["1", "2", "3", "4", "5"]}
              onChange={(v) => setCheckin((p) => ({ ...p, avoidanceLevel: v as CheckinInput["avoidanceLevel"] }))}
            />
            <Select
              label="11) Planned time-slot fit"
              value={checkin.scheduleFit ?? ""}
              options={["High", "Medium", "Low"]}
              onChange={(v) => setCheckin((p) => ({ ...p, scheduleFit: v as CheckinInput["scheduleFit"] }))}
            />
            <Select
              label="12) Preferred next-week adjustment"
              value={checkin.nextWeekPreference ?? ""}
              options={["Reduce time", "Reduce frequency", "Reduce difficulty", "Change task type", "Keep"]}
              onChange={(v) => setCheckin((p) => ({ ...p, nextWeekPreference: v as CheckinInput["nextWeekPreference"] }))}
            />

            <div className="sm:col-span-2">
              <p className="mb-2 text-sm font-medium text-slate-800">13) Repeated blocker tags (multi-select)</p>
              <div className="flex flex-wrap gap-2">
                {["Time", "Fatigue", "Confidence", "Difficulty", "Environment", "Priority"].map((tag) => {
                  const selected = (checkin.blockerTags ?? []).includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleBlockerTag(tag)}
                      className={`rounded-full px-3 py-1 text-sm ${selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <button disabled={adjusting} type="submit" className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:bg-slate-300">
                {adjusting ? "Generating adjusted strategy..." : "Submit Weekly Start Check-in"}
              </button>
            </div>
          </form>

          {adjustmentNote && (
            <div className="mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="font-medium">AI Adjustment Note</p>
              <p className="mt-2 text-slate-700">{adjustmentNote}</p>
            </div>
          )}

          {saveMsg && <p className="mt-3 text-sm text-slate-700">{saveMsg}</p>}
        </section>
      </div>
    </main>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-medium text-slate-800">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 disabled:bg-slate-100 disabled:text-slate-400"
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
