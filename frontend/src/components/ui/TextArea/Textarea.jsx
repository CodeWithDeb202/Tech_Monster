import "./Textarea.css";

function Textarea({
  label,
  name,
  value,
  placeholder,
  onChange,
  rows = 5,
  error,
  ...props
}) {
  return (
    <div className="textarea-group">

      {label && (
        <label className="textarea-label" htmlFor={name}>
          {label}
          <span className={value.trim() ? "labelSpanGreen" : "labelSpanRed"}>*</span>
        </label>
      )}

      <textarea
        id={name}
        className={`textarea ${error ? "inputError" : ""}`}
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
        {...props}
      />

      {error && (
        <small className="errorText">
          {error}
        </small>
      )}

    </div>
  );
}

export default Textarea;