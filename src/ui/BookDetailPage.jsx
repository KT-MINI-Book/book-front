import { useEffect, useState } from "react";
import { BookCreate, BookDetail, BookUpdate, BookDelete } from "../api/bookApi";

import Header from "../components/Header";
import BookForm from "../components/Form/Book/BookForm";
import ImageForm from "../components/Form/AiImage/ImageForm";
import "./BookDetailPage.css";

const INITIAL_BOOK_DATA = {
  title: "",
  author: "",
  content: "",
  coverImageUrl: "",
};

function BookDetailPage({ mode, bookId, onGoList, onGoRegister }) {
  const isCreate = mode === "create";

  const [bookData, setBookData] = useState(INITIAL_BOOK_DATA);
  const [pageLoading, setPageLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isCreate || !bookId) {
      setBookData(INITIAL_BOOK_DATA);
      return;
    }
    
    if (isCreate || !bookId) return;

    const fetchBook = async () => {
      const book = await BookDetail(bookId);

      if (!book) return;

    const fetchBookDetail = async () => {
      try {
        setPageLoading(true);
        setErrorMessage("");

        const data = await BookDetail(bookId);

        if (!data) {
          setErrorMessage("도서 정보를 불러오지 못했습니다.");
          return;
        }

        setBookData({
          title: data.title || "",
          author: data.author || "",
          content: data.content || "",
          coverImageUrl: data.coverImageUrl || "",
        });
      } catch (error) {
        console.error(error);
        setErrorMessage("도서 상세 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchBookDetail();
  }, [isCreate, bookId]);

  const handleSave = async () => {
    if (
      !bookData.title.trim() ||
      !bookData.author.trim() ||
      !bookData.content.trim()
    ) {
      alert("제목, 저자, 내용을 모두 입력해주세요.");
      return;
    }

    const now = new Date().toISOString();

    if (isCreate) {
      const createdBook = await BookCreate({
        ...bookData,
        createdAt: now,
        updatedAt: now,
      });

      if (!createdBook) {
        setErrorMessage("도서 등록에 실패했습니다.");
        return;
      }

      alert("도서가 등록되었습니다.");
      onGoList();
      return;
    }

    const updatedBook = await BookUpdate(bookId, {
      ...bookData,
      updatedAt: now,
    });

    if (!updatedBook) {
      setErrorMessage("도서 수정에 실패했습니다.");
      return;
    }

    alert("도서가 수정되었습니다.");
    onGoList();
  };

  const handleDelete = async () => {
    if (isCreate || !bookId) return;

    const confirmed = window.confirm("정말 이 도서를 삭제하시겠습니까?");
    if (!confirmed) return;

    const success = await BookDelete(bookId);

    if (!success) {
      setErrorMessage("도서 삭제에 실패했습니다.");
      return;
    }

    alert("도서가 삭제되었습니다.");
    onGoList();
  };

  return (
    <div className="bookDetailPage">
      <Header
        title="걷기가 서재"
        onGoList={onGoList}
        onGoCreate={onGoRegister}
      />

      <main className="bookDetailPage-main">
        {pageLoading && (
          <p className="bookDetailPage-message">
            도서 정보를 불러오는 중입니다.
          </p>
        )}

        {!pageLoading && (
          <>
            <section className="bookDetailPage-column">
              <BookForm
                isCreate={isCreate}
                bookId={bookId}
                bookData={bookData}
                setBookData={setBookData}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            </section>

            <section className="bookDetailPage-column">
              <ImageForm bookData={bookData} setBookData={setBookData} />
            </section>
          </>
        )}
      </main>

      {errorMessage && (
        <div className="bookDetailPage-modal-overlay">
          <div className="bookDetailPage-modal">
            <h2 className="bookDetailPage-modal-title">알림</h2>
            <p className="bookDetailPage-modal-message">{errorMessage}</p>
            <button
              type="button"
              className="bookDetailPage-modal-button"
              onClick={() => setErrorMessage("")}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetailPage;