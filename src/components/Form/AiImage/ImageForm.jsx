import { useState } from "react";
import Input from "../../common/Input";
import RadioButton from "../../comButton/RadioButton";
import MainButton from "../../comButton/MainButton";
import BookImage from "../../bookCard/BookImage";
import "./ImageFormStyle.css";

const resizeImageDataUrl = (dataUrl, targetWidth = 200, targetHeight = 230) => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("이미지 리사이즈에 실패했습니다."));
        return;
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.72);
      resolve(resizedDataUrl);
    };

    img.onerror = () => {
      reject(new Error("이미지를 불러오지 못했습니다."));
    };

    img.src = dataUrl;
  });
};

function ImageForm({ bookData, setBookData }) {
  const [apiKey, setApiKey] = useState("");
  const [selectedQuality, setSelectedQuality] = useState("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const hasApiKey = apiKey.trim().length > 0;

  const validateApiKey = (key) => {
    const trimmedKey = key.trim();

    if (!trimmedKey) return "API Key를 입력해주세요.";
    if (!trimmedKey.startsWith("sk-"))
      return "API Key 형식이 올바르지 않습니다.";
    if (trimmedKey.length < 20) return "API Key가 너무 짧습니다.";

    return "";
  };

  const handleGenerateImage = async () => {
    const apiKeyError = validateApiKey(apiKey);

    if (apiKeyError) {
      setErrorMsg(apiKeyError);
      return;
    }

    if (!bookData.title.trim() || !bookData.content.trim()) {
      alert("책 제목과 책 내용을 먼저 입력해주세요.");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg("");

      const prompt = `
책 제목: ${bookData.title}
저자: ${bookData.author}

책 내용:
${bookData.content}

위 내용을 바탕으로 상업용 도서 표지 이미지를 생성해줘.
책 표지처럼 세련되고, 제목 분위기가 잘 드러나게 만들어줘.
작은 글자나 읽기 어려운 텍스트는 넣지 말아줘.
`;

      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
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
        },
      );

      const data = await response.json();

      console.log("OpenAI image response:", data);

      if (!response.ok) {
        throw new Error(data.error?.message || "이미지 생성 실패");
      }

      const imageBase64 = data.data[0].b64_json;
      const originalDataUrl = `data:image/png;base64,${imageBase64}`;
      const resizedDataUrl = await resizeImageDataUrl(
        originalDataUrl,
        200,
        230,
      );

      const uploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dyi23dc8x/image/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: resizedDataUrl,
            upload_preset: "cover_upload",
          }),
        },
      );

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadData.error?.message || "이미지 업로드 실패");
      }

      setBookData((prev) => ({
        ...prev,
        coverImageUrl: uploadData.secure_url,
      }));
    } catch (error) {
      console.error("이미지 생성 에러:", error);
      setErrorMsg(error.message || "이미지 생성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="image-form">
      <h2 className="image-form-title">AI 이미지 자동 생성</h2>

      <div className="image-form-body">
        <Input
          label="API Key:"
          type="password"
          name="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="API Key를 입력해주세요."
        />

        <div className="image-form-message-row">
          {errorMsg ? (
            <p className="validation-error image-form-message">{errorMsg}</p>
          ) : hasApiKey ? (
            <p className="validation-success image-form-message">
              API Key 형식이 확인되었습니다.
            </p>
          ) : (
            <p className="image-form-message image-form-message-empty">
              API Key 입력 후 이미지를 생성할 수 있습니다.
            </p>
          )}
        </div>

        <div className="image-form-quality-row">
          <p className="image-form-label">이미지 품질:</p>
          <RadioButton
            selectedQuality={selectedQuality}
            onChange={setSelectedQuality}
          />
        </div>

        <div className="image-form-field">
          <p className="image-form-label">이미지 미리보기:</p>

          <div className="image-form-preview-box">
            {isLoading ? (
              <div className="image-form-loading">
                <div className="image-form-spinner" />
                <p>AI가 도서 표지를 생성하는 중입니다...</p>
              </div>
            ) : bookData.coverImageUrl ? (
              <div className="image-form-book-image">
                <BookImage
                  src={bookData.coverImageUrl}
                  alt="AI 생성 도서 표지"
                />
              </div>
            ) : (
              <div className="image-form-placeholder">
                <p>여러분의 책 제목과 책 내용을 기반으로 생성됩니다 !</p>
              </div>
            )}
          </div>
        </div>

        <div className="image-form-footer">
          <span className="image-form-notice">
            미 생성 시 기본 이미지로 대체됩니다!
          </span>

          <MainButton
            type="button"
            onClick={handleGenerateImage}
            disabled={isLoading}
          >
            {isLoading ? "생성 중..." : "이미지 생성"}
          </MainButton>
        </div>
      </div>
    </div>
  );
}

export default ImageForm;
