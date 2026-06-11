import './SubButton.css';

function SubButton({ children, onClick, type = 'button', disabled = false, className = '' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className ? `comButton-sub ${className}` : 'comButton-sub'}
    >
      {children}
    </button>
  );
}

export default SubButton;