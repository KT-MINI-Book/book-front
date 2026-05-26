import { useState } from "react";

function BookDetailPage({ mode, bookId, onGoList }) {
  const isCreate = mode === "create";

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [quality, setQuality] = useState("medium");

  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateCover = async () => {
    if (!title || !content) {
      alert("도서 제목과 도서 내용을 입력해주세요.");
      return;
    }

    if (!apiKey) {
      alert("API Key를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setCoverImage("");

      const prompt = `
책 제목: ${title}

책 내용:
${content}

위 내용을 바탕으로 상업용 도서 표지 이미지를 생성해줘.
책 표지처럼 세련되고, 제목 분위기가 잘 드러나게 만들어줘.
`;

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt,
          size: "1024x1536",
          quality,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "이미지 생성 실패");
      }

      const imageBase64 = data.data[0].b64_json;
      setCoverImage(`data:image/png;base64,${imageBase64}`);
    } catch (err) {
      console.error(err);
      setError("표지 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async () => {
    if (!title || !author || !content) {
      alert("제목, 저자, 내용을 모두 입력해주세요.");
      return;
    }

    const now = new Date().toISOString();

    const newBook = {
      title,
      author,
      content,
      coverImageUrl: coverImage,
      createdAt: now,
      updatedAt: now,
    };

    await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBook),
    });

    alert("도서가 등록되었습니다.");
    onGoList();
  };

  return (
    <div>
      <header>
        <p>Logo</p>
        <nav>
          <button type="button" onClick={onGoList}>
            도서 목록
          </button>
          <span>도서 등록</span>
        </nav>
      </header>

      <main>
        <section>
          <h2>{isCreate ? "새로운 도서를 등록하세요" : "도서 상세"}</h2>

          {!isCreate && <p>bookId: {bookId}</p>}

          <label>
            도서 제목
            <input
              type="text"
              placeholder="제목"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label>
            저자
            <input
              type="text"
              placeholder="저자"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </label>

          <label>
            도서 내용
            <textarea
              placeholder="내용"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </label>

          <button type="button" disabled={isCreate}>
            삭제
          </button>
          <button type="button" disabled={isCreate}>
            수정하기
          </button>
          <button type="button" onClick={handleCreateBook}>
            등록하기
          </button>
        </section>

        <section>
          <h3>AI 표지 생성 영역</h3>

          <label>
            API Key
            <input
              type="password"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </label>

          <label>
            품질 선택
            <select value={quality} onChange={(e) => setQuality(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <button type="button" onClick={handleGenerateCover} disabled={loading}>
            {loading ? "생성 중..." : "생성"}
          </button>

          <p>이미지 미리보기</p>

          {coverImage && (
            <img
              src={coverImage}
              alt="AI 생성 도서 표지"
              style={{ width: "250px", borderRadius: "8px" }}
            />
          )}

          {loading && <p>AI 표지를 생성하고 있습니다...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </section>
      </main>
    </div>
  );
}

export default BookDetailPage;