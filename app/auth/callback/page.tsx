'use client'
import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createSupabaseAuth } from '@/lib/supabase-auth'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'
    const supabase = createSupabaseAuth()

    if (code) {
      supabase.auth.exchangeCodeForSession(code)
        .then(({ error }) => {
          router.replace(error ? '/login?error=auth' : next)
        })
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        router.replace(session ? next : '/login')
      })
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--action)', borderTopColor: 'transparent' }} />
        <p className="text-sm" style={{ color: 'var(--muted)' }}>인증 처리 중...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return <Suspense><CallbackHandler /></Suspense>
}
