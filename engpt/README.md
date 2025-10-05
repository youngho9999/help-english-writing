# EngPT - 영어 작문 연습 플랫폼

AI와 함께하는 미니멀하고 모던한 영어 작문 학습 플랫폼

## 🚀 시작하기

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 추가하세요:

```bash
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/engpt
```

- **GEMINI_API_KEY**: [Google AI Studio](https://makersuite.google.com/app/apikey)에서 무료로 받을 수 있습니다.
- **DATABASE_URL**: PostgreSQL 데이터베이스 연결 URL

### 2. 의존성 설치

```bash
npm install
```

### 3. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate deploy
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 다음을 확인하세요:

- 메인 페이지: [http://localhost:3000](http://localhost:3000)
- 관리자 페이지: [http://localhost:3000/translate](http://localhost:3000/translate)

## 📝 문제 데이터 추가하기

`src/data/problems.ts` 파일을 수정하여 연습할 한글 문장을 추가하세요:

```typescript
export const problems: Problem[] = [
  {
    id: 1,
    korean: "나는 오늘 아침에 커피를 마셨다.",
  },
  {
    id: 2,
    korean: "그녀는 매일 공원에서 운동을 한다.",
  },
  // 여기에 더 많은 문제를 추가하세요!
];
```

## 🎨 주요 기능

### 학습 페이지 (`/`)

- ✨ **미니멀한 UI**: 깔끔하고 직관적인 인터페이스
- 🎯 **커스텀 커서**: [curated.supply](https://www.curated.supply/) 스타일의 인터랙티브 커서
- 🤖 **AI 피드백**: Google Gemini를 활용한 실시간 작문 평가
- 📊 **상세한 분석**: 문법 체크, 개선 제안, 점수 제공
- 🌓 **다크 모드**: 자동 다크 모드 지원

### 관리자 페이지 (`/translate`)

- 📝 **문장 관리**: 데이터베이스의 영어 문장 조회 및 관리
- 🔄 **일괄 번역**: 한 번에 20개 문장을 AI로 번역
- 📄 **페이지네이션**: 20개씩 페이지 분할
- 🔍 **필터링**: 전체/번역완료/번역대기 필터
- 📊 **실시간 진행상황**: 번역 진행률 표시
- 💾 **자동 저장**: 번역 결과 자동 DB 저장

## 🏗️ 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── evaluate/         # 작문 평가 API
│   │   ├── sentences/        # 문장 조회 API (페이지네이션)
│   │   └── translate-batch/  # 일괄 번역 API
│   ├── translate/            # 관리자 페이지
│   │   └── page.tsx
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 메인 학습 페이지
│   └── globals.css           # 글로벌 스타일
├── components/
│   ├── ui/                   # 재사용 가능한 UI 컴포넌트
│   │   ├── CustomCursor.tsx
│   │   └── Button.tsx
│   ├── features/             # 학습 페이지 컴포넌트
│   │   ├── ProblemCard.tsx
│   │   ├── AnswerInput.tsx
│   │   └── FeedbackDisplay.tsx
│   └── admin/                # 관리자 페이지 컴포넌트
│       ├── SentenceTable.tsx
│       ├── SentenceRow.tsx
│       ├── Pagination.tsx
│       └── TranslateButton.tsx
├── lib/
│   ├── gemini.ts            # Gemini AI (번역 + 평가)
│   ├── prisma.ts            # Prisma Client 싱글톤
│   └── utils.ts             # 유틸리티 함수
├── data/
│   └── problems.ts          # 문제 데이터
└── types/
    └── index.ts             # TypeScript 타입 정의
```

## 🛠️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL
- **ORM**: Prisma
- **AI**: Google Generative AI (Gemini)
- **Font**: Geist Sans & Geist Mono

## 📱 반응형 디자인

모바일, 태블릿, 데스크톱 모든 디바이스에서 완벽하게 작동합니다.

## 🎨 디자인 원칙

- **Bold Minimalism**: 깔끔하고 정돈된 디자인
- **Typography-Centric**: 타이포그래피 중심의 UI
- **Dynamic Feedback**: 즉각적인 인터랙티브 피드백
- **Monochromatic Palette**: 흑백 기반에 블루 액센트

## 📄 라이선스

MIT

---

Made with ❤️ for English learners
