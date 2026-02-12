# Product Requirements Document: [Product Name] – [One-line Outcome] (MVP v1.2)

> 작성 가이드: 이 문서는 **범용 리드 생성기** PRD 템플릿입니다.  
> 대괄호(`[ ]`) 안을 프로젝트에 맞게 채우세요.

---

## 1. Overview
이 페이지는 [타겟 사용자]가 [핵심 문제]를 해결하도록 돕는 **원페이지 리드 생성기**입니다.  
사용자는 짧은 [입력 방식: 설문/진단/퀴즈]를 완료하고, 개인화된 [결과물 유형]을 확인합니다.  
추가 [보너스 콘텐츠 유형]는 [이메일/연락처] 제출 후 잠금 해제됩니다.

- Product Name: [예: Smart Lead Generator]
- Core Promise: [예: 3분 만에 맞춤 실행 플랜 제공]
- Primary Conversion: [예: 이메일 수집]

---

## 2. Product Goals
- [Goal 1: 예: 개인화된 결과 제공으로 신뢰 형성]
- [Goal 2: 예: 고의도 리드 수집]
- [Goal 3: 예: 단순한 UX로 높은 완료율 유지]

### Non-Goals (Optional)
- [예: 회원가입/로그인]
- [예: 복잡한 대시보드]

---

## 3. Target User (MVP)
- Primary segment: [누구를 위한 서비스인지]
- User context: [어떤 상황에서 사용하는지]
- Current pain points:
  - [Pain 1]
  - [Pain 2]
- Desired outcome: [사용자가 얻고 싶은 결과]

---

## 4. Page Flow / Wireframe

### 1️⃣ Hero Section
- Headline: "[핵심 가치 제안]"
- Subheadline: "[보조 설명]"
- Primary CTA: [ Start Assessment ]
- Optional trust elements: [후기, 숫자, 로고 등]

### 2️⃣ Input Section (Survey/Quiz/Assessment)
- Number of questions: [예: 5]
- Input type: [single-select / multi-select / short text]
- Questions:
  1. [Question 1]
  2. [Question 2]
  3. [Question 3]
  4. [Question 4]
  5. [Question 5]
- CTA: [ See My Result ]

### 3️⃣ Insight / Result Section (On Submit)
- Result label: [예: “Action-Oriented Builder”]
- Personalized output:
  - [예: 4주 계획 / 체크리스트 / 추천 액션]
- Recommended tools/resources:
  - [Tool 1]
  - [Tool 2]
- Progress tracking method:
  - [예: 주간 체크리스트, KPI 트래킹]

### 4️⃣ Lead Capture Gate
- Headline: "[보너스 콘텐츠 제목]"
- Form fields:
  - [email]
  - [optional: name/company/phone]
- CTA: [ Unlock Bonus ]
- Success state:
  - [영상/다운로드 링크/상세 리포트 노출]

### 5️⃣ Footer / Re-entry
- [ Restart with different goal ]
- Optional links: [개인정보 처리방침, 이용약관]

---

## 5. Personalization Logic

### 5.1 Rule-based Mapping (Required fallback)
입력값 조합을 결과로 매핑하는 최소 규칙을 정의합니다.

예시 포맷:
- If [condition A], then [result behavior A]
- If [condition B], then [result behavior B]
- If [condition C], then [result behavior C]

### 5.2 AI Generation (Optional)
- Model/API: [예: GPT API]
- Input schema: [질문 응답 JSON]
- Output schema:
  - resultLabel
  - actionPlan[]
  - suggestedTools[]
  - trackingMethod
- Fallback strategy: [API 실패 시 규칙 기반 결과 표시]

---

## 6. Data & Validation
- Required inputs:
  - [필수 질문 목록]
  - [필수 연락처 필드]
- Validation rules:
  - [예: 이메일 형식 검증]
  - [예: 필수 응답 누락 방지]
- Data retention policy:
  - [보관 기간/정책]
- Compliance notes:
  - [개인정보 처리 안내 문구]

---

## 7. Analytics Events (Required)
- `start_assessment`
- `assessment_completed`
- `result_viewed`
- `lead_submitted`
- `bonus_unlocked`
- `restart_clicked`

### Funnel Definition
1. Hero CTA Click → Assessment Start
2. Assessment Start → Assessment Complete
3. Assessment Complete → Lead Submit
4. Lead Submit → Bonus Unlock

---

## 8. Error & Edge Cases
- [결과 생성 실패 시 fallback 표시]
- [폼 제출 실패 시 재시도 UX]
- [로딩 지연 시 skeleton/loading 표시]
- [보너스 콘텐츠 미연결 시 대체 메시지]

---

## 9. Tech Stack
- Frontend: [Next.js / React / etc.]
- Styling: [TailwindCSS / etc.]
- Backend/API: [Optional]
- Lead capture: [Formsubmit/Firebase/HubSpot/etc.]
- Analytics: [GA4/PostHog/Mixpanel]
- Hosting: [Vercel/Netlify/etc.]

---

## 10. Success Criteria (MVP)
- Assessment completion rate: [예: 60%+]
- Lead capture rate: [예: 30%+]
- Bonus unlock rate: [예: 80%+ of submitted]
- Time-to-complete: [예: 2분 이내]
- Qualitative feedback target: "[사용자 피드백 목표 문장]"

---

## 11. Out of Scope (Phase 1)
- [Out of scope 1]
- [Out of scope 2]
- [Out of scope 3]

---

## 12. Future Improvements (Phase 1.3+)
- [A/B test items]
- [CRM 자동 연동]
- [개인화 정교화]
- [리마인더/시퀀스 메일 자동화]

---

## Appendix A. Question Bank (Optional)
- Q1: [ ]
- Q2: [ ]
- Q3: [ ]
- Q4: [ ]
- Q5: [ ]

## Appendix B. Copy Variants (Optional)
- Headline A: [ ]
- Headline B: [ ]
- CTA A: [ ]
- CTA B: [ ]

## Appendix C. Acceptance Checklist
- [ ] 질문/옵션 확정
- [ ] 결과 로직(규칙 기반) 정의
- [ ] 리드 폼 + 검증 구현
- [ ] 이벤트 트래킹 연결
- [ ] 실패/로딩 UX 처리
- [ ] 모바일 반응형 확인
