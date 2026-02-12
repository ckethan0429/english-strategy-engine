import { NextRequest, NextResponse } from "next/server";
import { submitLead } from "@/lib/leadgen/lead-capture";
import { LeadPayload } from "@/lib/leadgen/types";

function validEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
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

    const result = await submitLead(body as LeadPayload);
    return NextResponse.json({ ok: true, provider: result.provider });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
