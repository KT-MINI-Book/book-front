// 도서 목록 페이지
import { useEffect, useState } from "react";
import { BookList, BookSearch } from "../api/bookApi";

import Header from "../components/Header";
import BookCard from "../components/bookCard/BookCard";
import MainButton from "../components/comButton/MainButton";
import "./BookListPage.css";

function BookListPage({ onGoList, onGoRegister, onGoDetail, isDarkMode, onToggleTheme }) {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("latest");

  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      const data = await BookList();

      if (!ignore) {
        setBooks(data);
      }
    };

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = async () => {
    const data = await BookSearch(keyword);
    setBooks(data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (sortType === "latest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortType === "oldest") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }

    if (sortType === "title") {
      return a.title.localeCompare(b.title);
    }

    return 0;
  });
  
  return (
    <div className="bookListPage">
      <Header
        title="걷기가 서재"
        onGoList={onGoList}
        onGoCreate={onGoRegister}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <main className="bookListPage-main">
        {/* 검색 영역 */}
        <section className="bookListPage-search">
          <input
            type="text"
            className="bookListPage-search-input"
            placeholder="도서 제목, 저자, 내용으로 검색하세요"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="bookListPage-search-button">
            <MainButton onClick={handleSearch}>검색</MainButton>
          </div>
        </section>

        <div className="bookListPage-sort">
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="title">제목순</option>
          </select>
        </div>

        {/* 도서 리스트 영역 */}
        {books.length === 0 ? (
          <p className="bookListPage-empty">검색 결과가 없습니다.</p>
        ) : (
          <section className="bookListPage-grid">
            {sortedBooks.map((book) => (
              <BookCard key={book.id} book={book} onClick={onGoDetail} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default BookListPage;
