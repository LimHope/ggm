'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input
        type="email"
        label="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="example@email.com"
      />

      <Input
        type="password"
        label="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="비밀번호를 입력하세요"
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}
