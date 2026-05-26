import "./InputStyle.css";

function Input({
  label,
  variant = "small",
  name,
  value,
  onChange,
  placeholder,
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
