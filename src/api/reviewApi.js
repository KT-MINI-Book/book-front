/**
 * reviewApi — 리뷰 CRUD (서버 연동 전 localStorage + mock 시드)
 *
 * [저장 방식]
 * - MOCK_REVIEWS: 초기 시드 데이터 (mockReviews.js)
 * - book-reviews: 사용자가 작성한 리뷰
 * - book-review-admin-comments: 시드 리뷰 등에 달린 관리자 댓글 override
 *
 * [향후]
 * - fetch 기반 REST API로 함수 시그니처만 유지하며 교체
 */
import { MOCK_REVIEWS } from "../data/mockReviews";

const STORAGE_KEY = "book-reviews";
const ADMIN_COMMENTS_KEY = "book-review-admin-comments";

/** localStorage에서 사용자 작성 리뷰 불러오기 */
const loadStoredReviews = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

/** localStorage에 사용자 작성 리뷰 저장 */
const saveStoredReviews = (reviews) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

/** 시드 리뷰 관리자 댓글 override 불러오기 */
const loadAdminCommentOverrides = () => {
  try {
    const stored = localStorage.getItem(ADMIN_COMMENTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

/** 시드 리뷰 관리자 댓글 override 저장 */
const saveAdminCommentOverrides = (overrides) => {
  localStorage.setItem(ADMIN_COMMENTS_KEY, JSON.stringify(overrides));
};

/** adminComment override를 반영한 리뷰 1건 */
const applyAdminCommentOverride = (review, overrides) => {
  if (Object.prototype.hasOwnProperty.call(overrides, review.id)) {
    return { ...review, adminComment: overrides[review.id] };
  }
  return review;
};

/** 시드 + localStorage 리뷰를 합친 전체 목록 */
const getAllReviews = () => {
  const stored = loadStoredReviews();
  const overrides = loadAdminCommentOverrides();
  const seedIds = new Set(MOCK_REVIEWS.map((review) => review.id));
  const userReviews = stored.filter((review) => !seedIds.has(review.id));

  return [...MOCK_REVIEWS, ...userReviews].map((review) =>
    applyAdminCommentOverride(review, overrides),
  );
};

/**
 * bookId에 해당하는 리뷰 목록 조회 (최신순)
 * @param {number|string} bookId
 */
export const getReviewsByBookId = (bookId) => {
  return getAllReviews()
    .filter((review) => String(review.bookId) === String(bookId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * 리뷰 등록
 * @param {number|string} bookId
 * @param {{ author: string, rating: number, content: string }} reviewInput
 */
export const createReview = (bookId, reviewInput) => {
  const review = {
    id: `rev-${Date.now()}`,
    bookId: Number(bookId) || bookId,
    author: reviewInput.author.trim(),
    rating: reviewInput.rating,
    content: reviewInput.content.trim(),
    createdAt: new Date().toISOString(),
    adminComment: null,
  };

  const stored = loadStoredReviews();
  stored.push(review);
  saveStoredReviews(stored);

  return review;
};

/**
 * 관리자 댓글 등록 (리뷰당 1개)
 * @param {string} reviewId
 * @param {string} content
 * @returns {{ success: boolean, message?: string }}
 */
export const addAdminComment = (reviewId, content) => {
  const review = getAllReviews().find((item) => item.id === reviewId);

  if (!review) {
    return { success: false, message: "리뷰를 찾을 수 없습니다." };
  }

  if (review.adminComment) {
    return { success: false, message: "이미 관리자 답변이 등록된 리뷰입니다." };
  }

  const adminComment = {
    content,
    createdAt: new Date().toISOString(),
  };

  const stored = loadStoredReviews();
  const storedIndex = stored.findIndex((item) => item.id === reviewId);

  /* 사용자 작성 리뷰 → book-reviews에 직접 저장 */
  if (storedIndex >= 0) {
    stored[storedIndex].adminComment = adminComment;
    saveStoredReviews(stored);
    return { success: true };
  }

  /* 시드 리뷰 → override 키에 저장 */
  const overrides = loadAdminCommentOverrides();
  overrides[reviewId] = adminComment;
  saveAdminCommentOverrides(overrides);

  return { success: true };
};
