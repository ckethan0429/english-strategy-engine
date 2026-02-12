# Lead Generator – English Speaking Fluency

One-page lead generator to provide a personalized 4-week English speaking plan and unlock a bonus video after email submission.

## Documents

- `PRD_v1.0.md`: Original MVP PRD (high-level)
- `PRD_v1.1.md`: Expanded implementation PRD (logic, data, analytics, error handling)

## v1.0 vs v1.1 (Quick Diff)

### v1.0
- Defines concept, page flow, core goals
- Basic tech stack and KPIs
- MVP scope boundaries

### v1.1
- Adds target user persona
- Finalizes survey options (single-select)
- Specifies personalization mapping logic + GPT fallback
- Defines required analytics events and funnel
- Adds validation rules and edge/error handling
- Adds implementation-level acceptance criteria

## Version Branches

- `v1.0-mvp`: English speaking lead generator MVP
- `v1.1-enhanced`: Enhanced UX + mapping + analytics scaffolding
- `v1.2-generic-builder`: Generic reusable lead generator template

## v1.2 Generic Customization

Edit `src/app/page.tsx` → `template` object:
- Hero copy (`heroHeadline`, `heroSubheadline`)
- Question set (`questions`)
- CTA labels and bonus headline

You can reuse the same UI/flow for any niche by changing only template values and (optionally) `buildResult()` rules.

## Development Setup (Next.js + Tailwind)

### Run locally

```bash
npm install
npm run dev
```

Then open: <http://localhost:3000>

## Suggested Build Order

1. Build hero + survey UI
2. Implement rule-based plan generator (fallback-first)
3. Add email gate + video unlock
4. Add analytics events
5. Polish loading/error states

## Notes

- Keep MVP fast and deterministic.
- Use GPT generation only as an enhancement; fallback logic must always work.
