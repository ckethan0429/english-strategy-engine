"use client";

import { useState } from "react";

type PlanRow = {
  id: number;
  created_at: string;
  strategy_text: string;
  target_type: string;
  duration: string;
  email: string;
  timezone: string;
  checkin_count: number;
};

type PlanDetail = {
  ok: boolean;
  plan?: {
    id: number;
    strategy_text: string;
    weekly_structure: {
      weekPlans: string[];
      dailyActionUnits: string[];
      successCriteria: string[];
      riskFactors: string[];
    };
    created_at: string;
    target_type: string;
    duration: string;
    email: string;
    timezone: string;
  };
  checkins?: Array<{
    id: number;
    week_number: number;
    status: string;
    reason: string;
    energy: string;
    adjust_need: string;
    adjustment_note: string;
    created_at: string;
  }>;
  error?: string;
};

export default function PlansPage() {
  const [email, setEmail] = useState("");
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [detail, setDetail] = useState<PlanDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const onSearch = async () => {
    setError("");
    setLoading(true);
    setDetail(null);

    try {
      const res = await fetch(`/api/plans?email=${encodeURIComponent(email)}`);
      const data = (await res.json()) as { ok: boolean; plans?: PlanRow[]; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to load plans");
      setPlans(data.plans ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const onLoadDetail = async (id: number) => {
    setDetailLoading(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/plans/${id}`);
      const data = (await res.json()) as PlanDetail;
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to load detail");
      setDetail(data);
    } catch (e) {
      setDetail({ ok: false, error: e instanceof Error ? e.message : "Unknown error" });
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Saved Plans Viewer</h1>
          <p className="mt-2 text-slate-600">Search plans by email, then open details + check-in history.</p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
            <button
              onClick={onSearch}
              disabled={!email || loading}
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:bg-slate-300"
            >
              {loading ? "Loading..." : "Search Plans"}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </section>

        <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Plan List</h2>
          <div className="mt-4 space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="rounded-xl border border-slate-200 p-4">
                <p className="font-medium">Plan #{plan.id}</p>
                <p className="text-sm text-slate-600">{plan.target_type} · {plan.duration} · check-ins: {plan.checkin_count}</p>
                <p className="mt-1 text-sm text-slate-500">{new Date(plan.created_at).toLocaleString()}</p>
                <button
                  onClick={() => onLoadDetail(plan.id)}
                  className="mt-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  View Detail
                </button>
              </div>
            ))}
            {!loading && plans.length === 0 && <p className="text-slate-500">No plans found.</p>}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold">Plan Detail</h2>
          {detailLoading && <p className="mt-3 text-slate-500">Loading detail...</p>}
          {!detailLoading && detail?.error && <p className="mt-3 text-red-600">{detail.error}</p>}

          {!detailLoading && detail?.plan && (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p><strong>ID:</strong> {detail.plan.id}</p>
                <p><strong>Email:</strong> {detail.plan.email}</p>
                <p><strong>Strategy:</strong> {detail.plan.strategy_text}</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium">Week Plans</p>
                <ul className="mt-2 list-disc pl-5 text-slate-700">
                  {detail.plan.weekly_structure.weekPlans?.map((w) => <li key={w}>{w}</li>)}
                </ul>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="font-medium">Check-ins</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {(detail.checkins ?? []).map((c) => (
                    <li key={c.id} className="rounded-lg border border-slate-200 p-3">
                      Week {c.week_number} · {c.status} · {c.reason} · energy {c.energy}
                      <p className="mt-1 text-slate-600">Adjustment: {c.adjustment_note}</p>
                    </li>
                  ))}
                  {(detail.checkins ?? []).length === 0 && <li>No check-ins yet.</li>}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
