# Product Requirements Document: English Speaking Personal Strategy Engine (v1.1 Pivot)

## 1. Overview
English Speaking Personal Strategy Engine은 사용자의 현재 영어 말하기 수준을 진단하고, 구체적인 실행 플랜을 생성하며, 주간 단위 체크인과 전략 수정을 수행하는 **AI 기반 행동 변화 시스템**이다.

핵심 목적은 단순한 학습 계획 제공이 아니라, 실제 말하기 행동을 지속시키는 실행 루프를 만드는 것이다.

---

## 2. Product Goals
1. 사용자의 말하기 목표를 실행 가능한 단위로 분해한다.
2. 구체적이고 측정 가능한 4주 실행 전략을 생성한다.
3. 캘린더 및 체크인 시스템을 통해 실행을 강제한다.
4. 실패 원인을 분석하고 전략을 조정한다.
5. 사용자가 “계획 세우는 사람”이 아니라 “말하는 사람”이 되도록 한다.

---

## 3. Core System Structure

### 3.1 Goal Input Layer
사용자 입력 항목:
- 현재 영어 말하기 수준
- 목표 (예: 여행 회화, 면접, 프레젠테이션 등)
- 목표 기간 (기본 4주)
- 하루 투자 가능 시간
- 가장 어려운 부분 (단어, 문법, 자신감, 자연스러움 등)

### 3.2 Diagnostic Interview Layer
AI가 추가로 구조화 질문을 수행:
- 최근 2주간 실제 말한 횟수
- 영어 말하기를 피하게 되는 상황
- 과거 실패 경험
- 에너지 시간대 (아침/저녁)
- 발화에 대한 심리적 저항 수준

출력:
- Speaking Profile (예: Pattern-Based Learner / Avoidant Speaker / Passive Input-Heavy Learner)
- 주요 장애 요인
- 행동 실패 위험 요인

### 3.3 Strategy Generation Layer
출력은 반드시 구체적이고 수치 기반이어야 한다.

#### A. 4-Week Roadmap
**Week 1**
- 하루 10분 Shadowing
- 하루 3문장 직접 발화 녹음
- 주 3회 짧은 상황 연습

**Week 2**
- 하루 5분 즉흥 말하기
- 주 5회 3분 스피킹 녹음
- 특정 상황 3개 집중 훈련

**Week 3**
- 5분 자유 말하기 도전
- 원어민 영상 1분 따라 말하기
- 실전 대화 스크립트 응용

**Week 4**
- 7분 말하기 미션
- Week 1 녹음과 비교 분석
- 말하기 속도 및 자연스러움 점검

#### B. Daily Action Units
- 최소 발화 시간: 하루 5~10분
- 최소 녹음 횟수: 주 5회
- 주간 누적 발화 시간 목표: 40~60분

#### C. Success Criteria
- 4주간 총 녹음 파일 수 ≥ 20개
- 발화 시간 점진적 증가
- 스스로 말문이 막히는 빈도 감소

---

## 4. Execution Layer (MVP)

### 4.1 Calendar Integration
- 4주 플랜 기반 ICS 일정 생성
- 반복 규칙 포함 (주 5회 / 특정 시간대)
- 캘린더 제목 예:
  - `[Speak] 10-min Shadowing`
  - `[Speak] 3-min Free Talk`

### 4.2 Weekly Check-in System
매주 자동 체크인 질문:
1. 이번 주 목표 달성 여부 (Yes / No)
2. 실패한 날의 주요 이유
3. 에너지 수준
4. 다음 주 난이도 조정 필요 여부

---

## 5. Feedback & Adjustment Layer
AI는 체크인 결과를 기반으로:
- 3회 연속 실패 시 → 난이도 축소
- 2주 연속 성공 시 → 발화 시간 확대
- 특정 실패 원인 반복 시 → 전략 변경

예:
- “시간 부족” 반복 → 10분 → 5분 구조로 조정
- “자신감 부족” 반복 → 녹음 대신 1:1 대화 시뮬레이션 강화

---

## 6. User Flow (MVP)
1. Goal 입력
2. 진단 인터뷰 진행
3. 4주 전략 생성
4. “Track This Plan” 클릭
5. ICS 일정 다운로드
6. 주간 체크인 이메일 수신
7. 전략 자동 수정

---

## 7. Data Model (MVP)

### User
- id
- email
- timezone

### Goal
- user_id
- target_type
- duration
- constraints

### Plan
- goal_id
- strategy_text
- weekly_structure
- created_at

### Checkin
- plan_id
- week_number
- status
- reason
- adjustment_note

---

## 8. Success Metrics (Internal)
- 4주 유지율 ≥ 50%
- 체크인 응답률 ≥ 70%
- 4주 후 발화 빈도 증가
- 자기 보고 자신감 상승

---

## 9. Out of Scope (Phase 1)
- 음성 자동 분석
- 발음 AI 평가
- 모바일 앱
- 커뮤니티 기능
- 다중 목표 동시 운영

---

## 10. Next Build Notes
- v1.1은 **Lead Generator 중심**에서 **Behavior Loop Engine 중심**으로 전략 전환
- 다음 단계 개발은 “진단 → 실행 → 체크인 → 조정” 루프를 우선 구현
