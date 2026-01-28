import Link from 'next/link'
import SignUpForm from '@/components/auth/SignUpForm'
import Card from '@/components/ui/Card'

export default function SignUpPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-block w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-4xl mb-4">
            🍠
          </div>
          <h1 className="text-3xl font-jua text-gray-900">회원가입</h1>
          <p className="text-gray-600 mt-2 font-jua text-lg">Go구마마켓과 함께 시작하세요</p>
        </div>

        <SignUpForm />

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">이미 계정이 있으신가요? </span>
          <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            로그인
          </Link>
        </div>
      </Card>
    </div>
  )
}
