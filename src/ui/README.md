# AI 표지 생성을 지원하는 도서관리 시스템 (Frontend)

**React + fetch + CRUD**를 실제 프로젝트에 적용 및 외부 API(**OpenAI**)로 도서 표지를 자동 생성하는 웹 서비스

> 백엔드는 `json-server`로 대체하며, 이후 Backend Mini-Project에서 **Spring Boot**로 교체할 예정

---

## 팀 멤버 및 R&R

| 역할 | 담당 |
| --- | --- |
| 조장 / PM, 기획 | 홍수현 |
| 발표자 / UI, 레이아웃 | 최현준 |
| CRUD 연동 | 오희주, 강민욱 |
| OpenAI 연동 | 정무영 |
| 스타일링, QA | 이휘 |
| 발표자료, 문서 | 조영웅 |

---

## 학습 목표

- 강의에서 학습한 **React + fetch + CRUD** 개념을 실제 프로젝트에 적용
- 외부 API(**OpenAI**) 연동 경험 확보

---

## 기술 스택

| 구분 | 기술 |
| --- | --- |
| **Frontend** | React 19, Vite, fetch (네이티브 API) |
| **Data (Mock Backend)** | json-server (로컬 REST API) |
| **AI 연동** | OpenAI API (GPT Image 모델 — 표지 생성) |
| **협업·배포** | GitHub, Vercel |

---

## SWF — 화면 흐름

메인에서 진입한 뒤 **목록 ↔ 등록 ↔ 상세**를 오가며 도서를 조회·등록하는 흐름입니다.

```mermaid
flowchart TB
  Start([접속]) --> Home[메인]

  Home -->|도서 목록 보기| List[도서 목록]
  Home -->|도서 등록하기| Register[도서 등록]

  List -->|새 도서 등록| Register
  List -->|카드 클릭| Detail[도서 상세]

  Register -->|도서 목록| List
  Detail -->|도서 목록| List

  List -.->|반복 이용| List
```

---

## 화면 구성

| 화면 | 컴포넌트 | 설명 |
| --- | --- | --- |
| 메인 | `HomePage` | 서비스 소개 및 주요 기능 진입 |
| 도서 목록 | `BookListPage` | 등록된 도서 카드 목록 조회 |
| 도서 등록 | `BookDetailPage` (`mode: create`) | 도서 정보 입력·AI 표지 생성·등록 |
| 도서 상세 | `BookDetailPage` (`mode: view`) | 선택한 도서 상세 조회 (수정·삭제) |

화면 전환은 `App.jsx`의 `currentView`(`home` · `list` · `detail`)와 `detailMode`(`create` · `view`)로 제어합니다.

---

## 화면 스크린샷

GitHub 웹에서 README 편집 시, 각 소제목 아래에 스크린샷을 붙여넣으면 됩니다.

### 메인



### 도서 목록



### 도서 등록



---

## 페이지별 요구사항

### 메인 페이지

- 서비스명·안내 문구로 서비스 목적 소개
- **도서 목록 보기** · **도서 등록하기** 버튼으로 각 화면 이동

```mermaid
flowchart LR
  A[접속] --> B[메인 확인]
  B --> C{선택}
  C -->|목록 보기| D[도서 목록]
  C -->|등록하기| E[도서 등록]
```

---

### 도서 등록 페이지

- 책 제목·저자·내용 입력 후 `POST /books`로 등록
- API Key(마스킹), 품질(High / Middle / Low)로 AI 표지 생성 → `coverImageUrl` 저장
- 미생성 시 기본 표지, 필수값·API·생성 실패 시 에러 안내

```mermaid
flowchart LR
  A[등록 페이지] --> B[제목·저자·내용 입력] --> C[API Key 입력] --> D[품질 선택] --> E[이미지 생성] --> F[표지 확인] --> G[도서 등록] --> H[목록에 반영]
```

---

### 도서 목록 페이지

- 진입 시 `GET /books`로 목록 조회, 카드(제목·표지·요약) 표시
- `coverImageUrl` 없으면 기본 표지, 빈 목록 시 안내 문구
- 카드 클릭 → 상세(`id`), **새 도서 등록** → 등록 화면

```mermaid
flowchart LR
  A[목록 페이지] --> B["GET /books"] --> C[카드 목록 표시] --> D{선택}
  D -->|카드 클릭| E[도서 상세]
  D -->|새 도서 등록| F[도서 등록]
```

---

## 프로젝트 구성도

### CRUD — 도서 데이터 관리

```mermaid
flowchart LR
  subgraph Client["브라우저"]
    R[React]
  end
  subgraph Server["로컬 서버"]
    J[json-server<br/>localhost:3000]
    D[(db.json)]
  end
  R -->|GET POST PATCH DELETE| J
  J --> D
```

- **Frontend:** React(브라우저)에서 REST API 호출 (`GET`, `POST`, `PATCH`, `DELETE`)
- **Mock Backend:** `json-server` (`localhost:3000`)
- **저장소:** `db.json`

### AI — 표지 자동 생성

```mermaid
sequenceDiagram
  participant R as React
  participant O as OpenAI<br/>(GPT Image Model)
  participant J as json-server

  Note over R: 사용자 버튼 클릭
  R->>O: 1. POST + prompt
  O-->>R: 2. b64_json 응답
  Note over R: 3. b64_json → Data URL 변환
  R->>J: 4. PATCH /books/{id}<br/>(coverImageUrl만 갱신)
```

1. React에서 사용자가 표지 생성 버튼 클릭
2. `prompt`와 함께 OpenAI(GPT Image Model)에 `POST` 요청
3. 응답의 `b64_json`을 Data URL로 변환
4. `PATCH /books/{id}`로 `coverImageUrl`만 json-server에 저장

---

## API 엔드포인트 (json-server 기준)

| 구분 | 서비스명 | API 이름 | Method | REST API |
| --- | --- | --- | --- | --- |
| 조회 | BookList | 목록 조회 | GET | `/books` |
| 등록 | BookCreate | 도서 등록 | POST | `/books` |
| 수정 | BookUpdate | 도서 수정 | PATCH | `/books/{id}` |
| 삭제 | BookDelete | 도서 삭제 | DELETE | `/books/{id}` |
| 조회 | BookDetail | 도서 상세 조회 | GET | `/books/{id}` |
