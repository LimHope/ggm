# Vercel 배포 가이드

## 🚀 배포 단계

### 1. GitHub에 코드 업로드

#### Option A: GitHub Desktop 사용
1. GitHub Desktop 열기
2. "Add an Existing Repository" 선택
3. `C:\workspace\ggm` 경로 선택
4. "Publish repository" 클릭
5. Repository 이름: `ggm` 또는 원하는 이름
6. Public/Private 선택
7. "Publish Repository" 클릭

#### Option B: Git 명령어 사용
```bash
# GitHub에서 새 repository 생성 후
git remote add origin https://github.com/YOUR_USERNAME/ggm.git
git branch -M main
git push -u origin main
```

### 2. Vercel에 배포

#### 2-1. Vercel 계정 생성/로그인
1. https://vercel.com 접속
2. GitHub 계정으로 로그인

#### 2-2. 프로젝트 Import
1. Vercel 대시보드에서 "Add New..." → "Project" 클릭
2. GitHub repository 검색: `ggm`
3. "Import" 클릭

#### 2-3. 프로젝트 설정
- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (자동 설정됨)
- **Output Directory**: `.next` (자동 설정됨)
- **Install Command**: `npm install` (자동 설정됨)

#### 2-4. 환경 변수 설정 ⚠️ 중요!
"Environment Variables" 섹션에서 다음 변수들을 추가:

```
NEXT_PUBLIC_SUPABASE_URL=https://qsixjynezcskxlugvbvk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaXhqeW5lemNza3hsdWd2YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzA2NzksImV4cCI6MjA4NTE0NjY3OX0.0U7AqAfia0-hjX-siq4e7_u5wU7ee2iqt4rUAq7U89I
```

**설정 방법:**
1. Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://qsixjynezcskxlugvbvk.supabase.co`
   - Environment: Production, Preview, Development 모두 체크

2. Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzaXhqeW5lemNza3hsdWd2YnZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NzA2NzksImV4cCI6MjA4NTE0NjY3OX0.0U7AqAfia0-hjX-siq4e7_u5wU7ee2iqt4rUAq7U89I`
   - Environment: Production, Preview, Development 모두 체크

#### 2-5. 배포 시작
"Deploy" 버튼 클릭

### 3. 배포 완료 후

배포가 완료되면 다음과 같은 URL을 받게 됩니다:
- Production: `https://ggm.vercel.app` (또는 자동 생성된 URL)
- 매 커밋마다 자동으로 새로운 Preview 배포가 생성됩니다

### 4. Supabase 설정 업데이트 (중요!)

배포된 Vercel URL을 Supabase에 추가해야 합니다:

1. Supabase Dashboard (https://supabase.com/dashboard) 접속
2. 프로젝트 선택 (`qsixjynezcskxlugvbvk`)
3. Settings → Authentication → URL Configuration
4. **Site URL** 업데이트:
   - `https://your-app-name.vercel.app`
5. **Redirect URLs** 추가:
   - `https://your-app-name.vercel.app/**`
   - `https://your-app-name.vercel.app/auth/callback`
6. "Save" 클릭

### 5. 커스텀 도메인 설정 (선택사항)

Vercel 대시보드에서:
1. 프로젝트 → Settings → Domains
2. 원하는 도메인 추가
3. DNS 설정 업데이트
4. SSL 인증서 자동 발급 (무료)

## 🔧 배포 후 확인 사항

### 체크리스트
- [ ] 홈페이지 로딩 확인
- [ ] 회원가입 동작 확인
- [ ] 로그인 동작 확인
- [ ] 상품 등록 동작 확인
- [ ] 이미지 업로드 동작 확인
- [ ] 카테고리 필터 동작 확인
- [ ] 프로필 페이지 동작 확인

### 문제 해결

#### 빌드 실패 시
1. Vercel 대시보드에서 "Deployment" 탭 확인
2. 에러 로그 확인
3. 주로 환경 변수 누락이 원인

#### 이미지가 안 보일 때
1. `next.config.ts`에 Vercel 도메인 추가:
```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "qsixjynezcskxlugvbvk.supabase.co",
      port: "",
      pathname: "/storage/v1/object/public/**",
    },
    {
      protocol: "https",
      hostname: "*.vercel.app",
      port: "",
      pathname: "/**",
    },
  ],
}
```

#### 인증이 안 될 때
- Supabase의 Redirect URLs에 Vercel URL이 추가되었는지 확인

## 📊 자동 배포

GitHub에 푸시할 때마다 자동으로 배포됩니다:
```bash
git add .
git commit -m "Update: 기능 추가"
git push
```

Vercel이 자동으로:
1. 빌드 시작
2. 테스트 실행
3. Preview 배포 생성
4. main 브랜치면 Production 배포

## 💰 비용

- Vercel Free 플랜:
  - 무제한 배포
  - 100GB 대역폭/월
  - Serverless Functions 무료
  - 개인 프로젝트에 충분

- Supabase Free 플랜:
  - 500MB 데이터베이스
  - 1GB 파일 저장소
  - 50,000 월간 활성 사용자
  - 취미/테스트 프로젝트에 충분

## 🎉 완료!

배포가 완료되면 전 세계 어디서나 접속 가능한 고구마마켓이 완성됩니다!

배포 URL: `https://your-app-name.vercel.app`
