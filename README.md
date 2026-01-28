# 고구마마켓 (Sweet Potato Market)

당근마켓 스타일의 중고거래 플랫폼 - 짙은 녹색 테마

## 기술 스택

- **Frontend**: Next.js 15 (App Router)
- **Backend**: Supabase (Authentication, Database, Storage)
- **Styling**: Tailwind CSS (Dark Green Theme)
- **Image Upload**: React Dropzone, Browser Image Compression
- **Image Slider**: Swiper
- **Form**: React Hook Form, Zod
- **Icons**: Lucide React

## 주요 기능

- ✅ 사용자 인증 (회원가입, 로그인, 로그아웃)
- ✅ 상품 등록/수정/삭제
- ✅ 이미지 업로드 (최대 10장, 드래그 앤 드롭)
- ✅ 상품 목록 조회 (최신순)
- ✅ 상품 상세 보기 (이미지 슬라이더)
- ✅ 조회수 카운트
- ✅ 마이페이지 (프로필 수정, 내 상품 관리)
- ✅ Row Level Security (RLS)

## 프로젝트 구조

```
ggm/
├── app/                    # Next.js App Router 페이지
│   ├── page.tsx           # 홈 (상품 목록)
│   ├── login/             # 로그인
│   ├── signup/            # 회원가입
│   ├── products/
│   │   ├── new/          # 상품 등록
│   │   └── [id]/         # 상품 상세/수정
│   └── profile/           # 마이페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── layout/           # Header, Footer
│   ├── products/         # 상품 관련 컴포넌트
│   ├── auth/             # 인증 폼
│   └── ui/               # 기본 UI 컴포넌트
├── hooks/                # 커스텀 훅
├── lib/                  # 유틸리티, Supabase 클라이언트
├── types/                # TypeScript 타입 정의
└── supabase/migrations/  # 데이터베이스 마이그레이션

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일이 이미 설정되어 있습니다:

```
NEXT_PUBLIC_SUPABASE_URL=https://qsixjynezcskxlugvbvk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 데이터베이스 구조

### profiles (사용자 프로필)
- id (UUID, FK to auth.users)
- username (TEXT, UNIQUE)
- full_name (TEXT)
- avatar_url (TEXT)
- location (TEXT)
- bio (TEXT)
- created_at, updated_at

### products (상품)
- id (UUID)
- user_id (UUID, FK to profiles)
- title (TEXT)
- description (TEXT)
- price (INTEGER)
- category (TEXT)
- location (TEXT)
- status (TEXT: available/reserved/sold)
- view_count (INTEGER)
- created_at, updated_at

### product_images (상품 이미지)
- id (UUID)
- product_id (UUID, FK to products)
- image_url (TEXT)
- display_order (INTEGER)
- created_at

## 테마 컬러

- **primary-600**: `#16a34a` (메인 짙은 녹색)
- **primary-700**: `#15803d` (더 짙은 녹색)
- **primary-900**: `#14532d` (가장 짙은 녹색)

## 주요 페이지

- **홈 (/)**: 전체 상품 목록 (최신순)
- **로그인 (/login)**: 이메일/비밀번호 로그인
- **회원가입 (/signup)**: 새 계정 생성
- **상품 등록 (/products/new)**: 새 상품 등록 (로그인 필요)
- **상품 상세 (/products/[id])**: 상품 상세 정보, 이미지 슬라이더
- **마이페이지 (/profile)**: 프로필 수정, 내 상품 관리 (로그인 필요)

## 보안

- Row Level Security (RLS) 활성화
- 사용자는 자신의 상품만 수정/삭제 가능
- 이미지 업로드 크기 제한 (5MB)
- 파일 타입 검증 (JPEG, PNG, WebP만 허용)

## 빌드

```bash
npm run build
npm start
```

## 라이선스

MIT
