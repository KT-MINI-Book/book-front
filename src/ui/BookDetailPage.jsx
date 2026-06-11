import { useEffect, useState } from "react";
import { BookCreate, BookDetail, BookUpdate, BookDelete, BookViewCount } from "../api/bookApi";
import { toast } from "react-hot-toast";

import Header from "../components/Header";
import BookForm from "../components/Form/Book/BookForm";
import ImageForm from "../components/Form/AiImage/ImageForm";
import "./BookDetailPage.css";

const INITIAL_BOOK_DATA = {
  title: "",
  author: "",
  content: "",
  coverImageUrl: "",
  views: 0
};

function BookDetailPage({ mode, bookId, onGoList, onGoRegister, isDarkMode, onToggleTheme }) {
  const isCreate = mode === "create";

  const [bookData, setBookData] = useState(INITIAL_BOOK_DATA);
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (isCreate || !bookId) {
      return;
    }

    let ignore = false;

    const fetchBookDetail = async () => {
      try {
        setPageLoading(true);

        const data = await BookDetail(bookId);

        if (ignore) return;

        if (!data) {
          toast.error("도서 정보를 불러오지 못했습니다.", { id: "book-detail-empty" });
          return;
        }

        setBookData({
          title: data.title || "",
          author: data.author || "",
          content: data.content || "",
          coverImageUrl: data.coverImageUrl || "",
          views: data.views || 0,
        });
      } catch (error) {
        if (ignore) return;

        console.error(error);
        toast.error("도서 상세 정보를 불러오는 중 오류가 발생했습니다.", {
          id: "book-detail-fetch-error"
        });
      } finally {
        if (!ignore) {
          setPageLoading(false);
        }
      }
    };

    fetchBookDetail();

    return () => {
      ignore = true;
    };
  }, [isCreate, bookId]);

  const handleSave = async () => {
    if (
      !bookData.title.trim() ||
      !bookData.author.trim() ||
      !bookData.content.trim()
    ) {
      toast.error("제목, 저자, 내용을 모두 입력해주세요.");
      return;
    }
    try {
      if (isCreate) {
        const createdBook = await BookCreate({
          title: bookData.title,
          author: bookData.author,
          content: bookData.content,
          coverImageUrl: bookData.coverImageUrl,
          views: 0
        });

      if (!createdBook) {
        toast.error("도서 등록에 실패했습니다.");
        return;
      }

      toast.success("도서가 성공적으로 등록되었습니다.")
      onGoList();
      return;
      }
    
    const updatedBook = await BookUpdate(bookId, {
      title: bookData.title,
      author: bookData.author,
      content: bookData.content,
      coverImageUrl: bookData.coverImageUrl
    });

    if (!updatedBook) {
      toast.error("도서 수정에 실패했습니다.");
      return;
    }

    toast.success("도서 정보가 수정되었습니다.");
    onGoList();
    } catch (error) {
      console.error(error);
      toast.error("서버 통신 중 오류가 발생했습니다.")
    }
  };

  const handleDelete = async () => {
    if (isCreate || !bookId) return;

    toast((t) => (
      <div 
        className="custom-confirm-toast"
        style={{
          backgroundColor: isDarkMode ? "#1F2937" : "#ffffff",
          color: isDarkMode ? "#F3F4F6" : "#1F2937",
          padding: "8px",
          borderRadius: "8px"
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: "15px" }}>
          이 도서를 정말 삭제할까요?
        </p>
        <p style={{ fontSize: "12px", color: "#888", margin: "0 0 14px 0" }}>
          삭제된 데이터는 복구할 수 없습니다.
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: "6px 12px",
              backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
              color: isDarkMode ? "#F3F4F6" : "#1F2937",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px"
            }}
          >
            취소
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              await executeDelete();
            }}
            style={{
              padding: "6px 12px",
              backgroundColor: "#E53E3E",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "bold"
            }}
          >
            삭제하기
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "top-center",
      style: {
        background: "transparent",
        boxShadow: "none",
        padding: 0
      }
    });
  };

    const executeDelete = async () => {
      try{
        const success = await BookDelete(bookId);

        if (!success) {
          toast.error("도서 삭제에 실패했습니다.");
          return;
        }

        toast.success("도서가 삭제되었습니다.");
        onGoList();
      } catch (error) {
        console.error(error);
        toast.error("삭제 중 서버 오류가 발생했습니다.")
      }
    };

  return (
    <div className="bookDetailPage">
      <Header
        title="걷기가 서재"
        onGoList={onGoList}
        onGoCreate={onGoRegister}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      />

      <main className="bookDetailPage-main">
        {pageLoading && (
          <p className="bookDetailPage-message">
            도서 정보를 불러오는 중입니다.
          </p>
        )}

        {!pageLoading && (
          <>
            <section className="bookDetailPage-column">
              <BookForm
                isCreate={isCreate}
                bookId={bookId}
                bookData={bookData}
                setBookData={setBookData}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            </section>

            <section className="bookDetailPage-column">
              <ImageForm bookData={bookData} setBookData={setBookData} />
            </section>
          </>
        )}
      </main>


      
    </div>
  );
}

export default BookDetailPage;
