import Header from "../components/Header";
import BookCard from "../components/bookCard/BookCard";
import "./BookListPage.css";

// 도서 목록 페이지 — 팀 BookCard 연결 (추후 fetch로 sampleBooks 교체)
function BookListPage({ onGoList, onGoRegister, onGoDetail }) {
  const sampleBooks = [
    {
      id: 1,
      title: "제목어쩌구",
      content:
        "프론트엔드에서 도서 목록을 조회하고, 카드로 출력하며, 상세 페이지로 이동을 실습하기 위한 예제 데이터입니다.",
      coverImageUrl: "",
    },
    {
      id: 2,
      title: "제목어쩌구",
      content:
        "와 React Router를 활용하여 여러 페이지로 구성된 도서 관리 애플리케이션을 구현하는 예제입니다.",
      coverImageUrl: "",
    },
    {
      id: 3,
      title: "제목어쩌구",
      content:
        "에이블스쿨 기의 수강생이 이전의 과정에서 실습자료를 혼합한 상록수의 내용을 표지에 담고 있어요.",
      coverImageUrl: "",
    },
    {
      id: 4,
      title: "셜록홈즈",
      content:
        "괴짜 탐정 셜록 홈즈와 왓슨 박사가 런던의 사건들을 논리적 추리로 해결하는 추리 소설입니다.",
      coverImageUrl: "",
    },
  ];

  return (
    <div className="bookListPage">
      <Header
        title="걷기가 서재"
        onGoList={onGoList}
        onGoCreate={onGoRegister}
      />

      <main className="bookListPage-main">
        <section className="bookListPage-grid">
          {sampleBooks.map((book) => (
            <BookCard key={book.id} book={book} onClick={onGoDetail} />
          ))}
        </section>
      </main>
    </div>
  );
}

export default BookListPage;
