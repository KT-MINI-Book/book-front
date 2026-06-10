import { useState, useEffect } from "react";
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
  // 다크 모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- 다크 모드 초기화 및 저장 ---
  useEffect(() => {
    // localStorage에서 저장된 테마 설정 불러오기
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      applyTheme(isDark);
    } else {
      // 시스템 설정 확인
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDark);
      applyTheme(prefersDark);
    }
  }, []);

  const applyTheme = (isDark) => {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.setAttribute("data-theme", "dark");
      htmlElement.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      htmlElement.removeAttribute("data-theme");
      htmlElement.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newIsDarkMode = !prev;
      applyTheme(newIsDarkMode);
      return newIsDarkMode;
    });
  };

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
    setDetailMode("view");
    setSelectedBookId(bookId);
    setCurrentView("detail");
  };

  // --- 조건부 렌더: 한 번에 하나의 Page만 표시 ---

  if (currentView === "home") {
    return <HomePage onGoList={goList} onGoRegister={goRegister} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />;
  }

  if (currentView === "list") {
    return (
      <BookListPage
        onGoList={goList}
        onGoRegister={goRegister}
        onGoDetail={goDetail}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
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
      isDarkMode={isDarkMode}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;
