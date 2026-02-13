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

## 4. Product Flow (Execution Loop)

### 1) Intake Diagnosis
- 현재 레벨, 목표, 사용 가능 시간, 주요 장애요인 진단
- 출력: 개인 전략 프로필

### 2) 4-Week Strategy Plan
- 주차별 목표, 일일 과제, 측정지표 생성
- 예: 주간 녹음 횟수, 실전 말하기 횟수, 회피 상황 감소율

### 3) Calendar Commitment
- 사용자의 캘린더/리마인더에 실행 슬롯 배치
- 미실행 시 재알림 및 보강 태스크 제안

### 4) Weekly Check-in
- 실행률, 실패 패턴, 에너지/동기 상태 점검
- 자동 회고 질문 + 데이터 기반 진단

### 5) Strategy Adjustment
- 실패 원인 분류: 시간 부족 / 난이도 과다 / 심리적 저항 / 환경 문제
- 다음 주 전략 자동 수정 (난이도, 시간, 과제 방식 조정)

---

## 5. Core Mechanisms

### 5.1 Execution Metrics
- 주간 말하기 세션 수
- 총 말하기 시간
- 녹음/피드백 루프 수행 횟수
- 계획 대비 실행률

### 5.2 Failure Analysis Model
- Missed Task 로그 수집
- 원인 태깅(시간/심리/설계/환경)
- 원인별 개입 규칙 적용

### 5.3 Strategy Update Rules (MVP)
- 실행률 < 50%: 과제량 30% 축소 + 마찰 제거
- 실행률 50~80%: 현재 전략 유지 + 장애요인 1개 개선
- 실행률 > 80%: 난이도/실전성 단계적 상향

---

## 6. Data & Validation
- Required: 진단 응답, 주간 체크인 응답, 실행 로그
- Optional: 캘린더 연동 정보, 리마인더 반응
- Validation:
  - 필수 문항 누락 방지
  - 주간 체크인 미완료 시 알림 트리거

---

## 7. Success Criteria (Behavior-Centric)
- 4주 유지율 (retention)
- 주간 실행률 평균
- 체크인 완료율
- 사용자 자기보고 지표: “실제로 말하기가 늘었다”

---

## 8. Out of Scope (v1.1)
- 실시간 발음 자동 채점 고도화
- 멀티 디바이스 완전 동기화
- 커뮤니티/소셜 기능

---

## 9. Next Build Notes
- v1.1은 **Lead Generator 중심**에서 **Behavior Loop Engine 중심**으로 전략 전환
- 다음 단계 개발은 “진단 → 실행 → 체크인 → 조정” 루프를 우선 구현
