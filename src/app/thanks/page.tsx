type Props = {
  searchParams: Promise<{
    template?: string;
    grade?: string;
    offer?: string;
  }>;
};

function calendarLinkByGrade(grade?: string) {
  if (grade === "HOT") return process.env.NEXT_PUBLIC_CALENDAR_HOT_URL || process.env.NEXT_PUBLIC_CALENDAR_URL;
  if (grade === "WARM") return process.env.NEXT_PUBLIC_CALENDAR_WARM_URL || process.env.NEXT_PUBLIC_CALENDAR_URL;
  return process.env.NEXT_PUBLIC_CALENDAR_URL;
}

export default async function ThanksPage({ searchParams }: Props) {
  const params = await searchParams;
  const calendarUrl = calendarLinkByGrade(params.grade);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold">Thanks! Your bonus is unlocked.</h1>
          <p className="mt-3 text-slate-600">
            Campaign: <strong>{params.template ?? "-"}</strong> · Lead grade: <strong>{params.grade ?? "-"}</strong>
          </p>

          <div className="mt-5 rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-700">Recommended next step offer</p>
            <p className="font-semibold">{params.offer ?? "Starter Offer"}</p>
          </div>

          {calendarUrl ? (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-500"
            >
              Book Strategy Call
            </a>
          ) : (
            <p className="mt-6 text-sm text-slate-500">Set NEXT_PUBLIC_CALENDAR_URL to enable booking CTA.</p>
          )}
        </section>
      </div>
    </main>
  );
}
