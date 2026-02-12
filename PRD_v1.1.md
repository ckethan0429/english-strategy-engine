# Product Requirements Document: Lead Generator – Improve English Speaking Fluency (MVP v1.1)

## 1. Overview
This one-page lead generator helps users improve their English speaking skills by delivering a customized 4-week routine based on a short interactive survey. A bonus video is unlocked after email submission.

## 2. Product Goals
- Deliver a personalized, structured 4-week speaking routine.
- Capture qualified leads via an email-gated bonus video.
- Keep UX simple and fast to maximize completion and conversion.

## 3. Target User (MVP)
- CEFR A2–B1 learners
- Korean-speaking learners preparing for work, interviews, study-abroad, or travel
- Users with limited daily study time (10–40 min/day)

## 4. Page Flow / Wireframe

### 1️⃣ Hero Section
- Headline: “Speak English with Confidence in 4 Weeks”
- Subheadline: “Get your personalized speaking plan now.”
- Primary CTA: [ Start Survey ]

### 2️⃣ Survey Section (5 Questions)
Use single-select radio inputs for speed.

1. **Current speaking level**
   - Beginner (A1–A2)
   - Lower-Intermediate (A2–B1)
   - Intermediate (B1)
   - Upper-Intermediate+ (B2+)

2. **Daily English exposure**
   - 0–10 min
   - 10–30 min
   - 30–60 min
   - 60+ min

3. **Primary speaking goal**
   - Daily conversation
   - Job interview
   - Presentation / meetings
   - Travel

4. **Preferred learning style**
   - Repetition drills
   - Shadowing
   - Role-play practice
   - Sentence pattern building

5. **Main speaking struggle**
   - Pronunciation
   - Vocabulary recall
   - Grammar while speaking
   - Confidence / anxiety

CTA: [ See My Plan ]

### 3️⃣ Insight Section (generated on submit)
- **Profile label** (e.g., “Pattern-Based Speaking Learner”)
- **4-week plan**
  - weekly focus
  - daily tasks
  - target practice minutes/day
- **Tool suggestions** (e.g., ELSA Speak, YouTube channels)
- **Progress tracker** (e.g., 10 recordings/week + checklist)

### 4️⃣ Email-Gated Video
- Headline: “How 3 People Became Fluent in 90 Days”
- Email input + [ Unlock Video ]
- On success: reveal embedded video
- Optional microcopy: “We may send practical speaking tips. Unsubscribe anytime.”

### 5️⃣ Footer
- [ Restart with a different goal ]

## 5. Personalization Logic

### 5.1 Rule-based mapping (MVP fallback)
Use deterministic templates if GPT fails or latency is high.

- If level is Beginner and struggle is Pronunciation:
  - Week 1–2 pronunciation + shadowing priority
- If goal is Job interview:
  - Weekly mock interview scripts + answer frameworks
- If exposure is 0–10 min:
  - 10-minute micro-routine only
- If learning style is Role-play:
  - Daily scenario prompts + self-recording

### 5.2 GPT generation (optional)
- Input: 5 survey answers
- Output JSON shape:
  - profileLabel
  - weekPlans[1..4]
  - toolSuggestions[]
  - trackingMethod
- Fallback to rule-based template if timeout/error

## 6. Data & Validation
- Required fields: all 5 survey answers + email (for video unlock)
- Email validation: RFC-lite regex + duplicate allowed (same email can resubmit)
- No PII beyond email in MVP

## 7. Analytics Events (required)
- `start_survey`
- `survey_completed`
- `plan_viewed`
- `email_submitted`
- `video_unlocked`
- `restart_clicked`

Track conversion funnel:
1) Hero → Survey start
2) Survey start → Survey complete
3) Survey complete → Email submit
4) Email submit → Video unlock

## 8. Error & Edge Cases
- Plan generation API fails → show fallback static personalized template
- Email submission fails → inline error + retry button
- Slow response (>2s) → loading state/skeleton
- Missing video URL → show “Video temporarily unavailable” with email success confirmation

## 9. Tech Stack
- Frontend: Next.js + TailwindCSS
- Personalization: GPT API + static fallback logic
- Email capture: Formsubmit.io or Firebase
- Analytics: GA4 / PostHog (one required)
- Hosting: Vercel or Netlify

## 10. Success Criteria (MVP)
- Survey completion rate: 60–70%
- Email capture rate (from plan viewers): 30–40%
- Median survey completion time: under 2 minutes
- Qualitative feedback: “Plan feels actionable and relevant”

## 11. Out of Scope (Phase 1)
- User accounts
- Audio upload or pronunciation scoring
- Cross-device sync
- Localization
- Instructor feedback loop

## 12. Future Improvements (Phase 1.1+)
- A/B test headlines and CTA copy
- Add social proof/testimonials near email gate
- Add downloadable PDF version of 4-week plan
- Add weekly reminder emails with practice prompts
