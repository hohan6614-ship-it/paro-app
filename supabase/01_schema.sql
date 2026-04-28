-- ============================================================
-- PARO 스키마 v1
-- ============================================================

-- ------------------------------------
-- ENUM 타입
-- ------------------------------------

CREATE TYPE trade_type_enum AS ENUM (
  '음원', '악보', '샘플팩', '스템', '의뢰'
);

CREATE TYPE license_scope_enum AS ENUM (
  '개인', '상업', '방송', '광고', '게임'
);

CREATE TYPE artist_role_enum AS ENUM (
  '작곡가', '편곡가', '연주자', '보컬', '프로듀서', '음악감독'
);

-- ------------------------------------
-- ARTISTS
-- ------------------------------------

CREATE TABLE artists (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  bio             TEXT,
  profile_image   TEXT,
  portfolio_url   TEXT,

  -- 태그
  instruments     TEXT[] DEFAULT '{}',
  vocal_type      TEXT[] DEFAULT '{}',
  jangdan         TEXT[] DEFAULT '{}',
  emotion         TEXT[] DEFAULT '{}',
  region          TEXT[] DEFAULT '{}',
  timbre          TEXT[] DEFAULT '{}',
  purpose         TEXT[] DEFAULT '{}',
  genre_blend     TEXT[] DEFAULT '{}',
  trade_type      TEXT[] DEFAULT '{}',
  license_scope   TEXT[] DEFAULT '{}',
  collab_open     BOOLEAN DEFAULT true,

  -- 내부 전용
  energy_level    SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  commercial_fit  SMALLINT CHECK (commercial_fit BETWEEN 1 AND 5),

  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------
-- TRACKS
-- ------------------------------------

CREATE TABLE tracks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id       UUID REFERENCES artists(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  duration_sec    INT,
  audio_url       TEXT,
  cover_image     TEXT,
  price           INT,               -- KRW, NULL이면 의뢰 문의

  -- 태그
  instruments     TEXT[] DEFAULT '{}',
  vocal_type      TEXT[] DEFAULT '{}',
  jangdan         TEXT[] DEFAULT '{}',
  emotion         TEXT[] DEFAULT '{}',
  region          TEXT[] DEFAULT '{}',
  timbre          TEXT[] DEFAULT '{}',
  purpose         TEXT[] DEFAULT '{}',
  genre_blend     TEXT[] DEFAULT '{}',
  trade_type      TEXT[] DEFAULT '{}',
  license_scope   TEXT[] DEFAULT '{}',
  collab_open     BOOLEAN DEFAULT false,

  -- 내부 전용
  energy_level    SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  commercial_fit  SMALLINT CHECK (commercial_fit BETWEEN 1 AND 5),

  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------
-- SAMPLE_PACKS
-- ------------------------------------

CREATE TABLE sample_packs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id       UUID REFERENCES artists(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  file_count      INT DEFAULT 0,
  cover_image     TEXT,
  price           INT,               -- KRW

  -- 태그
  instruments     TEXT[] DEFAULT '{}',
  vocal_type      TEXT[] DEFAULT '{}',
  jangdan         TEXT[] DEFAULT '{}',
  emotion         TEXT[] DEFAULT '{}',
  region          TEXT[] DEFAULT '{}',
  timbre          TEXT[] DEFAULT '{}',
  purpose         TEXT[] DEFAULT '{}',
  genre_blend     TEXT[] DEFAULT '{}',
  trade_type      TEXT[] DEFAULT '{}',
  license_scope   TEXT[] DEFAULT '{}',
  collab_open     BOOLEAN DEFAULT false,

  -- 내부 전용
  energy_level    SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  commercial_fit  SMALLINT CHECK (commercial_fit BETWEEN 1 AND 5),

  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------
-- COMMISSION_ITEMS  (의뢰 상품 = 아티스트가 제공하는 의뢰 메뉴)
-- ------------------------------------

CREATE TABLE commission_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id       UUID REFERENCES artists(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  description     TEXT,
  cover_image     TEXT,
  price_from      INT,               -- 최소 금액
  delivery_days   INT,               -- 작업 소요일

  -- 태그
  instruments     TEXT[] DEFAULT '{}',
  vocal_type      TEXT[] DEFAULT '{}',
  jangdan         TEXT[] DEFAULT '{}',
  emotion         TEXT[] DEFAULT '{}',
  region          TEXT[] DEFAULT '{}',
  timbre          TEXT[] DEFAULT '{}',
  purpose         TEXT[] DEFAULT '{}',
  genre_blend     TEXT[] DEFAULT '{}',
  trade_type      TEXT[] DEFAULT '{}',
  license_scope   TEXT[] DEFAULT '{}',
  collab_open     BOOLEAN DEFAULT true,

  -- 내부 전용
  energy_level    SMALLINT CHECK (energy_level BETWEEN 1 AND 5),
  commercial_fit  SMALLINT CHECK (commercial_fit BETWEEN 1 AND 5),

  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------
-- COLLECTIONS  (추천 컬렉션)
-- ------------------------------------

CREATE TABLE collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE collection_items (
  collection_id   UUID REFERENCES collections(id) ON DELETE CASCADE,
  item_type       TEXT NOT NULL CHECK (item_type IN ('track', 'sample_pack', 'commission_item')),
  item_id         UUID NOT NULL,
  sort_order      INT DEFAULT 0,
  PRIMARY KEY (collection_id, item_type, item_id)
);

-- ------------------------------------
-- COMMISSION_REQUESTS  (의뢰 폼 제출 내역)
-- ------------------------------------

CREATE TABLE commission_requests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_item_id  UUID REFERENCES commission_items(id) ON DELETE SET NULL,
  artist_id           UUID REFERENCES artists(id) ON DELETE SET NULL,

  requester_name      TEXT NOT NULL,
  requester_email     TEXT NOT NULL,
  purpose             TEXT,          -- 용도
  mood                TEXT,          -- 원하는 분위기
  reference_url       TEXT,          -- 참고 레퍼런스
  budget              INT,           -- 예산 (KRW)
  deadline            DATE,          -- 희망 납기
  license_scope       TEXT[],        -- 저작권·사용 범위
  notes               TEXT,          -- 요청 내용 자유 기재

  status              TEXT DEFAULT 'pending'
                        CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),

  created_at          TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------
-- 검색 성능용 GIN 인덱스
-- ------------------------------------

CREATE INDEX idx_tracks_instruments     ON tracks     USING GIN (instruments);
CREATE INDEX idx_tracks_emotion         ON tracks     USING GIN (emotion);
CREATE INDEX idx_tracks_purpose         ON tracks     USING GIN (purpose);
CREATE INDEX idx_tracks_genre_blend     ON tracks     USING GIN (genre_blend);
CREATE INDEX idx_tracks_timbre          ON tracks     USING GIN (timbre);
CREATE INDEX idx_tracks_jangdan         ON tracks     USING GIN (jangdan);
CREATE INDEX idx_tracks_region          ON tracks     USING GIN (region);

CREATE INDEX idx_artists_instruments    ON artists    USING GIN (instruments);
CREATE INDEX idx_artists_emotion        ON artists    USING GIN (emotion);
CREATE INDEX idx_artists_purpose        ON artists    USING GIN (purpose);

CREATE INDEX idx_sample_packs_instruments ON sample_packs USING GIN (instruments);
CREATE INDEX idx_sample_packs_emotion     ON sample_packs USING GIN (emotion);
CREATE INDEX idx_sample_packs_purpose     ON sample_packs USING GIN (purpose);

CREATE INDEX idx_commission_items_instruments ON commission_items USING GIN (instruments);
CREATE INDEX idx_commission_items_purpose     ON commission_items USING GIN (purpose);
