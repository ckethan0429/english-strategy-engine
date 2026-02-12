import { NextResponse } from "next/server";
import { readLeads } from "@/lib/leadgen/storage";

function csvEscape(value: unknown) {
  const str = String(value ?? "");
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const leads = await readLeads();

  const headers = [
    "createdAt",
    "email",
    "source",
    "profileLabel",
    "leadScore",
    "leadGrade",
    "selectedOffer",
    "abVariant",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "consentAccepted",
    "consentAcceptedAt",
    "scoreReasons",
  ];

  const rows = leads.map((lead) => [
    lead.createdAt ?? "",
    lead.email,
    lead.source,
    lead.profileLabel,
    lead.leadScore ?? "",
    lead.leadGrade ?? "",
    lead.selectedOffer ?? "",
    lead.abVariant ?? "",
    lead.utm?.source ?? "",
    lead.utm?.medium ?? "",
    lead.utm?.campaign ?? "",
    lead.utm?.content ?? "",
    lead.utm?.term ?? "",
    lead.consentAccepted ? "true" : "false",
    lead.consentAcceptedAt,
    (lead.scoreReasons ?? []).join(" | "),
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="leads-export-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
