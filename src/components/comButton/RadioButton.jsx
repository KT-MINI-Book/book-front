import "./RadioButtonStyle.css";

function RadioButton({ selectedQuality, onChange }) {
  const qualityOptions = [
    { label: "High", value: "high" },
    { label: "Middle", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <div className="quality-radio">
      {qualityOptions.map((option) => (
        <label key={option.value} className="quality-radio-label">
          <input
            type="radio"
            name="quality"
            value={option.value}
            checked={selectedQuality === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="quality-radio-input"
          />
          <span className="quality-radio-custom" aria-hidden="true" />
          <span className="quality-radio-text">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default RadioButton;
