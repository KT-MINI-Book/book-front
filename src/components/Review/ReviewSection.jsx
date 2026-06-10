import { useEffect, useState } from "react";
import {
  addAdminComment,
  createReview,
  getReviewsByBookId,
} from "../../api/reviewApi";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import "./ReviewSection.css";

/**
 * ReviewSection — 도서 상세 하단 리뷰 영역
 *
 * [기능 범위]
 * - ReviewForm: 리뷰 작성 (localStorage 저장)
 * - ReviewCard + AdminComment: 리뷰 목록 + 관리자 댓글 (비밀번호 인증)
 *
 * @param {number|string} bookId - 리뷰를 조회·등록할 대상 도서 ID
 */
function ReviewSection({ bookId }) {
  const [reviews, setReviews] = useState([]);

  /** bookId 변경 시 해당 도서 리뷰 목록 불러오기 */
  useEffect(() => {
    setReviews(getReviewsByBookId(bookId));
  }, [bookId]);

  /** 리뷰 작성 완료 → 저장 후 목록 갱신 */
  const handleCreateReview = (formData) => {
    createReview(bookId, formData);
    setReviews(getReviewsByBookId(bookId));
  };

  /** 관리자 댓글 등록 → 저장 후 목록 갱신 */
  const handleAdminCommentSubmit = (reviewId, content) => {
    const result = addAdminComment(reviewId, content);

    if (result.success) {
      setReviews(getReviewsByBookId(bookId));
    }

    return result;
  };

  const reviewCount = reviews.length;

  return (
    <section className="reviewSection" aria-labelledby="review-section-title">
      {/* --- 리뷰 섹션 헤더: 제목 + 개수 배지 --- */}
      <div className="reviewSection-header">
        <h2 id="review-section-title" className="reviewSection-title">
          리뷰
        </h2>
        <span className="badge reviewSection-count">{reviewCount}</span>
      </div>

      <div className="reviewSection-body">
        {/* --- 리뷰 작성 폼 --- */}
        <ReviewForm onSubmit={handleCreateReview} />

        {/* --- 리뷰 목록 --- */}
        {reviewCount > 0 ? (
          <ul className="reviewSection-list">
            {reviews.map((review) => (
              <li key={review.id} className="reviewSection-listItem">
                <ReviewCard
                  review={review}
                  onAdminCommentSubmit={handleAdminCommentSubmit}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="reviewSection-empty">아직 등록된 리뷰가 없습니다.</p>
        )}
      </div>
    </section>
  );
}

export default ReviewSection;
