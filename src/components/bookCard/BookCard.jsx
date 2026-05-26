import BookImage from "./BookImage";
import "./BookCardStyle.css";

function BookCard({ book, onClick }) {
  return (
    <article className="book-card" onClick={() => onClick?.(book.id)}>
      <BookImage src={book.coverImageUrl} alt={book.title} />

      <div className="book-card-content">
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-desc">{book.content}</p>
      </div>
    </article>
  );
}

export default BookCard;
