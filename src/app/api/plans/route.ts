import { NextRequest, NextResponse } from "next/server";
import { createPlanRecord } from "@/lib/speaking/repository";
import { DiagnosticInput, GoalInput, PlanPayload } from "@/lib/speaking/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      timezone?: string;
      goal?: GoalInput;
      diagnostic?: DiagnosticInput;
      plan?: PlanPayload;
    };

    if (!body.email || !body.goal || !body.diagnostic || !body.plan) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const res = await createPlanRecord({
      email: body.email,
      timezone: body.timezone,
      goal: body.goal,
      diagnostic: body.diagnostic,
      plan: body.plan,
    });

    return NextResponse.json({ ok: true, planId: res.planId });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
