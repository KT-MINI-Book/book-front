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
