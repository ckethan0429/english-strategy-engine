import fs from "node:fs/promises";
import path from "node:path";
import { LeadPayload } from "./types";

const dataDir = path.join(process.cwd(), "data");
const leadsFile = path.join(dataDir, "leads.ndjson");

export async function appendLead(payload: LeadPayload) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.appendFile(leadsFile, `${JSON.stringify({ ...payload, createdAt: new Date().toISOString() })}\n`);
}

export async function readLeads(): Promise<Array<LeadPayload & { createdAt?: string }>> {
  try {
    const raw = await fs.readFile(leadsFile, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as LeadPayload & { createdAt?: string });
  } catch {
    return [];
  }
}
