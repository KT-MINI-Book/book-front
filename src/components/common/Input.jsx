import "./InputStyle.css";

function Input({
  id,
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
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
        </label>
      )}

      {variant === "large" ? (
        <textarea
          id={id}
          className="input-field input-large"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
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
