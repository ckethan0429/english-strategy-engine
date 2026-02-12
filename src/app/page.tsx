"use client";

import { FormEvent, useMemo, useState } from "react";
import { track } from "@/lib/leadgen/analytics";
import { buildResult } from "@/lib/leadgen/engine";
import { defaultTemplate as template } from "@/lib/leadgen/templates/default";
import { Answers, ResultPayload } from "@/lib/leadgen/types";

export default function Home() {
  const initialAnswers = useMemo(
    () => Object.fromEntries(template.questions.map((q) => [q.id, ""])) as Answers,
    [],
  );

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [loadingResult, setLoadingResult] = useState(false);
  const [result, setResult] = useState<ResultPayload | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [leadError, setLeadError] = useState("");
  const [bonusUnlocked, setBonusUnlocked] = useState(false);
  const [submittingLead, setSubmittingLead] = useState(false);

  const isComplete = useMemo(() => Object.values(answers).every(Boolean), [answers]);

  const onStart = () => {
    setStarted(true);
    track("start_assessment");
  };

  const onSubmitAssessment = async (e: FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    setLoadingResult(true);
    track("assessment_completed", { answers });

    await new Promise((resolve) => setTimeout(resolve, 500));
    const payload = buildResult(answers);
    setResult(payload);
    setLoadingResult(false);
    track("result_viewed", { profileLabel: payload.profileLabel });
  };

  const onUnlock = async (e: FormEvent) => {
    e.preventDefault();
    setLeadError("");

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    if (!result) {
      setLeadError("Result not ready. Please complete assessment first.");
      return;
    }

    setEmailError("");
    setSubmittingLead(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source: template.productName,
          answers,
          profileLabel: result.profileLabel,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Lead submission failed");
      }

      setBonusUnlocked(true);
      track("lead_submitted");
      track("bonus_unlocked");
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setSubmittingLead(false);
    }
  };

  const onRestart = () => {
    setStarted(false);
    setAnswers(initialAnswers);
    setResult(null);
    setLoadingResult(false);
    setEmail("");
    setEmailError("");
    setLeadError("");
    setBonusUnlocked(false);
    setSubmittingLead(false);
    track("restart_clicked");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            {template.productName} · v1.2 Generic
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">{template.heroHeadline}</h1>
          <p className="mt-3 max-w-2xl text-slate-600">{template.heroSubheadline}</p>

          {!started && (
            <button
              onClick={onStart}
              className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white hover:bg-slate-700"
            >
              {template.startCta}
            </button>
          )}
        </section>

        {started && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">Quick Assessment</h2>
            <form onSubmit={onSubmitAssessment} className="mt-6 space-y-6">
              {template.questions.map((q) => (
                <fieldset key={q.id}>
                  <legend className="mb-3 block font-medium">{q.label}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((option) => {
                      const selected = answers[q.id] === option;
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                          className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                            selected
                              ? "border-indigo-600 bg-indigo-50 text-indigo-800"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              ))}

              <button
                type="submit"
                disabled={!isComplete || loadingResult}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loadingResult ? "Generating..." : template.submitCta}
              </button>
            </form>
          </section>
        )}

        {loadingResult && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-56 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-10/12 rounded bg-slate-200" />
            </div>
          </section>
        )}

        {result && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">{template.resultTitle}</h3>
            <p className="mt-2 font-medium text-indigo-700">{result.profileLabel}</p>
            <p className="mt-3 text-slate-700">{result.summary}</p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="font-medium">4-Week Action Plan</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
                {result.actionPlan.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl bg-emerald-50 p-4">
              <p className="font-medium">Suggested Tools</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {result.suggestedTools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-slate-700">Tracking method: {result.trackingMethod}</p>
          </section>
        )}

        {result && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">{template.bonusHeadline}</h3>
            <p className="mt-2 text-sm text-slate-600">Submit your email to unlock the bonus content.</p>

            <form onSubmit={onUnlock} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
              <button
                disabled={submittingLead}
                className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {submittingLead ? "Submitting..." : template.unlockCta}
              </button>
            </form>
            {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
            {leadError && <p className="mt-2 text-sm text-red-600">{leadError}</p>}

            {bonusUnlocked && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                ✅ Bonus unlocked. Replace this with your campaign-specific bonus content (video/embed/download).
              </div>
            )}
          </section>
        )}

        {started && (
          <footer className="mt-6 pb-8">
            <button onClick={onRestart} className="text-sm text-slate-500 underline hover:text-slate-700">
              Restart with a different goal
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
