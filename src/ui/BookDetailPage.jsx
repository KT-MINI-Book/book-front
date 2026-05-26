import { useEffect, useState } from "react";
import {
  BookDetail,
  BookCreate,
  BookDelete,
  BookUpdate,
} from "../api/bookApi";

import Header from "../components/Header";
import Input from "../components/common/Input";
import RadioButton from "../components/RadioButton";
import MainButton from "../components/comButton/MainButton";
import BookImage from "../components/bookCard/BookImage";
import "./BookDetailPage.css";

function BookDetailPage({ mode, bookId, onGoList, onGoRegister }) {
  const isCreate = mode === "create";

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("medium");

  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isCreate) {
      setTitle("");
      setAuthor("");
      setContent("");
      setCoverImage("");
      setApiKey("");
      setApiKeyError("");
      setError("");
      setSelectedQuality("medium");
      return;
    }
    
    if (isCreate || !bookId) return;

    const fetchBook = async () => {
      const book = await BookDetail(bookId);

      if (!book) return;

      setTitle(book.title || "");
      setAuthor(book.author || "");
      setContent(book.content || "");
      setCoverImage(book.coverImageUrl || "");
    };

    fetchBook();
  }, [isCreate, bookId]);

  const handleSubmit = async () => {
    if (!title.trim() || !author.trim() || !content.trim()) {
      alert("제목, 저자, 내용을 모두 입력해주세요.");
      return;
    }

    const now = new Date().toISOString();

    if (isCreate) {
      await BookCreate({
        title,
        author,
        content,
        coverImageUrl: coverImage,
        createdAt: now,
        updatedAt: now,
      });

      alert("등록 완료");
    } else {
      await BookUpdate(bookId, {
        title,
        author,
        content,
        coverImageUrl: coverImage,
        updatedAt: now,
      });

      alert("수정 완료");
    }

    onGoList();
  };

  const handleDelete = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (!ok) return;

    await BookDelete(bookId);
    alert("삭제 완료");
    onGoList();
  };

  const handleGenerateImage = async () => {
    if (!title.trim() || !content.trim()) {
      alert("도서 제목과 도서 내용을 입력해주세요.");
      return;
    }

    if (!apiKey.trim()) {
      setApiKeyError("API Key를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setApiKeyError("");
      setCoverImage("");

      const prompt = `
책 제목: ${title}
저자: ${author}

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
          quality: selectedQuality,
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

  return (
    <div className="bookDetailPage">
      <Header
        title="걷기가 서재"
        onGoList={onGoList}
        onGoCreate={onGoRegister}
      />

      <main className="bookDetailPage-main">
        <section className="bookDetailPage-column">
          <h2 className="bookDetailPage-heading">
            {isCreate ? "새 도서를 등록해주세요 !" : "도서를 수정해주세요 !"}
          </h2>

          <Input
            label="책 제목:"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="여러분의 책 제목을 입력해주세요."
          />

          <Input
            label="저자:"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="여러분의 이름을 입력해주세요."
          />

          <Input
            label="내용:"
            name="content"
            variant="large"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="여러분의 책 내용을 입력해주세요."
          />

          <div className="bookDetailPage-actions">
            <MainButton type="button" onClick={handleSubmit}>
              {isCreate ? "도서 등록" : "도서 수정"}
            </MainButton>

            {!isCreate && (
              <MainButton type="button" onClick={handleDelete}>
                도서 삭제
              </MainButton>
            )}
          </div>
        </section>

        <section className="bookDetailPage-column">
          <h2 className="bookDetailPage-heading">AI 이미지 자동 생성</h2>

          <Input
            label="API Key:"
            name="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="API Key를 입력해주세요."
          />

          {apiKeyError && (
            <p className="validation-error bookDetailPage-apiError">
              {apiKeyError}
            </p>
          )}

          <RadioButton
            selectedQuality={selectedQuality}
            onChange={setSelectedQuality}
          />

          <div className="bookDetailPage-preview">
            {coverImage ? (
              <BookImage src={coverImage} alt="표지 미리보기" />
            ) : (
              <p className="bookDetailPage-preview-text">
                여러분의 책 제목과 책 내용을 기반으로 생성됩니다 !
              </p>
            )}
          </div>

          {loading && <p>AI 표지를 생성하고 있습니다...</p>}
          {error && <p className="validation-error">{error}</p>}

          <p className="bookDetailPage-preview-hint">
            미 생성 시 기본 이미지로 대체됩니다!
          </p>

          <div className="bookDetailPage-actions">
            <MainButton
              type="button"
              onClick={handleGenerateImage}
              disabled={loading}
            >
              {loading ? "생성 중..." : "이미지 생성"}
            </MainButton>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BookDetailPage;