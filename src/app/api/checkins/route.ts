import { NextRequest, NextResponse } from "next/server";
import { createCheckinRecord } from "@/lib/speaking/repository";
import { CheckinInput } from "@/lib/speaking/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      planId?: number;
      weekNumber?: number;
      checkin?: CheckinInput;
      adjustmentNote?: string;
    };

    if (!body.planId || !body.weekNumber || !body.checkin || !body.adjustmentNote) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    await createCheckinRecord({
      planId: body.planId,
      weekNumber: body.weekNumber,
      checkin: body.checkin,
      adjustmentNote: body.adjustmentNote,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
