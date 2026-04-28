export interface Artist {
  id: string
  name: string
  bio: string | null
  profile_image: string | null
  portfolio_url: string | null
  instruments: string[]
  vocal_type: string[]
  jangdan: string[]
  emotion: string[]
  region: string[]
  timbre: string[]
  purpose: string[]
  genre_blend: string[]
  trade_type: string[]
  license_scope: string[]
  collab_open: boolean
  created_at: string
}

export interface Track {
  id: string
  artist_id: string | null
  title: string
  description: string | null
  duration_sec: number | null
  audio_url: string | null
  cover_image: string | null
  price: number | null
  instruments: string[]
  vocal_type: string[]
  jangdan: string[]
  emotion: string[]
  region: string[]
  timbre: string[]
  purpose: string[]
  genre_blend: string[]
  trade_type: string[]
  license_scope: string[]
  collab_open: boolean
  created_at: string
  artist?: Artist
}

export interface SamplePack {
  id: string
  artist_id: string | null
  title: string
  description: string | null
  file_count: number
  cover_image: string | null
  price: number | null
  instruments: string[]
  vocal_type: string[]
  jangdan: string[]
  emotion: string[]
  region: string[]
  timbre: string[]
  purpose: string[]
  genre_blend: string[]
  trade_type: string[]
  license_scope: string[]
  collab_open: boolean
  created_at: string
  artist?: Artist
}

export interface CommissionItem {
  id: string
  artist_id: string | null
  title: string
  description: string | null
  cover_image: string | null
  price_from: number | null
  delivery_days: number | null
  instruments: string[]
  vocal_type: string[]
  jangdan: string[]
  emotion: string[]
  region: string[]
  timbre: string[]
  purpose: string[]
  genre_blend: string[]
  trade_type: string[]
  license_scope: string[]
  collab_open: boolean
  created_at: string
  artist?: Artist
}

export interface Collection {
  id: string
  title: string
  description: string | null
  cover_image: string | null
  sort_order: number
  created_at: string
}

export interface CollectionItem {
  collection_id: string
  item_type: 'track' | 'sample_pack' | 'commission_item'
  item_id: string
  sort_order: number
}

export interface TagFilters {
  instruments?: string[]
  vocal_type?: string[]
  jangdan?: string[]
  emotion?: string[]
  region?: string[]
  timbre?: string[]
  purpose?: string[]
  genre_blend?: string[]
  trade_type?: string[]
  license_scope?: string[]
}

export type Database = {
  public: {
    Tables: {
      artists: { Row: Artist; Insert: Partial<Artist>; Update: Partial<Artist> }
      tracks: { Row: Track; Insert: Partial<Track>; Update: Partial<Track> }
      sample_packs: { Row: SamplePack; Insert: Partial<SamplePack>; Update: Partial<SamplePack> }
      commission_items: { Row: CommissionItem; Insert: Partial<CommissionItem>; Update: Partial<CommissionItem> }
      collections: { Row: Collection; Insert: Partial<Collection>; Update: Partial<Collection> }
      collection_items: { Row: CollectionItem; Insert: Partial<CollectionItem>; Update: Partial<CollectionItem> }
    }
  }
}
