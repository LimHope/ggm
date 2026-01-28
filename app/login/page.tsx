import Link from 'next/link'
import LoginForm from '@/components/auth/LoginForm'
import Card from '@/components/ui/Card'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-4xl mb-4">
            🍠
          </div>
          <h1 className="text-2xl font-bold text-gray-900">로그인</h1>
          <p className="text-gray-600 mt-2">고구마마켓에 오신 것을 환영합니다</p>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">계정이 없으신가요? </span>
          <Link href="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
            회원가입
          </Link>
        </div>
      </Card>
    </div>
  )
}
