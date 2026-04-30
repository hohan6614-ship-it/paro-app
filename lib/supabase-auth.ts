import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// 쿠키 기반 세션 — 미들웨어에서도 읽힘. 'use client' 파일에서만 import 할 것.
export function createSupabaseAuth() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
