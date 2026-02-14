"use client";

import { FormEvent, useState } from "react";
import { buildAdjustment } from "@/lib/speaking/engine";
import { CheckinInput } from "@/lib/speaking/types";

const initialCheckin: CheckinInput = {
  success: "",
  reason: "",
  energy: "",
  adjustNeed: "",
};

export default function CheckinPage() {
  const planId = typeof window !== "undefined" ? Number(new URLSearchParams(window.location.search).get("planId") || 0) : 0;

  const [checkin, setCheckin] = useState<CheckinInput>(initialCheckin);
  const hasProblemLastWeek = checkin.success === "No";
  const [weekNumber, setWeekNumber] = useState("1");
  const [failStreak, setFailStreak] = useState(0);
  const [successStreak, setSuccessStreak] = useState(0);
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [saveMsg, setSaveMsg] = useState("");

  const onWeeklyCheckin = async (e: FormEvent) => {
    e.preventDefault();
    setSaveMsg("");
    if (!checkin.success || !checkin.reason || !checkin.energy || !checkin.adjustNeed) return;

    const nextFail = checkin.success === "No" ? failStreak + 1 : 0;
    const nextSuccess = checkin.success === "Yes" ? successStreak + 1 : 0;

    setFailStreak(nextFail);
    setSuccessStreak(nextSuccess);
    const note = buildAdjustment(checkin, nextFail, nextSuccess);
    setAdjustmentNote(note);

    if (planId > 0) {
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
    } else {
      setSaveMsg("No planId found. Check-in ran locally only.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Weekly Check-in</h1>
          <p className="mt-2 text-slate-600">Submit your weekly result and get automatic strategy adjustment.</p>
          <p className="mt-1 text-sm text-slate-500">plan_id: {planId || "not linked"}</p>

          <form onSubmit={onWeeklyCheckin} className="mt-6 grid gap-4 sm:grid-cols-2">
            {!hasProblemLastWeek && checkin.success === "Yes" && (
              <p className="sm:col-span-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
                문제 없음으로 답변되어, 문제 원인/난이도 조정 질문은 자동으로 비활성화되었습니다.
              </p>
            )}
            <Select label="Week number" value={weekNumber} options={["1", "2", "3", "4"]} onChange={setWeekNumber} />
            <Select
              label="1) Goal achieved this week?"
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
              label="2) Main reason for failed days"
              value={checkin.reason}
              options={["Time shortage", "Low confidence", "Plan too difficult", "No fixed schedule"]}
              onChange={(v) => setCheckin((p) => ({ ...p, reason: v }))}
              disabled={!hasProblemLastWeek}
            />
            <Select label="3) Energy level" value={checkin.energy} options={["High", "Medium", "Low"]} onChange={(v) => setCheckin((p) => ({ ...p, energy: v }))} />
            <Select
              label="4) Need difficulty adjustment?"
              value={checkin.adjustNeed}
              options={["Yes", "No"]}
              onChange={(v) => setCheckin((p) => ({ ...p, adjustNeed: v as "Yes" | "No" }))}
              disabled={!hasProblemLastWeek}
            />

            <div className="sm:col-span-2">
              <button type="submit" className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white">
                Submit Check-in
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
