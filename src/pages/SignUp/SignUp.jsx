import "./SignUp.css";

function SignUp() {
  return (
    <main className="signup-screen">
      <section className="signup-container" aria-labelledby="signup-title">
        <div className="status-bar" aria-hidden="true">
          <span>9:41</span>
          <span>LTE 100%</span>
        </div>

        <div className="flower-left" aria-hidden="true">
          ✿
        </div>
        <div className="cloud-right" aria-hidden="true">
          ☁
        </div>

        <h1 className="app-title">PawConnect</h1>
        <h2 className="signup-title" id="signup-title">
          Create your account
        </h2>
        <p className="signup-subtitle">
          Find loving dogs, foster opportunities, and shelters near you.
        </p>

        <form className="signup-form">
          <input type="text" placeholder="Full name" aria-label="Full name" />
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <input type="password" placeholder="Password" aria-label="Password" />
          <select defaultValue="" aria-label="Account type">
            <option value="" disabled>
              I want to...
            </option>
            <option value="adopt">Adopt a dog</option>
            <option value="foster">Foster a dog</option>
            <option value="shelter">Manage a shelter</option>
          </select>
          <button className="continue-btn" type="submit">
            Continue
          </button>
        </form>

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
