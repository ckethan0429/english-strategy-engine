"use client";

import { FormEvent, useMemo, useState } from "react";

type Answers = {
  level: string;
  exposure: string;
  goal: string;
  style: string;
  struggle: string;
};

type PlanPayload = {
  profileLabel: string;
  weekPlans: string[];
  toolSuggestions: string[];
  trackingMethod: string;
  dailyMinutes: number;
};

const initialAnswers: Answers = {
  level: "",
  exposure: "",
  goal: "",
  style: "",
  struggle: "",
};

const questions = [
  {
    key: "level" as const,
    label: "Current speaking level",
    options: [
      "Beginner (A1-A2)",
      "Lower-Intermediate (A2-B1)",
      "Intermediate (B1)",
      "Upper-Intermediate+ (B2+)",
    ],
  },
  {
    key: "exposure" as const,
    label: "Daily English exposure",
    options: ["0-10 min", "10-30 min", "30-60 min", "60+ min"],
  },
  {
    key: "goal" as const,
    label: "Primary speaking goal",
    options: ["Daily conversation", "Job interview", "Presentation / meetings", "Travel"],
  },
  {
    key: "style" as const,
    label: "Preferred learning style",
    options: ["Repetition drills", "Shadowing", "Role-play practice", "Sentence pattern building"],
  },
  {
    key: "struggle" as const,
    label: "Main speaking struggle",
    options: ["Pronunciation", "Vocabulary recall", "Grammar while speaking", "Confidence / anxiety"],
  },
];

function track(event: string, payload?: Record<string, unknown>) {
  console.info(`[analytics] ${event}`, payload ?? {});
}

function buildRuleBasedPlan(a: Answers): PlanPayload {
  const lowExposure = a.exposure === "0-10 min";
  const dailyMinutes =
    a.exposure === "0-10 min"
      ? 10
      : a.exposure === "10-30 min"
        ? 20
        : a.exposure === "30-60 min"
          ? 35
          : 50;

  const label =
    a.style === "Sentence pattern building"
      ? "Pattern-Based Speaking Learner"
      : a.style === "Shadowing"
        ? "Shadowing-Focused Fluency Builder"
        : a.struggle === "Confidence / anxiety"
          ? "Confidence-First Speaking Learner"
          : "Goal-Oriented Speaking Learner";

  const weekPlans = [
    "Week 1: Build a daily speaking habit (core phrases + 1 short recording/day).",
    "Week 2: Improve speed and fluency with response drills and shadowing.",
    a.goal === "Job interview"
      ? "Week 3: Job interview answers with STAR structure + mock Q&A."
      : a.goal === "Presentation / meetings"
        ? "Week 3: Meeting phrases, transitions, and 1-minute speaking briefs."
        : "Week 3: Real-life speaking scenarios tied to your goal.",
    "Week 4: Simulation week (real-world speaking tasks + self-review).",
  ];

  if (a.struggle === "Pronunciation") {
    weekPlans[1] = "Week 2: Pronunciation focus (minimal pairs + shadowing clips).";
  }

  if (a.struggle === "Grammar while speaking") {
    weekPlans[0] = "Week 1: Sentence pattern drills to reduce grammar hesitation.";
  }

  const toolSuggestions =
    a.struggle === "Pronunciation"
      ? ["ELSA Speak", "YouGlish", "Rachel's English (YouTube)"]
      : a.goal === "Job interview"
        ? ["Google Docs answer bank", "Otter voice replay", "Interview-focused YouTube channels"]
        : ["YouTube shadowing channels", "ChatGPT role-play prompts", "Voice memo app"];

  return {
    profileLabel: label,
    weekPlans: lowExposure
      ? weekPlans.map((w) => `${w} (10-minute micro-routine/day)`)
      : weekPlans,
    toolSuggestions,
    trackingMethod: "Track 10 recordings/week + daily checkbox habit tracker.",
    dailyMinutes,
  };
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planError, setPlanError] = useState("");
  const [plan, setPlan] = useState<PlanPayload | null>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [videoUnlocked, setVideoUnlocked] = useState(false);

  const surveyCompleted = useMemo(() => Object.values(answers).every(Boolean), [answers]);

  const startSurvey = () => {
    setStarted(true);
    track("start_survey");
  };

  const onSurveySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!surveyCompleted) return;

    setLoadingPlan(true);
    setPlanError("");
    track("survey_completed", { answers });

    try {
      await new Promise((resolve) => setTimeout(resolve, 900));

      // MVP: deterministic rule-based generation
      // Future: replace with GPT API call and keep this as fallback.
      const generated = buildRuleBasedPlan(answers);
      setPlan(generated);
      track("plan_viewed", { profileLabel: generated.profileLabel });
    } catch {
      setPlanError("Plan generation failed. Showing fallback plan.");
      setPlan(buildRuleBasedPlan(answers));
    } finally {
      setLoadingPlan(false);
    }
  };

  const onUnlockVideo = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");
    track("email_submitted");
    setVideoUnlocked(true);
    track("video_unlocked");
  };

  const restart = () => {
    setStarted(false);
    setAnswers(initialAnswers);
    setPlan(null);
    setPlanError("");
    setLoadingPlan(false);
    setEmail("");
    setEmailError("");
    setVideoUnlocked(false);
    track("restart_clicked");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            4-week personalized speaking plan
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">Speak English with Confidence in 4 Weeks</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Get your personalized speaking plan now.</p>

          {!started && (
            <button
              onClick={startSurvey}
              className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-700"
            >
              Start Survey
            </button>
          )}
        </section>

        {started && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-semibold">Quick Survey (2 minutes)</h2>
            <form onSubmit={onSurveySubmit} className="mt-6 space-y-6">
              {questions.map((q) => (
                <fieldset key={q.key}>
                  <legend className="mb-3 block font-medium">{q.label}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.options.map((option) => {
                      const selected = answers[q.key] === option;
                      return (
                        <button
                          type="button"
                          key={option}
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.key]: option }))}
                          className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
                            selected
                              ? "border-blue-600 bg-blue-50 text-blue-800"
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
                disabled={!surveyCompleted || loadingPlan}
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {loadingPlan ? "Building your plan..." : "See My Plan"}
              </button>
            </form>
          </section>
        )}

        {loadingPlan && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <div className="animate-pulse space-y-3">
              <div className="h-4 w-44 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
              <div className="h-4 w-10/12 rounded bg-slate-200" />
            </div>
          </section>
        )}

        {plan && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">Your Profile: {plan.profileLabel}</h3>
            <p className="mt-2 text-slate-700">Recommended daily practice: {plan.dailyMinutes} min/day</p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="font-medium">4-Week Plan</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
                {plan.weekPlans.map((week) => (
                  <li key={week}>{week}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl bg-emerald-50 p-4">
              <p className="font-medium">Tool Suggestions</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                {plan.toolSuggestions.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-slate-700">Progress tracking: {plan.trackingMethod}</p>

            {planError && <p className="mt-3 text-sm text-amber-700">{planError}</p>}
          </section>
        )}

        {plan && (
          <section className="mt-6 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold">How 3 People Became Fluent in 90 Days</h3>
            <p className="mt-2 text-sm text-slate-600">Enter your email to unlock the video.</p>

            <form onSubmit={onUnlockVideo} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3"
                placeholder="you@example.com"
                required
              />
              <button className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white hover:bg-slate-700">
                Unlock Video
              </button>
            </form>

            <p className="mt-2 text-xs text-slate-500">We may send practical speaking tips. Unsubscribe anytime.</p>
            {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}

            {videoUnlocked && (
              <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                <iframe
                  className="aspect-video w-full"
                  src="https://www.youtube.com/embed/aqz-KE-bpKQ"
                  title="How 3 People Became Fluent in 90 Days"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            )}
          </section>
        )}

        {started && (
          <footer className="mt-6 pb-8">
            <button onClick={restart} className="text-sm text-slate-500 underline hover:text-slate-700">
              Restart with a different goal
            </button>
          </footer>
        )}
      </div>
    </main>
  );
}
