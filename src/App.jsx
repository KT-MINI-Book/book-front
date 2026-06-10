import { useState } from "react";
import HomePage from "./ui/HomePage";
import BookListPage from "./ui/BookListPage";
import BookDetailPage from "./ui/BookDetailPage";
import BookReadDetailPage from "./ui/BookReadDetailPage";

function App() {
  // 현재 보여줄 화면
  const [currentView, setCurrentView] = useState("home");
  // detail 화면일 때만 사용 — create(등록) | view(조회) | edit(수정, 추후)
  const [detailMode, setDetailMode] = useState("create");
  // 목록에서 선택한 도서 id (상세 조회·수정 시)
  const [selectedBookId, setSelectedBookId] = useState(null);

  // --- 라우트 ---
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
    setSelectedBookId(bookId);
    setCurrentView("readDetail");
  };

  const goEdit = (bookId) => {
    setDetailMode("edit");
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

  if (currentView === "readDetail") {
    return (
      <BookReadDetailPage
        key={`read-${selectedBookId ?? "none"}`}
        bookId={selectedBookId}
        onGoList={goList}
        onGoRegister={goRegister}
        onGoEdit={goEdit}
      />
    );
  }

  return (
    <BookDetailPage
      key={`${detailMode}-${selectedBookId ?? "new"}`}
      mode={detailMode}
      bookId={selectedBookId}
      onGoList={goList}
      onGoRegister={goRegister}
    />
  );
}

export default App;
