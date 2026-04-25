import "./SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../lib/pawApi";

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      if (formData.role === "foster") {
        throw new Error("This demo flow currently supports adopter and shelter accounts.");
      }

      const payload = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      });

      // registerUser() persists the user (API or local fallback) in pawApi.

      if (payload.error) {
        setStatus({
          type: "error",
          message: `${payload.message} ${payload.error}`.trim(),
        });
      } else {
        setStatus({
          type: "success",
          message: payload.message || "Account created successfully.",
        });
      }

      navigate(formData.role === "shelter" ? "/shelter-dashboard" : "/application-form");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Could not create your account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="signup-screen">
      <section className="signup-container" aria-labelledby="signup-title">
        <div className="status-bar" aria-hidden="true">
          <span>9:41</span>
          <span>LTE 100%</span>
        </div>

        <div className="flower-left" aria-hidden="true">x</div>
        <div className="cloud-right" aria-hidden="true">o</div>

        <h1 className="app-title">PawConnect</h1>
        <h2 className="signup-title" id="signup-title">
          Create your account
        </h2>
        <p className="signup-subtitle">
          Find loving dogs, foster opportunities, and shelters near you.
        </p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full name"
            aria-label="Full name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            aria-label="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            aria-label="Phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            aria-label="Account type"
            required
          >
            <option value="" disabled>I want to...</option>
            <option value="adopter">Adopt a dog</option>
            <option value="foster">Foster a dog</option>
            <option value="shelter">Manage a shelter</option>
          </select>

          <button className="continue-btn" type="submit">
            {isSubmitting ? "Connecting..." : "Continue"}
          </button>
        </form>

        {status.message ? <p className="terms-text">{status.message}</p> : null}

        <p className="terms-text">
          By continuing, you agree to PawConnect&apos;s <span>Terms</span> and{" "}
          <span>Privacy Policy</span>.
        </p>

        <div className="pet-illustration" aria-hidden="true">
          <div className="pet-ear pet-ear-left" />
          <div className="pet-ear pet-ear-right" />
          <div className="pet-face">
            <span className="pet-eye" />
            <span className="pet-eye" />
            <span className="pet-nose" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUp;
