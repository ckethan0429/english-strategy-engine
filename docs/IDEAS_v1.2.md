# Additional Ideas (while building v1.2)

## 1) Revenue & Offer Layer
- [x] 템플릿별 **Tripwire 오퍼** 추가 (예: 9,900원 체크리스트 확장판)
- [x] 리드 제출 후 Thank-you 화면에서 **캘린더 예약 CTA** 노출
- [~] 업종별 3단 오퍼 구조:
  - [x] Free lead magnet
  - [x] Low-ticket 진단
  - [x] Core 서비스/컨설팅

## 2) Conversion Optimization
- [x] Hero 영역 A/B 테스트 자동 스위치
- [ ] 질문 수 5개 vs 7개 실험
- [ ] 이메일 게이트 문구 실험:
  - "보너스 받기" vs "내 상황 맞춤 가이드 받기"
- [ ] 모바일 first 최적화(스크롤 길이 절감)

## 3) Lead Quality Scoring
- [x] 답변 기반 점수화(구매의도/긴급성/예산)
- [x] Hot/Warm/Cold 등급 산출
- [x] 리드 알림 메시지에 score/grade 포함
- [ ] CRM에 `leadScore`, `templateKey`, `primaryGoal` 필드 저장

## 4) Automation & Ops
- [x] webhook → n8n 연결 기본 플로우 제공
- [x] 자동 태깅:
  - [x] real-estate / marketing / ai-productivity
- [x] 리드 등급 기반 시퀀스 라우팅 필드 생성
  - [x] hot-3step
  - [x] warm-3step
  - [x] cold-nurture
- [ ] 리드 제출 후 자동 이메일 시퀀스(실제 발송 연결)
  - D0: 보너스 전달
  - D2: 실행 팁
  - D5: 상담/상품 제안

## 5) Productization
- 템플릿 마켓형 구조:
  - `templates/*.ts`를 JSON으로 변환해 비개발자도 편집
- 캠페인 복제 기능(새 템플릿 빠른 생성)
- [x] 캠페인별 퍼널 리포트 대시보드 초안 추가(`/dashboard`)

## 6) Immediate Next Build Candidates
- [x] UTM 저장 + 리드 payload 포함
- [x] 개인정보 동의 체크박스 + 정책 링크(동의 문구)
- [x] Thank-you 페이지 분리(`/thanks?template=...`)
- [ ] 관리자용 리드 CSV 다운로드
- [x] 실시간 알림(새 리드 발생시 Telegram)
