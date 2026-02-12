import { NextRequest, NextResponse } from "next/server";
import { submitLead } from "@/lib/leadgen/lead-capture";
import { LeadPayload } from "@/lib/leadgen/types";
import { runAutomation } from "@/lib/leadgen/automation";
import { appendLead } from "@/lib/leadgen/storage";

function validEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

async function notifyTelegramLead(payload: LeadPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) return;

  const utm = payload.utm ?? {};
  const text = [
    "🔥 New Lead Captured",
    `Source: ${payload.source}`,
    `Email: ${payload.email}`,
    `Profile: ${payload.profileLabel}`,
    `Lead score: ${payload.leadScore ?? "-"} (${payload.leadGrade ?? "-"})`,
    `Consent: ${payload.consentAccepted ? "yes" : "no"}`,
    `UTM source/medium/campaign: ${utm.source ?? "-"} / ${utm.medium ?? "-"} / ${utm.campaign ?? "-"}`,
  ].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    throw new Error(`Telegram notify failed: ${res.status}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<LeadPayload>;

    if (!body.email || !validEmail(body.email)) {
      return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
    }

    if (!body.source || !body.profileLabel || !body.answers) {
      return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
    }

    if (!body.consentAccepted) {
      return NextResponse.json({ ok: false, error: "Privacy consent is required" }, { status: 400 });
    }

    if (!body.consentAcceptedAt) {
      return NextResponse.json({ ok: false, error: "Consent timestamp is required" }, { status: 400 });
    }

    const payload = body as LeadPayload;
    const result = await submitLead(payload);

    try {
      await appendLead(payload);
    } catch (error) {
      console.error("[lead-storage]", error);
    }

    // best-effort automation + notify: do not fail lead capture if side-effects fail
    try {
      await runAutomation(payload);
    } catch (error) {
      console.error("[lead-automation]", error);
    }

    try {
      await notifyTelegramLead(payload);
    } catch (error) {
      console.error("[lead-notify:telegram]", error);
    }

    return NextResponse.json({ ok: true, provider: result.provider });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
