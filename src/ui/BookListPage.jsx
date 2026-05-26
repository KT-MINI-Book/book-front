// 도서 목록 페이지
import { useEffect, useState } from "react";
import { BookList } from "../api/bookApi";

import Header from "../components/Header";
import BookCard from "../components/bookCard/BookCard";
import "./BookListPage.css";

function BookListPage({ onGoList, onGoRegister, onGoDetail }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const data = await BookList();
      setBooks(data);
    };

    fetchBooks();
  }, []);
  
  return (
    <div className="bookListPage">
      <Header
        title="걷기가 서재"
        onGoList={onGoList}
        onGoCreate={onGoRegister}
      />

      <main className="bookListPage-main">
        <section className="bookListPage-grid">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onClick={onGoDetail} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default BookListPage;