import "./Button.css";

function Button({ children = "Button", type = "button" }) {
  return (
    <button className="button" type={type}>
      {children}
    </button>
  );
}

export default Button;
