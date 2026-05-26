import './MainButton.css';

function MainButton({ children, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="comButton-main"
    >
      {children}
    </button>
  );
}

export default MainButton;