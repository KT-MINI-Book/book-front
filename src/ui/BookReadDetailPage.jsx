import { useEffect, useState } from "react";
import { BookDetail, BookViewCount } from "../api/bookApi";

import Header from "../components/Header";
import ReviewSection from "../components/Review/ReviewSection"; // 리뷰·관리자 댓글 영역
import defaultBookImage from "../assets/default.png";
import "./BookReadDetailPage.css";

function BookReadDetailPage({
  bookId,
  onGoList,
  onGoRegister,
  onGoEdit,
  isDarkMode,
  onToggleTheme,
}) {
  const [book, setBook] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!bookId) {
      return;
    }

    let ignore = false;

    const fetchBookDetail = async () => {
      try {
        setPageLoading(true);
        setErrorMessage("");

        const data = await BookDetail(bookId);

        if (ignore) return;

        if (!data) {
          setErrorMessage("도서 정보를 불러오지 못했습니다.");
          return;
        }

        const viewedBook = await BookViewCount(bookId);

        if (ignore) return;

        setBook({
          ...data,
          views: viewedBook?.views ?? (data.views || 0) + 1,
        });
      } catch (error) {
        if (ignore) return;

        console.error(error);
        setErrorMessage("도서 상세 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        if (!ignore) {
          setPageLoading(false);
        }
      }
    };

    fetchBookDetail();

    return () => {
      ignore = true;
    };
  }, [bookId]);

  const displayedErrorMessage = bookId
    ? errorMessage
    : "조회할 도서를 찾을 수 없습니다.";

  return (
    <div className="bookReadDetailPage">
      <Header
        title="걷기가 서재"
        onGoList={onGoList}
        onGoCreate={onGoRegister}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <main className="bookReadDetailPage-main">
        {pageLoading && (
          <p className="bookReadDetailPage-message">
            도서 정보를 불러오는 중입니다.
          </p>
        )}

        {!pageLoading && displayedErrorMessage && (
          <p className="bookReadDetailPage-message bookReadDetailPage-message--error">
            {displayedErrorMessage}
          </p>
        )}

        {!pageLoading && !displayedErrorMessage && book && (
          <article className="bookReadDetailPage-article">
            {/* 도서 정보(2열) + 리뷰 섹션(전체 너비)을 묶는 article */}
            {/* --- 도서 상세: 표지 + 메타 정보 (기존 2열 그리드) --- */}
            <div className="bookReadDetailPage-content">
              <section className="bookReadDetailPage-coverArea">
                <img
                  className="bookReadDetailPage-cover"
                  src={book.coverImageUrl || defaultBookImage}
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.src = defaultBookImage;
                  }}
                />
              </section>

              <section className="bookReadDetailPage-info">
                <h2 className="bookReadDetailPage-title">{book.title}</h2>

                <dl className="bookReadDetailPage-meta">
                  <div className="bookReadDetailPage-metaItem">
                    <dt>저자</dt>
                    <dd>{book.author}</dd>
                  </div>
                  <div className="bookReadDetailPage-metaItem">
                    <dt>조회수</dt>
                    <dd>{book.views || 0}</dd>
                  </div>
                </dl>

                <div className="bookReadDetailPage-description">
                  <h3>도서 내용</h3>
                  <p>{book.content}</p>
                </div>

                <div className="bookReadDetailPage-actions">
                  <button
                    type="button"
                    className="bookReadDetailPage-button bookReadDetailPage-button--secondary"
                    onClick={onGoList}
                  >
                    목록으로
                  </button>
                  <button
                    type="button"
                    className="bookReadDetailPage-button"
                    onClick={() => onGoEdit?.(bookId)}
                  >
                    수정하기
                  </button>
                </div>
              </section>
            </div>

            {/* --- 리뷰 영역: 작성 폼 + 목록 + 관리자 댓글 (1단계 골격) --- */}
            <ReviewSection bookId={bookId} />
          </article>
        )}
      </main>
    </div>
  );
}

export default BookReadDetailPage;
