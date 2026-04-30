# PARO — 국악 크리에이티브 마켓 설계문서

> 작성일: 2026-04-29  
> 버전: Prototype v1  
> 배포: Vercel (GitHub 연동, main 브랜치 자동 배포)

---

## 1. 서비스 개요

### 1.1 목적
국악을 활용하고 싶은 외부 창작자(영상 제작자, 게임 개발자, 광고 기획자, 공연 기획자 등)와 국악 아티스트를 연결하는 탐색·거래 플랫폼.

### 1.2 핵심 가치
- **발견**: 악기·정서·용도 태그로 원하는 소리를 직관적으로 탐색
- **연결**: 아티스트 프로필 → 작품 → 의뢰까지 원스톱
- **신뢰**: 라이선스 범위, 납기, 금액을 투명하게 명시

### 1.3 타깃 사용자
| 역할 | 니즈 |
|------|------|
| 창작자 (구매자) | 프로젝트에 맞는 국악 소리를 빠르게 찾고 라이선스 구매 또는 의뢰 |
| 국악 아티스트 (판매자) | 작품·샘플팩·의뢰 메뉴를 등록하고 새 수익 채널 확보 |

---

## 2. 기술 스택

| 레이어 | 선택 | 이유 |
|--------|------|------|
| 프레임워크 | Next.js 14 (App Router) | 서버 컴포넌트 + 클라이언트 컴포넌트 혼용, SEO |
| 스타일링 | Tailwind CSS v4 + CSS Custom Properties | 유틸리티 클래스 + 오방색 디자인 토큰 |
| 데이터베이스 | Supabase (PostgreSQL) | 배열 컬럼, GIN 인덱스, Realtime 지원 |
| 타입 안전 | TypeScript | 전 레이어 타입 추론 |
| 폰트 | Plus Jakarta Sans + Noto Sans KR (next/font/google) | 현대적 라틴 + 한글 |
| 배포 | Vercel + GitHub | main 푸시 → 자동 배포 |

---

## 3. 디자인 시스템 — 오방색(五方色)

### 3.1 색상 역할 정의

```
오방색          CSS 변수          Hex        역할
──────────────────────────────────────────────────────
백(白) 한지     --bg             #F8F4EC    페이지 배경
               --surface        #FFFFFF    카드 배경
               --surface2       #F2EDE3    보조 배경
               --border         #E3D8C8    구분선

흑(黑) 먹      --text           #1E1A16    본문 텍스트
               --muted          #6F6254    보조 텍스트
               --muted2         #A09080    힌트 텍스트

황(黃) 금      --brand          #8A5A2B    로고·브랜드 포인트
               --gold           #D6A23A    그래픽 액센트

청(靑) 청록    --action         #1E7C73    CTA·인터랙션·버튼
               --action2        #155F58    hover 상태

적(赤) 주홍    --highlight      #C45532    강조 태그·포인트
               --highlight2     #A9472B    hover 상태
```

### 3.2 첫 화면 배경 그래픽
`position: fixed`로 전체 페이지 뒤에 오방색 원형 그래픽을 배치:
- 황 대원 — 우상단 (420px)
- 청 대원 — 좌하단 (380px)
- 적 중원 — 우중단 (200px)
- 황·청 소원 — 보조 리듬
- 흑 미세원 — 하단 중앙 (opacity 0.04)

### 3.3 공통 UI 컴포넌트

| 클래스 | 설명 |
|--------|------|
| `.card` | 흰 배경, border 1px, border-radius 14px, hover 시 shadow + 1px 상승 |
| `.tag` | pill 형태 태그, hover → 청, `.active` → 청 채움, `.highlight` → 적 채움 |
| `.btn-primary` | 청록 배경 버튼 |
| `.btn-outline` | 테두리 버튼 |

---

## 4. 데이터베이스 스키마

### 4.1 테이블 구조

```
artists           — 아티스트 프로필
tracks            — 개별 음원
sample_packs      — 샘플팩 (다수 파일 묶음)
commission_items  — 아티스트가 제공하는 의뢰 메뉴
collections       — 큐레이션 컬렉션
collection_items  — 컬렉션 ↔ 아이템 연결 (M:N)
commission_requests — 의뢰 폼 제출 내역
```

### 4.2 공통 태그 컬럼 (TEXT[])
모든 콘텐츠 테이블(artists, tracks, sample_packs, commission_items)이 동일한 태그 컬럼 구조를 공유:

| 컬럼 | 예시 값 | 의미 |
|------|---------|------|
| `instruments` | 가야금, 해금, 대금 | 악기 |
| `vocal_type` | 판소리, 민요, 정가 | 성악 종류 |
| `jangdan` | 굿거리, 자진모리, 세마치 | 장단 |
| `emotion` | 한, 흥, 몽환, 신명 | 정서 |
| `region` | 경기, 남도, 서도 | 지역 |
| `timbre` | 맑은, 거친, 깊은 | 음색 |
| `purpose` | 영상BGM, 광고, 게임, 공연 | 용도 |
| `genre_blend` | 힙합, EDM, 앰비언트 | 장르 융합 |
| `trade_type` | 음원, 악보, 샘플팩, 의뢰 | 거래 형태 |
| `license_scope` | 개인, 상업, 방송, 광고, 게임 | 라이선스 범위 |

### 4.3 검색 인덱스
배열 컬럼 전체에 GIN 인덱스 적용 → `overlaps` 연산 고속 처리:
```sql
CREATE INDEX idx_tracks_instruments ON tracks USING GIN (instruments);
-- emotion, purpose, genre_blend, timbre, jangdan, region 동일 적용
-- artists, sample_packs, commission_items 동일 패턴
```

### 4.4 ENUM 타입
```sql
trade_type_enum:   음원 | 악보 | 샘플팩 | 스템 | 의뢰
license_scope_enum: 개인 | 상업 | 방송 | 광고 | 게임
artist_role_enum:  작곡가 | 편곡가 | 연주자 | 보컬 | 프로듀서 | 음악감독
```

---

## 5. 검색 로직

### 5.1 검색 규칙
- **같은 축 내** → OR (`overlaps` 연산)
- **다른 축 간** → AND (체인)

예: `해금` + `몽환` + `영상BGM` → instruments overlaps ['해금'] AND emotion overlaps ['몽환'] AND purpose overlaps ['영상BGM']

### 5.2 태그 → 필터 매핑 (`keywordsToFilters`)
검색창에 입력된 자유 태그를 축별로 분류:

```
악기 키워드   → filters.instruments
정서 키워드   → filters.emotion
용도 키워드   → filters.purpose
장단 키워드   → filters.jangdan
장르 키워드   → filters.genre_blend
```

### 5.3 Mock 데이터 폴백
Supabase 연결 실패 시 `lib/mockData.ts`의 정적 데이터로 자동 전환 (프로토타입 안정성 확보).

---

## 6. 페이지 구조

```
/                        — 홈 (탐색 입구)
/search                  — 검색 결과 (tracks · artists · sample_packs · commission_items 탭)
/track/[id]              — 음원 상세
/sample-pack/[id]        — 샘플팩 상세
/artist/[id]             — 아티스트 프로필
/commission/[id]         — 의뢰 상품 상세
/commission/[id]/request — 의뢰 폼
/commission/complete     — 의뢰 완료
```

---

## 7. 컴포넌트 구조

### 7.1 홈 화면 (`app/page.tsx`)
```
<고정 배경 레이어>     — 오방색 원형 그래픽 (position: fixed, z-index: 0)
<콘텐츠 레이어>        — z-index: 1
  ├── Hero Section
  │     ├── 오방색 점 5개 + 서비스 태그라인
  │     ├── h1 헤드라인 ("국악의 소리로 당신의 작품을 완성하세요")
  │     └── SearchBar (max-w-2xl)
  ├── EntryCards         — 4가지 탐색 진입점
  └── CollectionSection  — 추천 컬렉션 4개
```

### 7.2 EntryCards — 탐색 진입점 4종
| 카드 | 색상 | 이동 |
|------|------|------|
| 목적부터 찾기 | 황 (#FEF4E4) | /search?axis=purpose |
| 소리·분위기로 찾기 | 청 (#E6F4F2) | /search?axis=sound |
| 아티스트부터 찾기 | 적 (#FBEEE9) | /search?tab=artist |
| 그냥 둘러보기 | 흑 (#EDECE8) | /search?tab=all |

### 7.3 CollectionSection
Supabase `collections` 테이블에서 서버 컴포넌트로 데이터 fetch.
각 컬렉션에 SVG 패턴 썸네일 대응:

| 컬렉션 | 색조 | SVG 패턴 |
|--------|------|---------|
| 몽환적인 해금 | 청보라 | 파형 곡선 |
| 신명나는 타악 | 황금 | 장구·원 |
| 전자음악 × 국악 | 민트 | 디지털 회로 |
| 장엄한 오프닝 | 크림 | 가야금 현 |

---

## 8. 시드 데이터 (Supabase)

| 테이블 | 수량 |
|--------|------|
| artists | 5명 |
| tracks | 10곡 |
| sample_packs | 3팩 |
| commission_items | 3건 |
| collections | 4개 |

> UUID 규칙: 비-hex 문자 제거 → `b1000000-...` 형태 (PostgreSQL UUID 파싱 안전)

---

## 9. 환경 설정

### 9.1 환경 변수 (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://ohsztwwivggsbwncnmec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

### 9.2 RLS
프로토타입 단계: 전 테이블 RLS 비활성화 (`03_disable_rls.sql`)  
→ 서비스 공개 전 재활성화 및 정책 작성 필요

---

## 10. 배포

| 항목 | 내용 |
|------|------|
| 호스팅 | Vercel |
| 연동 | GitHub repo `hohan6614-ship-it/paro-app` |
| 배포 트리거 | `main` 브랜치 push → 자동 빌드·배포 |
| 빌드 커맨드 | `next build` (Vercel 기본) |

---

## 11. 향후 과제

| 우선순위 | 항목 |
|----------|------|
| High | 실제 음원 파일 업로드 (Supabase Storage) |
| High | 사용자 인증 (아티스트 로그인, 구매자 로그인) |
| High | RLS 정책 수립 |
| Mid | 결제 연동 (Toss Payments 등) |
| Mid | 모바일 반응형 최적화 |
| Mid | 아티스트 콘텐츠 등록 어드민 |
| Low | 검색 결과 정렬·필터 고도화 |
| Low | 추천 알고리즘 (유사 음원 추천) |
