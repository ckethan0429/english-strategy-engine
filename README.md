# Lead Generator (Reusable Base)

범용 리드 생성기 베이스 프로젝트.  
하나의 코드베이스로 여러 업종/주제 캠페인을 빠르게 만들 수 있게 구성되어 있습니다.

## Branches

- `v1.0-mvp`: 영어 스피킹 전용 MVP
- `v1.1-enhanced`: UX/로직/트래킹 개선
- `v1.2-generic-builder`: 범용 템플릿 기반 빌더 (현재 사업 베이스)

## Core Architecture (v1.2)

- `src/lib/leadgen/types.ts`  
  공통 타입 정의 (Template, Result, Lead Payload)
- `src/lib/leadgen/templates/default.ts`  
  캠페인 템플릿(문구/문항/CTA)
- `src/lib/leadgen/engine.ts`  
  규칙 기반 결과 생성 엔진 (fallback-safe)
- `src/lib/leadgen/analytics.ts`  
  이벤트 트래킹 훅 (GA4/PostHog 연결 지점)
- `src/app/api/leads/route.ts`  
  리드 수집 API 엔드포인트
- `src/lib/leadgen/lead-capture.ts`  
  리드 전송 provider(mock/webhook)
- `src/app/page.tsx`  
  공통 UI 플로우 (Hero → Assessment → Result → Lead Gate)

## PRD Files

- `PRD_v1.0.md`
- `PRD_v1.1.md`
- `PRD_v1.2_TEMPLATE.md` (범용 템플릿)

## Bonus Assets (connected)

- Real Estate: `public/bonus/real-estate-checklist.md`
- Marketing: `public/bonus/marketing-hooks.md`
- AI Productivity: `public/bonus/ai-prompts.md`

## Extra Build Notes

- Additional ideas documented in: `docs/IDEAS_v1.2.md`

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: <http://localhost:3000>

## UTM / Consent / Telegram Alert (implemented)

- UTM capture: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`
- Privacy consent checkbox is required before lead submit
- Lead scoring enabled (0-100 + HOT/WARM/COLD)
- New lead Telegram alert (optional) via server env config

## Lead Capture Providers

### 1) Mock (default)

`.env.local`

```bash
LEAD_PROVIDER=mock
```

- 서버 콘솔에 리드 payload 로그 출력
- 초기 개발/테스트 용도

### 2) Webhook

`.env.local`

```bash
LEAD_PROVIDER=webhook
LEAD_WEBHOOK_URL=https://your-endpoint.example.com/leads
```

- `/api/leads`가 지정 webhook으로 POST
- CRM, n8n, Zapier, Make 등에 바로 연결 가능

### 3) Telegram lead alert (optional)

`.env.local`

```bash
TELEGRAM_BOT_TOKEN=123456:ABC...
TELEGRAM_CHAT_ID=123456789
```

- 새 리드 발생 시 텔레그램으로 요약 알림 전송
- 실패해도 리드 저장 자체는 실패 처리하지 않음 (best-effort)

## How to Launch a New Campaign

1. `src/lib/leadgen/templates/default.ts` 수정
   - 헤드라인, 서브카피, CTA
   - 질문/옵션
2. `src/lib/leadgen/engine.ts` 수정
   - 질문 답변별 결과/플랜 매핑 규칙
3. 보너스 콘텐츠 연결
   - `src/app/page.tsx`의 unlocked block 교체 (영상/다운로드/상담링크)
4. webhook 연결 후 리드 수집 테스트

## Required Events (current scaffold)

- `start_assessment`
- `assessment_completed`
- `result_viewed`
- `lead_submitted`
- `bonus_unlocked`
- `restart_clicked`

현재는 콘솔 기반이며, `analytics.ts`에서 실제 도구 연동하면 됩니다.

## Featured Campaigns (추천 3개)

현재 바로 실행 가능한 추천 캠페인 3종:

1. **부동산** (`real-estate`)
2. **마케팅 성장** (`marketing`)
3. **AI 생산성** (`ai-productivity`)

위 3개는 랜딩 페이지 상단 Campaign template 셀렉터에서 바로 전환됩니다.

## Business-Ready Next Steps

- GA4/PostHog 실제 연동
- HubSpot/Sheets/CRM 저장 파이프라인 연결
- A/B 테스트(헤드라인/CTA/문항)
- UTM 파라미터 저장
- 개인정보/동의 문구 및 정책 페이지 추가
