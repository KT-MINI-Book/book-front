// 도서 목록 페이지
import { useEffect, useState } from "react";
import { BookLikeCount, BookList, BookSearch } from "../api/bookApi";
import { getBooksByGenre, getGenreErrorMessage } from "../api/genreApi";

import Header from "../components/Header";
import BookCard from "../components/bookCard/BookCard";
import GenreSelector from "../components/Form/Book/GenreSelector";
import MainButton from "../components/comButton/MainButton";
import "./BookListPage.css";

function BookListPage({ onGoList, onGoRegister, onGoDetail, isDarkMode, onToggleTheme }) {
  const [books, setBooks] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [listMessage, setListMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchBooks = async () => {
      const data = await BookList();

      if (!ignore) {
        setBooks(Array.isArray(data) ? data : []);
        setListMessage("");
      }
    };

    fetchBooks();

    return () => {
      ignore = true;
    };
  }, []);

  const handleSearch = async () => {
    const data = await BookSearch(keyword);
    setSelectedGenre(null);
    setBooks(Array.isArray(data) ? data : []);
    setListMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLike = async (bookId) => {
    const likedBook = await BookLikeCount(bookId);

    if (!likedBook) return;

    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId
          ? { ...book, likes: likedBook.likes ?? (book.likes || 0) + 1 }
          : book
      )
    );
  };

  const handleGenreSelect = async (genre) => {
    setSelectedGenre(genre);
    setKeyword("");

    if (!genre?.id) {
      const data = await BookList();
      setBooks(Array.isArray(data) ? data : []);
      setListMessage("");
      return;
    }

    try {
      const data = await getBooksByGenre(genre.id);
      setBooks(Array.isArray(data) ? data : []);
      setListMessage("");
    } catch (error) {
      console.error(error);
      setBooks([]);
      setListMessage(
        getGenreErrorMessage(error, "장르별 도서 목록을 불러오지 못했습니다.")
      );
    }
  };

  const handleGenreClear = () => {
    handleGenreSelect(null);
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
    if (sortType === "view") {
      return (b.views || 0) - (a.views || 0);
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
          <div className={`bookListPage-genre-filter ${selectedGenre ? "is-selected" : ""}`}>
            <GenreSelector
              selectedGenre={selectedGenre}
              onSelectGenre={handleGenreSelect}
              allowCustomGenre={false}
              modalTitle="조회할 장르 선택"
              modalDescription="보고 싶은 장르를 선택하면 해당 장르의 도서만 모아 보여드려요."
              className="bookListPage-genre-button"
            />
            {selectedGenre && (
              <button
                type="button"
                className="bookListPage-genre-clear"
                onClick={handleGenreClear}
                aria-label={`${selectedGenre.name} 장르 필터 해제`}
              >
                ×
              </button>
            )}
          </div>
        </section>

        <div className="bookListPage-sort">
          <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="title">제목순</option>
            <option value="view">조회수순</option>
          </select>
        </div>

        {/* 도서 리스트 영역 */}
        {books.length === 0 ? (
          <p className="bookListPage-empty">
            {listMessage ||
              (selectedGenre
                ? `${selectedGenre.name} 장르에 등록된 도서가 없습니다.`
                : "검색 결과가 없습니다.")}
          </p>
        ) : (
          <section className="bookListPage-grid">
            {sortedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={onGoDetail}
                onLike={handleLike}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export default BookListPage;
