export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">고구마마켓</h3>
            <p className="text-sm text-gray-600">
              우리 동네 중고 거래의 새로운 시작
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">고객지원</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600">공지사항</a></li>
              <li><a href="#" className="hover:text-primary-600">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-primary-600">문의하기</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">정보</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600">회사소개</a></li>
              <li><a href="#" className="hover:text-primary-600">이용약관</a></li>
              <li><a href="#" className="hover:text-primary-600">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © 2024 고구마마켓. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
