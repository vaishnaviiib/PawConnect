import "./Button.css";

// Provides a small reusable button wrapper with the project's base styling.
function Button({ children = "Button", type = "button" }) {
  return (
    <button className="button" type={type}>
      {children}
    </button>
  );
}

export default Button;
