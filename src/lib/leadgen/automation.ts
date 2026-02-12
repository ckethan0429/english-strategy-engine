import { LeadPayload } from "./types";

function buildTags(payload: LeadPayload) {
  const tags = ["leadgen", payload.source.toLowerCase().replace(/\s+/g, "-")];

  if (payload.leadGrade) tags.push(`grade:${payload.leadGrade.toLowerCase()}`);
  if (payload.utm?.source) tags.push(`utm_source:${payload.utm.source}`);
  if (payload.utm?.campaign) tags.push(`utm_campaign:${payload.utm.campaign}`);

  return tags;
}

export async function runAutomation(payload: LeadPayload) {
  const automationWebhook = process.env.AUTOMATION_WEBHOOK_URL;
  if (!automationWebhook) return { ok: false, skipped: true };

  const enriched = {
    ...payload,
    tags: buildTags(payload),
    followUpSequence:
      payload.leadGrade === "HOT"
        ? "hot-3step"
        : payload.leadGrade === "WARM"
          ? "warm-3step"
          : "cold-nurture",
  };

  const res = await fetch(automationWebhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(enriched),
  });

  if (!res.ok) {
    throw new Error(`Automation webhook failed: ${res.status}`);
  }

  return { ok: true, skipped: false };
}
