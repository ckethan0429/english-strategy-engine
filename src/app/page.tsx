"use client";

import { FormEvent, useMemo, useState } from "react";

type Question = {
  id: string;
  label: string;
  options: string[];
};

type TemplateConfig = {
  productName: string;
  heroHeadline: string;
  heroSubheadline: string;
  startCta: string;
  submitCta: string;
  resultTitle: string;
  bonusHeadline: string;
  unlockCta: string;
  questions: Question[];
};

type ResultPayload = {
  profileLabel: string;
  summary: string;
  actionPlan: string[];
  suggestedTools: string[];
  trackingMethod: string;
};

const template: TemplateConfig = {
  productName: "Universal Lead Generator",
  heroHeadline: "Get a Personalized Action Plan in Minutes",
  heroSubheadline:
    "Answer a few quick questions and receive a tailored plan based on your goals.",
  startCta: "Start Assessment",
  submitCta: "See My Result",
  resultTitle: "Your Personalized Result",
  bonusHeadline: "Unlock Bonus Guide",
  unlockCta: "Unlock Bonus",
  questions: [
    {
      id: "stage",
      label: "Current stage",
      options: ["Just starting", "Early traction", "Growing", "Scaling"],
    },
    {
      id: "time",
      label: "Available time per day",
      options: ["0-15 min", "15-30 min", "30-60 min", "60+ min"],
    },
    {
      id: "goal",
      label: "Primary goal",
      options: ["Get first results", "Increase conversion", "Improve consistency", "Save time"],
    },
    {
      id: "style",
      label: "Preferred approach",
      options: ["Step-by-step", "Templates", "Examples", "Hands-on practice"],
    },
    {
      id: "blocker",
      label: "Biggest blocker",
      options: ["Not enough clarity", "Low confidence", "Lack of system", "Execution gaps"],
    },
  ],
};

function track(event: string, payload?: Record<string, unknown>) {
  console.info(`[analytics] ${event}`, payload ?? {});
}

function buildResult(answers: Record<string, string>): ResultPayload {
  const stage = answers.stage ?? "";
  const goal = answers.goal ?? "";
  const blocker = answers.blocker ?? "";
  const style = answers.style ?? "";
  const time = answers.time ?? "";

  const profileLabel =
    style === "Step-by-step"
      ? "Structured Executor"
      : style === "Templates"
        ? "Template-Driven Builder"
        : style === "Examples"
          ? "Example-Led Improver"
          : "Action-Oriented Implementer";

  const summary = `You are currently in "${stage}" and focused on "${goal}". This plan prioritizes fast wins while removing "${blocker}" with a ${style.toLowerCase()} workflow.`;

  const actionPlan = [
    "Week 1: Define one narrow outcome and set a daily execution ritual.",
    "Week 2: Apply a repeatable template to produce consistent output.",
    "Week 3: Optimize based on feedback and measurable signals.",
    "Week 4: Consolidate into a sustainable operating routine.",
  ];

  if (time === "0-15 min") {
    actionPlan[0] = "Week 1: Use a 10-minute micro-routine focused on one priority task.";
  }

  if (goal === "Increase conversion") {
    actionPlan[2] = "Week 3: Test one conversion improvement each day and keep winners.";
  }

  if (blocker === "Lack of system") {
    actionPlan[1] = "Week 2: Build a simple checklist system and run it daily.";
  }

  return {
    profileLabel,
    summary,
    actionPlan,
    suggestedTools: ["Notion/Docs", "Simple checklist board", "Weekly review sheet"],
    trackingMethod: "Track daily completion + weekly KPI review.",
  };
}

export default function Home() {
  const initialAnswers = useMemo(
    () => Object.fromEntries(template.questions.map((q) => [q.id, ""])) as Record<string, string>,
    [],
  );

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [loadingResult, setLoadingResult] = useState(false);
  const [result, setResult] = useState<ResultPayload | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [bonusUnlocked, setBonusUnlocked] = useState(false);

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

    await new Promise((resolve) => setTimeout(resolve, 700));
    const payload = buildResult(answers);
    setResult(payload);
    setLoadingResult(false);
    track("result_viewed", { profileLabel: payload.profileLabel });
  };

  const onUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    setBonusUnlocked(true);
    track("lead_submitted");
    track("bonus_unlocked");
  };

  const onRestart = () => {
    setStarted(false);
    setAnswers(initialAnswers);
    setResult(null);
    setLoadingResult(false);
    setEmail("");
    setEmailError("");
    setBonusUnlocked(false);
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
            <p className="mt-2 text-sm text-slate-600">Submit your email to reveal the bonus content.</p>

            <form onSubmit={onUnlock} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                required
              />
              <button className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700">
                {template.unlockCta}
              </button>
            </form>
            {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}

            {bonusUnlocked && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                ✅ Bonus unlocked. Replace this block with video/embed/download specific to your campaign.
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
