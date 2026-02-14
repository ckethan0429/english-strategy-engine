import { CheckinInput } from "./types";

type AdjustParams = {
  weekNumber: number;
  currentWeekPlan: string;
  checkin: CheckinInput;
  riskFactors?: string[];
};

function fallbackAdjustment(params: AdjustParams) {
  const base = [`Week ${params.weekNumber + 1} Adjusted Strategy:`];

  if (params.checkin.success === "Yes") {
    base.push("- Keep core structure, increase speaking time by ~10-20%.");
    base.push("- Add 1 real-life speaking mission this week.");
  } else {
    base.push("- Reduce task friction: split daily task into 5-minute blocks.");
    base.push("- Prioritize one must-do speaking task per day.");
  }

  if (params.checkin.reason.toLowerCase().includes("time")) {
    base.push("- Lock one fixed time slot (same hour daily) to reduce scheduling failure.");
    base.push("- Recording target temporarily adjusted to 3-4 times/week.");
  }

  if (params.checkin.reason.toLowerCase().includes("confidence")) {
    base.push("- Replace free-talk with script-supported speaking for first 3 days.");
    base.push("- Reduce recording length (3min -> 1min) and rebuild confidence.");
  }

  if (params.riskFactors?.length) {
    base.push(`- Watch risk factor: ${params.riskFactors[0]}`);
  }

  base.push("- Weekly success target: >= 70% completion of adjusted tasks.");

  return base.join("\n");
}

export async function generateAdjustedStrategy(params: AdjustParams) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.ADJUSTMENT_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return fallbackAdjustment(params);
  }

  const prompt = `You are an English speaking strategy coach.\nGiven the current week strategy and check-in result, generate a stronger next-week adjusted strategy.\nMust output concrete and measurable bullet points.\n\nCurrent week plan:\n${params.currentWeekPlan}\n\nCheck-in:\n- success: ${params.checkin.success}\n- reason: ${params.checkin.reason}\n- energy: ${params.checkin.energy}\n- adjustNeed: ${params.checkin.adjustNeed}\n\nRisk factors:\n${(params.riskFactors ?? []).join("; ")}\n\nRequirements:\n1) Reflect current strategy + reported difficulty.\n2) Produce next 7-day actionable plan.\n3) Include measurable targets (time/frequency).\n4) Keep output concise in Korean.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [
          { role: "system", content: "You produce practical weekly strategy adjustments." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) return fallbackAdjustment(params);
    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const text = data.choices?.[0]?.message?.content?.trim();
    return text || fallbackAdjustment(params);
  } catch {
    return fallbackAdjustment(params);
  }
}
