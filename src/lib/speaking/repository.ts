import { pool } from "@/lib/db";
import { CheckinInput, DiagnosticInput, GoalInput, PlanPayload } from "./types";

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      timezone TEXT NOT NULL DEFAULT 'Asia/Seoul',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS goals (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      target_type TEXT NOT NULL,
      duration TEXT NOT NULL,
      constraints JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS plans (
      id BIGSERIAL PRIMARY KEY,
      goal_id BIGINT NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
      strategy_text TEXT NOT NULL,
      weekly_structure JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id BIGSERIAL PRIMARY KEY,
      plan_id BIGINT NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
      week_number INT NOT NULL,
      status TEXT NOT NULL,
      reason TEXT NOT NULL,
      energy TEXT NOT NULL,
      adjust_need TEXT NOT NULL,
      adjustment_note TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

export async function createPlanRecord(input: {
  email: string;
  timezone?: string;
  goal: GoalInput;
  diagnostic: DiagnosticInput;
  plan: PlanPayload;
}) {
  await ensureSchema();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userRes = await client.query(
      `INSERT INTO users (email, timezone)
       VALUES ($1, COALESCE($2, 'Asia/Seoul'))
       ON CONFLICT (email) DO UPDATE SET timezone = EXCLUDED.timezone
       RETURNING id`,
      [input.email, input.timezone ?? "Asia/Seoul"],
    );
    const userId = userRes.rows[0].id as number;

    const goalRes = await client.query(
      `INSERT INTO goals (user_id, target_type, duration, constraints)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [
        userId,
        input.goal.goal,
        input.goal.duration,
        JSON.stringify({
          level: input.goal.level,
          timePerDay: input.goal.timePerDay,
          struggle: input.goal.struggle,
          diagnostic: input.diagnostic,
        }),
      ],
    );
    const goalId = goalRes.rows[0].id as number;

    const planRes = await client.query(
      `INSERT INTO plans (goal_id, strategy_text, weekly_structure)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [
        goalId,
        `${input.plan.profileLabel} | blockers: ${input.plan.blockers.join(", ")}`,
        JSON.stringify({
          weekPlans: input.plan.weekPlans,
          dailyActionUnits: input.plan.dailyActionUnits,
          successCriteria: input.plan.successCriteria,
          riskFactors: input.plan.riskFactors,
        }),
      ],
    );

    await client.query("COMMIT");
    return { planId: planRes.rows[0].id as number };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function createCheckinRecord(input: {
  planId: number;
  weekNumber: number;
  checkin: CheckinInput;
  adjustmentNote: string;
}) {
  await ensureSchema();
  await pool.query(
    `INSERT INTO checkins (plan_id, week_number, status, reason, energy, adjust_need, adjustment_note)
     VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      input.planId,
      input.weekNumber,
      input.checkin.success,
      input.checkin.reason,
      input.checkin.energy,
      input.checkin.adjustNeed,
      input.adjustmentNote,
    ],
  );
}
