import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Input from "../common/Input";
import MainButton from "../comButton/MainButton";
import SubButton from "../comButton/SubButton";
import {
  createFeedback,
  deleteFeedback,
  getFeedbackByReviewId,
  updateFeedback,
} from "../../api/feedbackApi";
import { ADMIN_DISPLAY_NAME, verifyAdminPassword } from "../../constants/admin";
import { formatDate } from "../../utils/reviewFormat";
import "./AdminComment.css";

/**
 * AdminComment — 리뷰 피드백(관리자 답변, 리뷰당 1개)
 *
 * @param {number} reviewId
 */
function AdminComment({ reviewId }) {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [actionMode, setActionMode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadFeedback = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const data = await getFeedbackByReviewId(reviewId);
        if (!ignore) {
          setFeedback(data);
        }
      } catch (error) {
        console.error(error);
        if (!ignore) {
          setLoadError(error.message || "피드백을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadFeedback();

    return () => {
      ignore = true;
    };
  }, [reviewId]);

  const handleClose = () => {
    setActionMode(null);
    setIsAuthenticated(false);
    setPassword("");
    setContent("");
    setErrorMessage("");
  };

  const handleOpenAction = (mode) => {
    setActionMode(mode);
    setIsAuthenticated(false);
    setPassword("");
    setContent("");
    setErrorMessage("");
  };

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

    if (actionMode === "edit" && feedback) {
      setContent(feedback.content);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!content.trim()) {
      setErrorMessage("답변 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (actionMode === "edit" && feedback) {
        const result = await updateFeedback(feedback.feedbackId, content.trim());
        setFeedback(result ?? { ...feedback, content: content.trim() });
      } else {
        const result = await createFeedback(reviewId, content.trim());
        setFeedback(result);
      }
      handleClose();
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.message ||
          (actionMode === "edit" ? "답변 수정에 실패했습니다." : "답변 등록에 실패했습니다."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!feedback) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await deleteFeedback(feedback.feedbackId);
      setFeedback(null);
      handleClose();
      toast.success("관리자 답변이 삭제되었습니다.", {
        position: window.innerWidth < 768 ? "bottom-center" : "top-right",
      });
    } catch (error) {
      console.error(error);
      const serverError = error.message || "답변 삭제에 실패했습니다.";
      setErrorMessage(serverError);
      toast.error(serverError, {
        position: window.innerWidth < 768 ? "bottom-center" : "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const authDescription =
    actionMode === "edit"
      ? "답변을 수정하려면 관리자 비밀번호를 입력해주세요."
      : actionMode === "delete"
        ? "답변을 삭제하려면 관리자 비밀번호를 입력해주세요."
        : "답변을 작성하려면 관리자 비밀번호를 입력해주세요.";

  if (loading) {
    return <p className="adminComment adminComment--loading">피드백 확인 중...</p>;
  }

  if (loadError) {
    return <p className="validation-error adminComment-message">{loadError}</p>;
  }

  if (feedback && !actionMode) {
    return (
      <div className="adminComment adminComment--display">
        <div className="adminComment-header">
          <span className="adminComment-label">{ADMIN_DISPLAY_NAME} 답변</span>
          <time className="adminComment-date" dateTime={feedback.createdAt}>
            {formatDate(feedback.createdAt)}
          </time>
        </div>
        <p className="adminComment-content">{feedback.content}</p>
        <div className="adminComment-displayActions">
          <SubButton
            type="button"
            className="adminComment-editBtn"
            onClick={() => handleOpenAction("edit")}
          >
            수정
          </SubButton>
          <SubButton
            type="button"
            className="adminComment-deleteBtn"
            onClick={() => handleOpenAction("delete")}
          >
            삭제
          </SubButton>
        </div>
      </div>
    );
  }

  if (!feedback && !actionMode) {
    return (
      <div className="adminComment adminComment--form">
        <div className="adminComment-toggleWrap">
          <SubButton type="button" onClick={() => handleOpenAction("create")}>
            관리자 답변 작성
          </SubButton>
        </div>
      </div>
    );
  }

  return (
    <div className="adminComment adminComment--form">
      {!isAuthenticated ? (
        <form className="adminComment-form" onSubmit={handleAuth}>
          <p className="adminComment-formTitle">관리자 인증</p>
          <p className="adminComment-formDesc">{authDescription}</p>

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
      ) : actionMode === "delete" ? (
        <div className="adminComment-form">
          <p className="adminComment-formTitle">답변 삭제</p>
          <p className="adminComment-formDesc">
            이 관리자 답변을 삭제하시겠습니까? 삭제 후에는 다시 작성할 수 있습니다.
          </p>

          {errorMessage && (
            <p className="validation-error adminComment-message">{errorMessage}</p>
          )}

          <div className="adminComment-actions">
            <SubButton type="button" onClick={handleClose} disabled={isSubmitting}>
              취소
            </SubButton>
            <MainButton type="button" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? "삭제 중..." : "삭제 확인"}
            </MainButton>
          </div>
        </div>
      ) : (
        <form className="adminComment-form" onSubmit={handleSubmit}>
          <p className="adminComment-formTitle">
            {actionMode === "edit"
              ? `${ADMIN_DISPLAY_NAME} 답변 수정`
              : `${ADMIN_DISPLAY_NAME} 답변 작성`}
          </p>

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
            <SubButton type="button" onClick={handleClose} disabled={isSubmitting}>
              취소
            </SubButton>
            <MainButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? actionMode === "edit"
                  ? "수정 중..."
                  : "등록 중..."
                : actionMode === "edit"
                  ? "답변 수정"
                  : "답변 등록"}
            </MainButton>
          </div>
        </form>
      )}
    </div>
  );
}

export default AdminComment;
