import "./InputStyle.css";

function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  variant = "small",
  type = "text",
}) {
  return (
    <div className="input-box">
      {label && <label className="input-label">{label}</label>}

      {variant === "large" ? (
        <textarea
          className="input-field input-large"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="input-field input-small"
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

export default Input;
