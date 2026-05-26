function RadioButton({ selectedQuality, onChange }) {
  const qualityOptions = [
    { label: "High", value: "high" },
    { label: "Middle", value: "medium" },
    { label: "Low", value: "low" },
  ];

  return (
    <div className="radio-group">
      {qualityOptions.map((option) => (
        <label key={option.value} className="radio-label">
          <input
            type="radio"
            name="quality"
            value={option.value}
            checked={selectedQuality === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="radio-input"
          />
          <span className="radio-text">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export default RadioButton;