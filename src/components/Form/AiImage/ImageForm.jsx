import React, { useState } from 'react';

function ImageForm({ mode, bookData, setBookData }) {
  const [apiKey, setApiKey] = useState('');
  const [quality, setQuality] = useState('Middle'); // 기본값 Middle
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGenerateImage = async () => {
    if (!apiKey.trim()) {
      setErrorMsg('유효하지 않은 API Key입니다!');
      return;
    }

    if (!bookData.title.trim() || !bookData.content.trim()) {
      alert('좌측 폼에 책 제목과 내용을 먼저 입력해야 AI 프롬프트를 만들 수 있습니다!');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setBookData((prev) => ({
        ...prev,
        coverImageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500', // 임시 이미지
      }));

    } catch (error) {
      setErrorMsg('이미지 생성에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-box">
      <h2 className="form-title">AI 이미지 자동 생성</h2>
      
      <div className="input-group">
        <div className="input-field">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="OpenAI API Key를 입력해주세요."
          />
          {errorMsg && <p className="error-text">{errorMsg}</p>}
        </div>

        <div className="quality-selector">
          <label className="radio-label">
            <input
              type="radio"
              name="quality"
              value="High"
              checked={quality === 'High'}
              onChange={(e) => setQuality(e.target.value)}
            />
            <span className="dot high"></span> High
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="quality"
              value="Middle"
              checked={quality === 'Middle'}
              onChange={(e) => setQuality(e.target.value)}
            />
            <span className="dot middle"></span> Middle
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="quality"
              value="Low"
              checked={quality === 'Low'}
              onChange={(e) => setQuality(e.target.value)}
            />
            <span className="dot low"></span> Low
          </label>
        </div>

        <div className="image-preview-container">
          {isLoading ? (
            <div className="loading-box">
              <div className="spinner"></div>
              <p>AI가 도서 표지를 열심히 생성하는 중입니다...</p>
            </div>
          ) : bookData.coverImageUrl ? (
            <img src={bookData.coverImageUrl} alt="AI Generated Cover" className="generated-img" />
          ) : (
            <div className="placeholder-box">
              <p>책 제목과 책 내용을 기반으로 생성됩니다 !</p>
            </div>
          )}
        </div>

        <div className="image-footer">
          <span className="notice-text">미 생성 시 기본 이미지로 대체됩니다!</span>
          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={isLoading}
            className="generate-btn"
          >
            이미지 생성
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageForm;