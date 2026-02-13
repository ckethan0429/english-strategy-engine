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
  const [checkin, setCheckin] = useState<CheckinInput>(initialCheckin);
  const [failStreak, setFailStreak] = useState(0);
  const [successStreak, setSuccessStreak] = useState(0);
  const [adjustmentNote, setAdjustmentNote] = useState("");

  const onWeeklyCheckin = (e: FormEvent) => {
    e.preventDefault();
    if (!checkin.success || !checkin.reason || !checkin.energy || !checkin.adjustNeed) return;

    const nextFail = checkin.success === "No" ? failStreak + 1 : 0;
    const nextSuccess = checkin.success === "Yes" ? successStreak + 1 : 0;

    setFailStreak(nextFail);
    setSuccessStreak(nextSuccess);
    setAdjustmentNote(buildAdjustment(checkin, nextFail, nextSuccess));
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Weekly Check-in</h1>
          <p className="mt-2 text-slate-600">Submit your weekly result and get automatic strategy adjustment.</p>

          <form onSubmit={onWeeklyCheckin} className="mt-6 grid gap-4 sm:grid-cols-2">
            <Select label="1) Goal achieved this week?" value={checkin.success} options={["Yes", "No"]} onChange={(v) => setCheckin((p) => ({ ...p, success: v as "Yes" | "No" }))} />
            <Select label="2) Main reason for failed days" value={checkin.reason} options={["Time shortage", "Low confidence", "Plan too difficult", "No fixed schedule"]} onChange={(v) => setCheckin((p) => ({ ...p, reason: v }))} />
            <Select label="3) Energy level" value={checkin.energy} options={["High", "Medium", "Low"]} onChange={(v) => setCheckin((p) => ({ ...p, energy: v }))} />
            <Select label="4) Need difficulty adjustment?" value={checkin.adjustNeed} options={["Yes", "No"]} onChange={(v) => setCheckin((p) => ({ ...p, adjustNeed: v as "Yes" | "No" }))} />

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
