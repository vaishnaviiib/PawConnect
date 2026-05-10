import "./PhoneLayout.css";

// Frames each page inside a fixed phone mockup used across the app.
function PhoneLayout({ children, className = "" }) {
  return (
    <div className="phone-layout-screen">
      <div className={`phone-layout-device ${className}`}>
        {/* Keeps the mobile shell consistent even when page content changes. */}
        <div className="phone-layout-status-bar">
          <span>9:41</span>
          <span>LTE 100%</span>
        </div>

        <div className="phone-layout-content">{children}</div>
      </div>
    </div>
  );
}

export default PhoneLayout;