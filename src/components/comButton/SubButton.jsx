import './SubButton.css';

function SubButton({ children, onClick, type = 'button', disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="comButton-sub"
    >
      {children}
    </button>
  );
}

export default SubButton;