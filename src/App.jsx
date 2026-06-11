import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate, useParams } from "react-router";
import HomePage from "./ui/HomePage";
import BookListPage from "./ui/BookListPage";
import BookDetailPage from "./ui/BookDetailPage";
import BookReadDetailPage from "./ui/BookReadDetailPage";

const getInitialDarkMode = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    return savedTheme === "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

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

/** URL의 bookId를 상세 페이지에 전달하는 라우트 컴포넌트 */
function BookReadDetailRoute(props) {
  const { bookId } = useParams();

  return <BookReadDetailPage {...props} bookId={bookId} />;
}

function BookEditRoute(props) {
  const { bookId } = useParams();

  return <BookDetailPage {...props} mode="edit" bookId={bookId} />;
}

function App() {
  // 다크 모드 상태
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);
  const navigate = useNavigate();

  useEffect(() => {
    applyTheme(isDarkMode);
  }, [isDarkMode]);

  // 현재 테마를 반대로 전환한다.
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 페이지 이동: 각 이동은 브라우저 방문 기록에 저장된다.
  const goList = () => navigate("/books");
  const goRegister = () => navigate("/books/new");
  const goDetail = (bookId) => navigate(`/books/${bookId}`);
  const goEdit = (bookId) => navigate(`/books/${bookId}/edit`);

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
        path="/books/:bookId/edit"
        element={<BookEditRoute {...commonPageProps} />}
      />

      <Route
        path="/books/:bookId"
        element={<BookReadDetailRoute {...commonPageProps} onGoEdit={goEdit} />}
      />

      {/* 정의되지 않은 주소는 홈으로 이동 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
