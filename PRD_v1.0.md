# Product Requirements Document: Lead Generator – Improve English Speaking Fluency (MVP v1.0)

## 1. Overview
This one-page lead generator helps users improve their English speaking skills by delivering a customized 4-week routine based on a short interactive survey. A bonus video is unlocked after email submission.

## 2. Goals
- Deliver a fully personalized, structured practice plan.
- Collect qualified leads through gated content.
- Ensure high completion and conversion with simple UX.

## 3. Page Flow / Wireframe (Text-Based)

### 1️⃣ Hero Section
- Headline: “Speak English with Confidence in 4 Weeks”
- Subheadline: “Get your personalized speaking plan now.”
- CTA Button: [ Start Survey ]

### 2️⃣ Survey Section
- 5 questions:
  - Current speaking level
  - Daily English exposure
  - Primary speaking goal
  - Preferred learning style
  - Speaking struggle
- CTA Button: [ See My Plan ]

### 3️⃣ Insight Section (On Submit)
- Profile Label (e.g., “Pattern-Based Speaking Learner”)
- 4-week custom plan (daily tasks, weekly focus)
- Tool suggestions (e.g., ELSA Speak, YouTube)
- Progress tracking method (e.g., 10 recordings/week)

### 4️⃣ Email-Gated Video
- Headline: “How 3 People Became Fluent in 90 Days”
- Email form + unlock button
- Embedded video shown after email input

### 5️⃣ Footer
- Optional: [ Restart with a different goal ]

## 4. Tech Stack
- Frontend: Next.js + TailwindCSS
- Insight generation: GPT API or static logic
- Email form: Formsubmit.io / Firebase
- Hosting: Vercel / Netlify

## 5. Success Criteria
- 60–70% survey completion
- 30–40% email capture rate
- Users report: “Plan feels actionable and relevant”

## 6. Out of Scope (Phase 1)
- User accounts
- Audio upload/feedback
- Cross-device syncing
- Localization
