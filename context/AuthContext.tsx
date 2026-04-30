'use client'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import type { User } from '@supabase/supabase-js'
import { createSupabaseAuth } from '@/lib/supabase-auth'
import { useToast } from '@/context/ToastContext'

export type AuthModalContext = 'save' | 'contact' | 'general'

interface AuthContextValue {
  user: User | null
  loading: boolean
  authModalOpen: boolean
  authModalCtx: AuthModalContext
  openAuthModal: (ctx?: AuthModalContext) => void
  closeAuthModal: () => void
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  authModalOpen: false,
  authModalCtx: 'general',
  openAuthModal: () => {},
  closeAuthModal: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalCtx, setAuthModalCtx] = useState<AuthModalContext>('general')
  const { showToast } = useToast()
  const prevUserRef = useRef<User | null>(null)

  useEffect(() => {
    const supabase = createSupabaseAuth()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      prevUserRef.current = session?.user ?? null
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null
      const hadUser = prevUserRef.current !== null

      setUser(nextUser)

      if (event === 'SIGNED_OUT' && hadUser) {
        showToast('로그아웃됐어요.', 'info')
      }
      if (event === 'TOKEN_REFRESHED') {
        // silent — do nothing
      }
      if (event === 'SIGNED_IN' && !prevUserRef.current && nextUser) {
        showToast(`${nextUser.user_metadata?.nickname ?? ''}님, 환영해요!`, 'success')
      }

      prevUserRef.current = nextUser
    })

    return () => subscription.unsubscribe()
  }, [showToast])

  const openAuthModal = useCallback((ctx: AuthModalContext = 'general') => {
    setAuthModalCtx(ctx)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => setAuthModalOpen(false), [])

  return (
    <AuthContext.Provider value={{ user, loading, authModalOpen, authModalCtx, openAuthModal, closeAuthModal }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
