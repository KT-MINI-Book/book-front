import Input from "../../common/Input";
import MainButton from "../../comButton/MainButton";
import GenreSelector from "./GenreSelector";
import "./BookFormStyle.css";

function BookForm({
  isCreate,
  bookId,
  bookData,
  setBookData,
  onSave,
  onDelete,
  isSaving = false,
  genreFeedback = null,
  onClearGenreFeedback,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenreSelect = (genre) => {
    const genreName = typeof genre === "string" ? genre : genre?.name || "";
    const genreId = typeof genre === "string" ? null : genre?.id ?? null;
    const isNewGenre = typeof genre === "string" ? false : Boolean(genre?.isNew);

    setBookData((prev) => ({
      ...prev,
      genre: genreName,
      genreId,
      isNewGenre,
    }));

    onClearGenreFeedback?.();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="book-form">
      <h2 className="book-form-title">
        {isCreate ? "새 도서를 등록해주세요 !" : "도서를 수정해주세요 !"}
      </h2>

      {!isCreate && <p className="book-form-id">기존 도서 ID: {bookId}</p>}

      <form className="book-form-body" onSubmit={handleSubmit}>
        <div className="book-form-title-field">
          <label className="book-form-title-label" htmlFor="book-title">
            제목:
          </label>

          <div className="book-form-title-row">
            <Input
              id="book-title"
              name="title"
              value={bookData.title}
              onChange={handleChange}
              placeholder="여러분의 책 제목을 입력해주세요."
            />
            <GenreSelector
              selectedGenre={
                bookData.genre
                  ? {
                      id: bookData.genreId ?? null,
                      name: bookData.genre,
                      isNew: Boolean(bookData.isNewGenre),
                    }
                  : null
              }
              onSelectGenre={handleGenreSelect}
            />
          </div>
        </div>

        {genreFeedback?.message && (
          <div
            className={`book-form-genre-feedback ${genreFeedback.type || "info"}`}
            role={genreFeedback.type === "error" ? "alert" : "status"}
          >
            <strong>{genreFeedback.title}</strong>
            <p>{genreFeedback.message}</p>
          </div>
        )}

        <Input
          label="저자:"
          name="author"
          value={bookData.author}
          onChange={handleChange}
          placeholder="여러분의 저자를 입력해주세요."
        />

        <Input
          label="내용:"
          name="content"
          variant="large"
          value={bookData.content}
          onChange={handleChange}
          placeholder="여러분의 책 내용을 입력해주세요."
        />

        <div className="book-form-actions">
          {!isCreate && (
            <MainButton
              type="button"
              onClick={onDelete}
              variant="delete-button"
              disabled={isSaving}
            >
              도서 삭제
            </MainButton>
          )}

          <MainButton type="submit" disabled={isSaving}>
            {isSaving ? "저장 중" : isCreate ? "도서 등록" : "도서 수정"}
          </MainButton>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
