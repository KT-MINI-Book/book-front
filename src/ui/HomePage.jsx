import Header from "../components/Header";
import MainButton from "../components/comButton/MainButton";
import "./HomePage.css";

// 홈 페이지 — 서비스 소개 및 목록·등록 진입
function HomePage({ onGoList, onGoRegister }) {
  return (
    <div className="homePage">
      <Header isMain />

      <main className="homePage-main">
        <h1 className="homePage-title">
          도서 관리 시스템에 오신 것을 환영합니다
        </h1>
        <p className="homePage-desc">
          이 시스템을 사용하여 도서를 등록하고 관리할 수 있습니다
        </p>

        <div className="homePage-actions">
          <MainButton onClick={onGoList}>도서 목록 보기</MainButton>
          <MainButton onClick={onGoRegister}>도서 등록 하기</MainButton>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
