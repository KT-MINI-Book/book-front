import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import HomePage from "./ui/HomePage";
import BookListPage from "./ui/BookListPage";
import BookDetailPage from "./ui/BookDetailPage";

/** URL의 bookId를 상세 페이지에 전달하는 라우트 컴포넌트 */
function BookDetailRoute(props) {
  const { bookId } = useParams();

  return <BookDetailPage {...props} mode="view" bookId={bookId} />;
}

function App() {
  // 다크 모드 상태
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  // 저장된 테마가 있으면 적용하고, 없으면 시스템 테마를 사용한다.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      applyTheme(isDark);
    } else {
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

  // 현재 테마를 반대로 전환한다.
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newIsDarkMode = !prev;
      applyTheme(newIsDarkMode);
      return newIsDarkMode;
    });
  };

  // 페이지 이동: 각 이동은 브라우저 방문 기록에 저장된다.
  const goList = () => navigate("/books");
  const goRegister = () => navigate("/books/new");
  const goDetail = (bookId) => navigate(`/books/${bookId}`);

  // 모든 페이지에서 공통으로 사용하는 props
  const commonPageProps = {
    onGoList: goList,
    onGoRegister: goRegister,
    isDarkMode,
    onToggleTheme: toggleTheme,
  };

  return (
    // URL에 맞는 페이지 하나를 렌더링한다.
    <Routes>
      {/* 홈 */}
      <Route path="/" element={<HomePage {...commonPageProps} />} />

      {/* 도서 목록 */}
      <Route
        path="/books"
        element={<BookListPage {...commonPageProps} onGoDetail={goDetail} />}
      />

      {/* 도서 등록 */}
      <Route
        path="/books/new"
        element={<BookDetailPage {...commonPageProps} mode="create" />}
      />

      {/* 도서 상세 조회 및 수정 */}
      <Route
        path="/books/:bookId"
        element={<BookDetailRoute {...commonPageProps} />}
      />

      {/* 정의되지 않은 주소는 홈으로 이동 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
