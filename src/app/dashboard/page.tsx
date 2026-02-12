import { readLeads } from "@/lib/leadgen/storage";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const leads = await readLeads();

  const total = leads.length;
  const hot = leads.filter((l) => l.leadGrade === "HOT").length;
  const warm = leads.filter((l) => l.leadGrade === "WARM").length;
  const cold = leads.filter((l) => l.leadGrade === "COLD").length;

  const bySource = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.source] = (acc[lead.source] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lead Dashboard (Draft)</h1>
            <p className="mt-2 text-slate-600">Stored leads: {total}</p>
          </div>
          <a
            href="/api/leads/export"
            className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Download CSV
          </a>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Card title="HOT" value={hot} />
          <Card title="WARM" value={warm} />
          <Card title="COLD" value={cold} />
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Leads by Campaign Source</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(bySource).map(([source, count]) => (
              <li key={source} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span>{source}</span>
                <strong>{count}</strong>
              </li>
            ))}
            {Object.keys(bySource).length === 0 && <li className="text-slate-500">No leads yet.</li>}
          </ul>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
