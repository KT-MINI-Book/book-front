function Header({ isMain = false, onGoList, onGoCreate }) {
  return (
    <header className="header">
      <h1 className="header-title">걷기가 서재</h1>

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