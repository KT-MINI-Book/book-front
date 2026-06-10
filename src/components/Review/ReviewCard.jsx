import { formatDate, formatRating } from "../../utils/reviewFormat";
import AdminComment from "./AdminComment";
import "./ReviewCard.css";

/**
 * ReviewCard — 리뷰 1건 표시 + 관리자 댓글
 *
 * @param {object} review
 * @param {(reviewId: string, content: string) => { success: boolean, message?: string }} onAdminCommentSubmit
 */
function ReviewCard({ review, onAdminCommentSubmit }) {
  const { id, author, rating, content, createdAt, adminComment } = review;

  return (
    <article className="reviewCard">
      {/* --- 리뷰 헤더: 작성자 · 별점 · 작성일 --- */}
      <div className="reviewCard-header">
        <span className="reviewCard-author">{author}</span>
        <span className="reviewCard-rating" aria-label={`별점 ${rating}점`}>
          {formatRating(rating)}
        </span>
        <time className="reviewCard-date" dateTime={createdAt}>
          {formatDate(createdAt)}
        </time>
      </div>

      {/* --- 리뷰 본문 --- */}
      <p className="reviewCard-content">{content}</p>

      {/* --- 관리자 댓글 (비밀번호 1234 인증 후 1회 작성) --- */}
      <AdminComment
        reviewId={id}
        adminComment={adminComment}
        onSubmit={onAdminCommentSubmit}
      />
    </article>
  );
}

export default ReviewCard;
