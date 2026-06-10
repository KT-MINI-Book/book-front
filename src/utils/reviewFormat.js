/** ISO 날짜를 화면 표시용으로 포맷 */
export const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** rating 숫자를 ★/☆ 문자열로 변환 */
export const formatRating = (rating) => {
  const filled = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return filled + empty;
};
