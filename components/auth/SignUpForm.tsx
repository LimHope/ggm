'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function SignUpForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    try {
      // Check if username is already taken
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single()

      if (existingProfile) {
        throw new Error('이미 사용 중인 사용자명입니다.')
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      router.push('/login')
    } catch (err) {
      setError((err as Error).message || '회원가입에 실패했습니다.')
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
        type="text"
        label="사용자명"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        placeholder="영문, 숫자로 입력하세요"
        pattern="[a-zA-Z0-9_]+"
        minLength={3}
      />

      <Input
        type="text"
        label="이름"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="이름을 입력하세요"
      />

      <Input
        type="password"
        label="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="비밀번호를 입력하세요"
        minLength={6}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? '가입 중...' : '회원가입'}
      </Button>
    </form>
  )
}
