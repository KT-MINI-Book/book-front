import Input from "../../common/Input";
import MainButton from "../../comButton/MainButton";
import "./BookFormStyle.css";

function BookForm({
  isCreate,
  bookId,
  bookData,
  setBookData,
  onSave,
  onDelete,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !bookData.title.trim() ||
      !bookData.author.trim() ||
      !bookData.content.trim()
    ) {
      alert("책 제목, 저자, 내용을 모두 입력해주세요.");
      return;
    }

    onSave();
  };

  return (
    <div className="book-form">
      <h2 className="book-form-title">
        {isCreate ? "새 도서를 등록해주세요 !" : "도서를 수정해주세요 !"}
      </h2>

      {!isCreate && <p className="book-form-id">기존 도서 ID: {bookId}</p>}

      <form className="book-form-body" onSubmit={handleSubmit}>
        <Input
          label="책 제목:"
          name="title"
          value={bookData.title}
          onChange={handleChange}
          placeholder="여러분의 책 제목을 입력해주세요."
        />

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
            >
              도서 삭제
            </MainButton>
          )}

          <MainButton type="submit">
            {isCreate ? "도서 등록" : "도서 수정"}
          </MainButton>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
