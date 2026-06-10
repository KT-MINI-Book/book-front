/**
 * mockReviews — 리뷰 목 데이터 (서버 연동 전)
 *
 * [데이터 구조]
 * - id: 리뷰 고유 ID
 * - bookId: 연결된 도서 ID
 * - author: 작성자 닉네임 (다른 사용자 시뮬레이션)
 * - rating: 별점 1~5
 * - content: 리뷰 본문
 * - createdAt: 작성일 (ISO 8601)
 * - adminComment: 관리자 댓글 (null 또는 { content, createdAt } — 리뷰당 1개)
 */
export const MOCK_REVIEWS = [
  {
    id: "rev-001",
    bookId: 1,
    author: "독서마니아",
    rating: 4,
    content:
      "추리 소설 입문으로 읽기 좋았어요. 홈즈와 왓son의 케미가 재미있고, 짧은 편들이라 부담 없이 읽을 수 있었습니다.",
    createdAt: "2026-06-08T14:30:00",
    adminComment: null,
  },
];
