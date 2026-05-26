import React from 'react';

function BookForm({ isCreate, bookId, bookData, setBookData, onSave, onDelete }) {
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookData.title.trim() || !bookData.author.trim() || !bookData.content.trim()) {
      alert('책 제목, 저자, 내용을 모두 입력해 주세요!');
      return;
    }
    onSave();
  };

  return (
    <div className="form-box">
      <h2 className="form-title">
        {isCreate ? "새 도서를 등록해주세요 !" : "도서 정보를 수정해주세요 !"}
      </h2>
      {!isCreate && <p className="book-id-text">기존 도서 ID: {bookId}</p>}

      <form onSubmit={handleSubmit} className="input-group">
        <div className="input-field">
          <label>책 제목</label>
          <input 
            type="text" 
            name="title"
            value={bookData.title}
            onChange={handleChange}
            placeholder="책의 제목을 입력해주세요." 
            required 
          />
        </div>

        <div className="input-field">
          <label>저자</label>
          <input 
            type="text" 
            name="author"
            value={bookData.author}
            onChange={handleChange}
            placeholder="책의 저자를 입력해주세요." 
            required 
          />
        </div>

        <div className="input-field">
          <label>내용</label>
          <textarea 
            name="content"
            value={bookData.content}
            onChange={handleChange}
            placeholder="책의 내용을 입력해주세요." 
            rows="6" 
            required 
          />
        </div>

        <div className="button-area">
          {!isCreate && (
            <button type="button" className="sub-btn delete" onClick={onDelete}>
              도서 삭제
            </button>
          )}
          <button type="submit" className="submit-btn">
            {isCreate ? "도서 등록" : "도서 수정"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;