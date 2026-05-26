import { useState } from "react";
import HomePage from "./ui/HomePage";
import BookListPage from "./ui/BookListPage";
import BookDetailPage from "./ui/BookDetailPage";

function App() {
  // 현재 보여줄 화면
  const [currentView, setCurrentView] = useState("home");
  // detail 화면일 때만 사용 — create(등록) | view(조회) | edit(수정, 추후)
  const [detailMode, setDetailMode] = useState("create");
  // 목록에서 선택한 도서 id (상세 조회·수정 시)
  const [selectedBookId, setSelectedBookId] = useState(null);

  // --- 라우트 ---
  const goHome = () => {
    setCurrentView("home");
  };

  const goList = () => {
    setCurrentView("list");
  };

  /** 등록: detail + create, bookId 없음 */
  const goRegister = () => {
    setDetailMode("create");
    setSelectedBookId(null);
    setCurrentView("detail");
  };

  /** 목록 카드 클릭: detail + view, bookId 지정 */
  const goDetail = (bookId) => {
    setDetailMode("view");
    setSelectedBookId(bookId);
    setCurrentView("detail");
  };

  // --- 조건부 렌더: 한 번에 하나의 Page만 표시 ---

  if (currentView === "home") {
    return <HomePage onGoList={goList} onGoRegister={goRegister} />;
  }

  if (currentView === "list") {
    return (
      <BookListPage
        onGoList={goList}
        onGoRegister={goRegister}
        onGoDetail={goDetail}
      />
    );
  }

  return (
    <BookDetailPage
      mode={detailMode}
      bookId={selectedBookId}
      onGoList={goList}
      onGoRegister={goRegister}
    />
  );
}

export default App;
