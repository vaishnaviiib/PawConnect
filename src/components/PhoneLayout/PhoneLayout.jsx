import "./PhoneLayout.css";

function PhoneLayout({ children }) {
  return (
    <div className="phone-layout-screen">
      <div className="phone-layout-device">
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
