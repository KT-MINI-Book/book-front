const BASE_URL = 'http://localhost:3000/books';

// 목록 조회: GET /books
export const BookList = async () => {
  try {
    const res = await fetch(BASE_URL);

    if (!res.ok) {
      throw new Error('목록 조회 실패');
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 상세 조회: GET /books/{id}
export const BookDetail = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      throw new Error('상세 조회 실패');
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 도서 등록: POST /books
export const BookCreate = async (book) => {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });

    if (!res.ok) {
      throw new Error('도서 등록 실패');
    }

    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

// 도서 수정: PATCH /books/{id}
export const BookUpdate = async (id, book) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    });

    if (!res.ok) {
      throw new Error('도서 수정 실패');
    }

    return await res.json();
  } catch (error) {
    console.error(error);
  }
};

// 도서 삭제: DELETE /books/{id}
export const BookDelete = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('도서 삭제 실패');
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// 도서 키워드 검색: GET /books?q={keyword}
// title, author, content를 대상으로 부분 일치 검색
export const BookSearch = async (keyword) => {
  try {
    if (!keyword || !keyword.trim()) {
      return await BookList();
    }

    const trimmedKeyword = encodeURIComponent(keyword.trim());

    const [titleRes, authorRes, contentRes] = await Promise.all([
      fetch(`${BASE_URL}?title_like=${trimmedKeyword}`),
      fetch(`${BASE_URL}?author_like=${trimmedKeyword}`),
      fetch(`${BASE_URL}?content_like=${trimmedKeyword}`),
    ]);

    if (!titleRes.ok || !authorRes.ok || !contentRes.ok) {
      throw new Error("도서 검색 실패");
    }

    const [titleBooks, authorBooks, contentBooks] = await Promise.all([
      titleRes.json(),
      authorRes.json(),
      contentRes.json(),
    ]);

    const mergedMap = new Map();
    [...titleBooks, ...authorBooks, ...contentBooks].forEach((book) => {
      mergedMap.set(book.id, book);
    });

    return Array.from(mergedMap.values());
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 조회수 증가: PATCH /books/{id}
export const BookViewCount = async (id, views) => {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        views: views + 1,
      }),
    });

    return await res.json();
  } catch (error) {
    console.error(error);
  }
};