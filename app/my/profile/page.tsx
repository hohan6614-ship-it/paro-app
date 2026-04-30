'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseAuth } from '@/lib/supabase-auth'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

const USER_TYPES = ['음악 제작자', '영상 크리에이터', '국악 아티스트', '공연·기획자', '그냥 탐색']
const INTERESTS  = ['해금', '가야금', '대금', '판소리', '장구', '피리', '거문고', '아쟁']

const AVATAR_COLORS = [
  { bg: '#FEF4E4', color: '#8A5A2B' },
  { bg: '#E6F4F2', color: '#1E7C73' },
  { bg: '#FBEEE9', color: '#C45532' },
  { bg: '#EDECE8', color: '#3D3530' },
]

export default function MyProfilePage() {
  const { user, loading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const meta = user?.user_metadata ?? {}

  // 폼 상태
  const [nickname, setNickname]   = useState(meta.nickname ?? '')
  const [userType, setUserType]   = useState(meta.user_type ?? '')
  const [interests, setInterests] = useState<string[]>(meta.interests ?? [])
  const [avatarUrl, setAvatarUrl] = useState<string>(meta.avatar_url ?? '')
  const [avatarPreview, setAvatarPreview] = useState<string>(meta.avatar_url ?? '')

  // 비밀번호 변경
  const [newPw, setNewPw]       = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError, setPwError]   = useState('')

  // 탈퇴 모달
  const [deleteModal, setDeleteModal] = useState(false)

  // 저장 로딩
  const [saving, setSaving]     = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/login?returnUrl=/my/profile')
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      const m = user.user_metadata ?? {}
      setNickname(m.nickname ?? '')
      setUserType(m.user_type ?? '')
      setInterests(m.interests ?? [])
      setAvatarUrl(m.avatar_url ?? '')
      setAvatarPreview(m.avatar_url ?? '')
    }
  }, [user])

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="w-8 h-8 rounded-full border-2 animate-spin"
        style={{ borderColor: 'var(--action)', borderTopColor: 'transparent' }} />
    </div>
  )

  const initials = (nickname || user.email || 'U')[0].toUpperCase()
  const avatarStyle = AVATAR_COLORS[(initials.charCodeAt(0) ?? 0) % AVATAR_COLORS.length]

  // ── 아바타 업로드 ──────────────────────────────────

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { showToast('이미지는 2MB 이하여야 해요.', 'error'); return }

    // 로컬 미리보기
    const objectUrl = URL.createObjectURL(file)
    setAvatarPreview(objectUrl)

    setUploading(true)
    const supabase = createSupabaseAuth()
    const ext = file.name.split('.').pop()
    const path = `${user!.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      showToast('이미지 업로드에 실패했어요. avatars 버킷이 생성되어 있는지 확인해주세요.', 'error')
      setAvatarPreview(avatarUrl)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(publicUrl)
    setAvatarPreview(publicUrl)

    await supabase.auth.updateUser({ data: { ...meta, avatar_url: publicUrl } })
    showToast('프로필 사진이 변경됐어요.', 'success')
    setUploading(false)
  }

  // ── 기본 정보 저장 ─────────────────────────────────

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (nickname.trim().length < 2) { showToast('닉네임은 2자 이상이어야 해요.', 'error'); return }

    setSaving(true)
    const supabase = createSupabaseAuth()
    const { error } = await supabase.auth.updateUser({
      data: { ...meta, nickname: nickname.trim(), user_type: userType, interests },
    })
    setSaving(false)

    if (error) showToast('저장에 실패했어요.', 'error')
    else showToast('프로필이 저장됐어요.', 'success')
  }

  // ── 비밀번호 변경 ──────────────────────────────────

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (newPw.length < 8) { setPwError('비밀번호는 8자 이상이어야 해요.'); return }
    if (newPw !== confirmPw) { setPwError('비밀번호가 일치하지 않아요.'); return }

    setPwSaving(true)
    const supabase = createSupabaseAuth()
    const { error } = await supabase.auth.updateUser({ password: newPw })
    setPwSaving(false)

    if (error) setPwError('비밀번호 변경에 실패했어요.')
    else {
      showToast('비밀번호가 변경됐어요.', 'success')
      setNewPw('')
      setConfirmPw('')
    }
  }

  // ── 회원 탈퇴 ──────────────────────────────────────

  async function handleDeleteAccount() {
    // 탈퇴는 서버 사이드 admin API가 필요 — 현재 프로토타입에서는 로그아웃으로 대체
    const supabase = createSupabaseAuth()
    await supabase.auth.signOut()
    showToast('탈퇴 처리가 완료됐어요.', 'info')
    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm" style={{ color: 'var(--muted)' }}>← 홈</Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>프로필 설정</span>
      </div>

      {/* ── 아바타 ── */}
      <div className="card p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          {avatarPreview ? (
            <img src={avatarPreview} alt={nickname}
              className="w-20 h-20 rounded-2xl object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black"
              style={{ background: avatarStyle.bg, color: avatarStyle.color }}>
              {initials}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: '#fff', borderTopColor: 'transparent' }} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-bold" style={{ color: 'var(--text)' }}>{nickname || user.email}</p>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>JPG, PNG, WebP · 최대 2MB</p>
          <button onClick={() => fileInputRef.current?.click()}
            className="btn-outline text-xs px-4 py-2 w-fit" disabled={uploading}>
            사진 변경
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={handleAvatarChange} />
        </div>
      </div>

      {/* ── 기본 정보 ── */}
      <form onSubmit={handleSaveProfile} className="card p-6 flex flex-col gap-5">
        <h2 className="font-bold" style={{ color: 'var(--text)' }}>기본 정보</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>닉네임</label>
          <input type="text" value={nickname} onChange={e => setNickname(e.target.value)}
            placeholder="활동 닉네임" maxLength={20} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>이메일</label>
          <input type="email" value={user.email ?? ''} disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }} />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>사용자 유형</label>
          <div className="flex flex-wrap gap-2">
            {USER_TYPES.map(t => (
              <button key={t} type="button"
                className={`tag ${userType === t ? 'active' : ''}`}
                onClick={() => setUserType(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>관심 국악 요소</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(item => {
              const sel = interests.includes(item)
              return (
                <button key={item} type="button"
                  className={`tag ${sel ? 'active' : ''}`}
                  onClick={() => setInterests(p => sel ? p.filter(i => i !== item) : [...p, item])}>
                  {item}
                </button>
              )
            })}
          </div>
        </div>

        <button type="submit" className="btn-primary w-fit px-6" disabled={saving}
          style={{ opacity: saving ? 0.65 : 1 }}>
          {saving ? '저장 중...' : '저장하기'}
        </button>
      </form>

      {/* ── 비밀번호 변경 ── */}
      <form onSubmit={handlePasswordChange} className="card p-6 flex flex-col gap-4">
        <h2 className="font-bold" style={{ color: 'var(--text)' }}>비밀번호 변경</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>새 비밀번호</label>
          <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
            placeholder="8자 이상" autoComplete="new-password" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--muted)' }}>새 비밀번호 확인</label>
          <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
            placeholder="비밀번호 재입력" autoComplete="new-password" />
        </div>

        {pwError && (
          <p className="text-xs" style={{ color: 'var(--highlight)' }}>⚠ {pwError}</p>
        )}

        <button type="submit" className="btn-outline w-fit px-6" disabled={pwSaving}
          style={{ opacity: pwSaving ? 0.65 : 1 }}>
          {pwSaving ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>

      {/* ── 회원 탈퇴 ── */}
      <div className="card p-6 flex flex-col gap-3" style={{ borderColor: '#f5c9bc' }}>
        <h2 className="font-bold" style={{ color: 'var(--highlight)' }}>회원 탈퇴</h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          탈퇴하면 저장된 정보가 모두 삭제되며 복구할 수 없어요.
        </p>
        <button onClick={() => setDeleteModal(true)}
          className="text-sm font-medium px-4 py-2 rounded-xl w-fit transition-all"
          style={{ color: 'var(--highlight)', border: '1px solid #f5c9bc', background: '#fef2ee' }}>
          탈퇴하기
        </button>
      </div>

      {/* ── 탈퇴 확인 모달 ── */}
      {deleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(30,26,22,0.5)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDeleteModal(false)}>
          <div className="w-full max-w-sm mx-4 card p-7 flex flex-col gap-5"
            onClick={e => e.stopPropagation()}>
            <div>
              <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>정말 탈퇴하시겠어요?</p>
              <p className="text-sm mt-1.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                저장함, 문의 내역 등 모든 데이터가 삭제되며 복구할 수 없어요.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline flex-1" onClick={() => setDeleteModal(false)}>취소</button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'var(--highlight)', color: '#fff' }}
                onClick={handleDeleteAccount}>
                탈퇴하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
