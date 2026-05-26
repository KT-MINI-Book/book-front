import "./Header.css";

function Header({
  isMain = false,
  title = "5반 13조 도서 관리 시스템",
  onGoList,
  onGoCreate,
}) {
  const headerClass = isMain ? "header header--main" : "header";

  return (
    <header className={headerClass}>
      <h1 className="header-title">{title}</h1>

      {!isMain && (
        <nav className="header-nav">
          <button className="header-button" onClick={onGoList}>
            도서 목록
          </button>

          <button
            className="header-button header-button-primary"
            onClick={onGoCreate}
          >
            새 도서 등록
          </button>
        </nav>
      )}
    </header>
  );
}

export default Header;