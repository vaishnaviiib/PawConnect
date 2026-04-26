import "./InputField.css";

// Wraps a label and input so forms can share a consistent field pattern.
function InputField({
  label = "Label",
  placeholder = "Enter text",
  type = "text",
}) {
  return (
    <label className="input-field">
      <span>{label}</span>
      <input type={type} placeholder={placeholder} />
    </label>
  );
}

export default InputField;
