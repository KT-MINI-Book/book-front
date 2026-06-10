import { useState } from "react";
import Input from "../common/Input";
import MainButton from "../comButton/MainButton";
import SubButton from "../comButton/SubButton";
import { ADMIN_DISPLAY_NAME, verifyAdminPassword } from "../../constants/admin";
import { formatDate } from "../../utils/reviewFormat";
import "./AdminComment.css";

/**
 * AdminComment — 관리자 댓글 (리뷰당 1개, 비밀번호 인증 후 작성)
 *
 * [화면 상태]
 * - adminComment 있음 → 답변 표시
 * - 답변 없음 → ① 토글 ② 비밀번호 인증 ③ 답변 작성 (순차 진행)
 *
 * @param {string} reviewId
 * @param {{ content: string, createdAt: string } | null} adminComment
 * @param {(reviewId: string, content: string) => { success: boolean, message?: string }} onSubmit
 */
function AdminComment({ reviewId, adminComment, onSubmit }) {
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /** 폼 초기화 및 닫기 */
  const handleClose = () => {
    setIsOpen(false);
    setIsAuthenticated(false);
    setPassword("");
    setContent("");
    setErrorMessage("");
  };

  /** 1단계: 관리자 비밀번호 인증 */
  const handleAuth = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!password.trim()) {
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    if (!verifyAdminPassword(password)) {
      setErrorMessage("관리자 비밀번호가 올바르지 않습니다.");
      return;
    }

    setIsAuthenticated(true);
    setPassword("");
    setErrorMessage("");
  };

  /** 2단계: 답변 등록 (비밀번호 통과 후에만 접근) */
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!content.trim()) {
      setErrorMessage("답변 내용을 입력해주세요.");
      return;
    }

    const result = onSubmit(reviewId, content.trim());

    if (!result.success) {
      setErrorMessage(result.message || "답변 등록에 실패했습니다.");
      return;
    }

    handleClose();
  };

  /* --- 이미 답변이 있는 경우: 읽기 전용 --- */
  if (adminComment) {
    return (
      <div className="adminComment adminComment--display">
        <div className="adminComment-header">
          <span className="adminComment-label">{ADMIN_DISPLAY_NAME} 답변</span>
          <time className="adminComment-date" dateTime={adminComment.createdAt}>
            {formatDate(adminComment.createdAt)}
          </time>
        </div>
        <p className="adminComment-content">{adminComment.content}</p>
      </div>
    );
  }

  /* --- 답변 없음: 비밀번호 인증 → 답변 작성 (순차) --- */
  return (
    <div className="adminComment adminComment--form">
      {!isOpen ? (
        <div className="adminComment-toggleWrap">
          <SubButton onClick={() => setIsOpen(true)}>관리자 답변 작성</SubButton>
        </div>
      ) : !isAuthenticated ? (
        <form className="adminComment-form" onSubmit={handleAuth}>
          <p className="adminComment-formTitle">관리자 인증</p>
          <p className="adminComment-formDesc">
            답변을 작성하려면 관리자 비밀번호를 입력해주세요.
          </p>

          <Input
            label="관리자 비밀번호:"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            placeholder="비밀번호를 입력해주세요."
          />

          {errorMessage && (
            <p className="validation-error adminComment-message">{errorMessage}</p>
          )}

          <div className="adminComment-actions">
            <SubButton type="button" onClick={handleClose}>
              취소
            </SubButton>
            <MainButton type="submit">확인</MainButton>
          </div>
        </form>
      ) : (
        <form className="adminComment-form" onSubmit={handleSubmit}>
          <p className="adminComment-formTitle">{ADMIN_DISPLAY_NAME} 답변 작성</p>

          <Input
            label="답변 내용:"
            name="content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setErrorMessage("");
            }}
            placeholder="리뷰에 대한 관리자 답변을 입력해주세요."
            variant="large"
          />

          {errorMessage && (
            <p className="validation-error adminComment-message">{errorMessage}</p>
          )}

          <div className="adminComment-actions">
            <SubButton type="button" onClick={handleClose}>
              취소
            </SubButton>
            <MainButton type="submit">답변 등록</MainButton>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminComment;
