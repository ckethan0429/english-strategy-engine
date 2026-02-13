import { NextRequest, NextResponse } from "next/server";
import { getPlanById } from "@/lib/speaking/repository";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const planId = Number(id);

    if (!Number.isFinite(planId) || planId <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid plan id" }, { status: 400 });
    }

    const data = await getPlanById(planId);
    if (!data) {
      return NextResponse.json({ ok: false, error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, ...data });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
