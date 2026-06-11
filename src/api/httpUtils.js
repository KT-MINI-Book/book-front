/** 실패 응답에서 에러 메시지 추출 (빈 body·비JSON 대응) */
export const parseErrorMessage = async (res, fallback) => {
  try {
    const text = await res.text();
    if (!text) {
      return fallback;
    }

    try {
      const data = JSON.parse(text);
      return data.message || text;
    } catch {
      return text;
    }
  } catch {
    return fallback;
  }
};

/** 성공 응답 JSON 파싱 (빈 body면 null) */
export const parseJsonResponse = async (res) => {
  const text = await res.text();
  if (!text.trim()) {
    return null;
  }

  return JSON.parse(text);
};
