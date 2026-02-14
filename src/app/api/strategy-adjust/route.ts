import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/lib/speaking/repository";
import { generateAdjustedStrategy } from "@/lib/speaking/strategy-adjust";
import { CheckinInput } from "@/lib/speaking/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      planId?: number;
      weekNumber?: number;
      checkin?: CheckinInput;
    };

    if (!body.planId || !body.weekNumber || !body.checkin) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const loaded = await getPlanById(body.planId);
    if (!loaded) {
      return NextResponse.json({ ok: false, error: "Plan not found" }, { status: 404 });
    }

    const weekly = loaded.plan.weekly_structure as {
      weekPlans?: string[];
      riskFactors?: string[];
    };

    const currentWeekPlan = weekly.weekPlans?.[body.weekNumber - 1] ?? "";
    const adjustment = await generateAdjustedStrategy({
      weekNumber: body.weekNumber,
      currentWeekPlan,
      checkin: body.checkin,
      riskFactors: weekly.riskFactors ?? [],
    });

    return NextResponse.json({ ok: true, adjustment });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
