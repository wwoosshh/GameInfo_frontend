# 게임 업데이트 트래커 - 프론트엔드

게임 업데이트 정보를 확인하고 관리하는 웹 애플리케이션

## 기술 스택

- **HTML5 / CSS3**
- **Vanilla JavaScript** (ES6+)
- **API 통신**: Fetch API
- **배포**: Vercel

## 주요 기능

### 사용자 기능
- 게임 목록 조회
- 게임별 버전 정보 확인
- 버전별 업데이트 항목 상세 보기
- 개인 캘린더 관리
- 즐겨찾기 게임 등록

### 관리자 기능
- 게임 추가/수정/삭제
- 버전 정보 관리
- 업데이트 항목 추가/수정/삭제
- 이미지 업로드

## 디렉토리 구조

```
frontend/
├── pages/              # HTML 페이지
│   ├── index.html     # 메인 페이지
│   ├── games.html     # 게임 목록
│   ├── game_versions.html  # 게임 버전 목록
│   ├── version_detail.html # 버전 상세
│   ├── calendar.html  # 캘린더
│   ├── login.html     # 로그인
│   └── admin.html     # 관리자 페이지
├── js/                # JavaScript
│   ├── api.js         # API 통신 모듈
│   ├── app.js         # 메인 앱 로직
│   ├── upload.js      # 이미지 업로드
│   └── category_forms.js  # 카테고리별 폼
├── css/               # 스타일시트
│   └── main.css
├── vercel.json        # Vercel 배포 설정
└── README.md
```

## 로컬 실행

### 방법 1: Live Server (VS Code)
1. VS Code에서 프로젝트 열기
2. Live Server 확장 설치
3. `pages/index.html` 우클릭 → "Open with Live Server"

### 방법 2: Python HTTP Server
```bash
cd frontend
python -m http.server 8000
```
브라우저에서 `http://localhost:8000/pages/index.html` 접속

### 방법 3: Node.js HTTP Server
```bash
npx http-server -p 8000
```

## Vercel 배포

### 1. Vercel CLI 사용
```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
cd frontend
vercel

# 프로덕션 배포
vercel --prod
```

### 2. GitHub 연동 (권장)
1. GitHub에 저장소 푸시
2. https://vercel.com 접속
3. "Import Project" → GitHub 저장소 선택
4. Root Directory: `frontend` 설정
5. Deploy 클릭

## API 연동 설정

백엔드 API URL을 변경하려면 `js/api.js` 파일 수정:

```javascript
const API = {
    baseURL: 'https://your-backend.up.railway.app/api',  // 백엔드 URL로 변경
    // ...
};
```

또는 환경에 따라 자동으로 변경:
```javascript
const API = {
    baseURL: window.location.hostname === 'localhost'
        ? 'http://localhost:8080/api'
        : 'https://your-backend.up.railway.app/api',
    // ...
};
```

## 환경별 URL

- **로컬**: http://localhost:8000/pages/index.html
- **Vercel**: https://your-app.vercel.app/pages/index.html

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 라이선스

MIT
