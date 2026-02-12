# EMAIL_SEQUENCES.md

n8n 기반 D0/D2/D5 이메일 시퀀스 연동 가이드.

## 1) 준비

- n8n 실행 중
- 발송 채널 설정 완료 (SMTP/Resend 등)
- 이 프로젝트 `.env.local` 설정 가능

## 2) 워크플로우 Import

1. n8n UI 접속
2. **Import from file**
3. `automation/n8n/email-sequence-workflow.json` 선택
4. Webhook path 확인: `leadgen/email-sequence`

예시 webhook URL:
`https://YOUR_N8N_DOMAIN/webhook/leadgen/email-sequence`

## 3) 앱 연결

프로젝트 `.env.local`:

```bash
AUTOMATION_WEBHOOK_URL=https://YOUR_N8N_DOMAIN/webhook/leadgen/email-sequence
```

현재 `/api/leads`는 신규 리드 저장 후 자동으로 이 webhook에 payload를 전송합니다.

## 4) 발송 환경변수 (n8n)

n8n 환경에서 최소:

```bash
FROM_EMAIL=your@domain.com
```

SMTP/Resend credential은 n8n Email 노드에서 연결.

## 5) 시퀀스 로직

- D0: 즉시 보너스 전달
- Wait 2 days
- D2: 실행 팁
- Wait 3 days
- D5: 다음 단계 오퍼 제안

분기:
- `leadGrade` 기준 HOT/WARM/COLD
- `source` 기준 카피 톤 분기(real-estate/marketing/ai-productivity)

## 6) 안전장치

- `consentAccepted !== true` 인 경우 발송 중단
- automation 실패는 best-effort 처리(리드 저장은 유지)
- 텔레그램 알림은 별도 best-effort

## 7) 테스트 payload

```json
{
  "email": "test@example.com",
  "source": "Marketing Growth Plan Generator (marketing)",
  "profileLabel": "Conversion Optimizer",
  "leadScore": 82,
  "leadGrade": "HOT",
  "selectedOffer": "Growth Sprint Program",
  "consentAccepted": true,
  "consentAcceptedAt": "2026-02-13T01:30:00.000Z",
  "utm": {
    "source": "instagram",
    "medium": "social",
    "campaign": "feb_launch"
  }
}
```

## 8) 추천 다음 단계

- 이메일 open/click webhook 역수집
- unsubscribed 리스트 제외 로직
- 리드별 dedupe 키(email+campaign) 체크
- 템플릿별 D0/D2/D5 카피 외부화(JSON/CMS)
