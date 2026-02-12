import { LeadPayload } from "./types";

export async function submitLead(payload: LeadPayload) {
  const provider = process.env.LEAD_PROVIDER ?? "mock";

  if (provider === "webhook") {
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (!webhookUrl) {
      throw new Error("LEAD_WEBHOOK_URL is required when LEAD_PROVIDER=webhook");
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Webhook submit failed: ${res.status}`);
    }

    return { ok: true, provider };
  }

  // default mock provider for local/dev usage
  console.log("[lead-capture:mock]", JSON.stringify(payload));
  return { ok: true, provider: "mock" };
}
