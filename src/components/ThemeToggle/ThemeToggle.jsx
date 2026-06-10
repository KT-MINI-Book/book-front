import "./ThemeToggleStyle.css";

function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <button 
      className={`theme-toggle ${isDarkMode ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
      onClick={onToggle}
      title={isDarkMode ? "라이트 모드" : "다크 모드"}
      aria-label={isDarkMode ? "라이트 모드" : "다크 모드"}
    >
      <span className="theme-toggle-slider"></span>
      <span className="theme-toggle-label">
        {isDarkMode ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}

export default ThemeToggle;
