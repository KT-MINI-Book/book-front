import { useState } from "react";
import Input from "../common/Input";
import MainButton from "../comButton/MainButton";
import "./ReviewForm.css";

const INITIAL_FORM = {
  author: "",
  rating: 0,
  content: "",
};

/**
 * ReviewForm — 리뷰 작성 폼
 *
 * [입력 필드]
 * - author: 작성자 닉네임 (다른 사용자 시뮬레이션)
 * - rating: 별점 1~5
 * - content: 리뷰 본문
 *
 * @param {{ onSubmit: (formData: { author: string, rating: number, content: string }) => void }} props
 */
function ReviewForm({ onSubmit }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errorMessage, setErrorMessage] = useState("");

  /** 텍스트 필드 변경 핸들러 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  /** 별점 선택 핸들러 */
  const handleRatingSelect = (rating) => {
    setForm((prev) => ({ ...prev, rating }));
    setErrorMessage("");
  };

  /** 폼 유효성 검사 */
  const validate = () => {
    if (!form.author.trim()) {
      return "닉네임을 입력해주세요.";
    }
    if (form.rating < 1 || form.rating > 5) {
      return "별점을 선택해주세요.";
    }
    if (!form.content.trim()) {
      return "리뷰 내용을 입력해주세요.";
    }
    return "";
  };

  /** 리뷰 등록 제출 */
  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setErrorMessage(error);
      return;
    }

    onSubmit({
      author: form.author.trim(),
      rating: form.rating,
      content: form.content.trim(),
    });

    setForm(INITIAL_FORM);
    setErrorMessage("");
  };

  return (
    <form className="reviewForm" onSubmit={handleSubmit}>
      <h3 className="reviewForm-title">리뷰 작성</h3>

      <Input
        label="닉네임:"
        name="author"
        value={form.author}
        onChange={handleChange}
        placeholder="닉네임을 입력해주세요."
      />

      {/* --- 별점 선택 (1~5) --- */}
      <div className="reviewForm-rating">
        <p className="reviewForm-ratingLabel">별점:</p>
        <div className="reviewForm-stars" role="radiogroup" aria-label="별점 선택">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`reviewForm-star${star <= form.rating ? " reviewForm-star--active" : ""}`}
              onClick={() => handleRatingSelect(star)}
              aria-label={`${star}점`}
              aria-checked={form.rating === star}
            >
              {star <= form.rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="리뷰 내용:"
        name="content"
        value={form.content}
        onChange={handleChange}
        placeholder="이 도서에 대한 리뷰를 작성해주세요."
        variant="large"
      />

      {errorMessage && (
        <p className="validation-error reviewForm-message">{errorMessage}</p>
      )}

      <div className="reviewForm-actions">
        <MainButton type="submit">리뷰 등록</MainButton>
      </div>
    </form>
  );
}

export default ReviewForm;
