import "./MainButton.css";

function MainButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "",
}) {
  const className = `comButton-main${variant ? ` ${variant}` : ""}`;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

export default MainButton;
