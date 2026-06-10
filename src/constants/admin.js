/** 관리자 표시 이름 */
export const ADMIN_DISPLAY_NAME = "관리자";

/** 관리자 댓글 작성용 고정 비밀번호 (프론트 단 검증) */
export const ADMIN_PASSWORD = "1234";

/**
 * 관리자 비밀번호 확인
 * @param {string} password
 */
export const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};
