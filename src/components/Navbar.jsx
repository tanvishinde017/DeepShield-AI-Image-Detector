import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navStyle = {
    position: "sticky",
    top: 0,
    backdropFilter: "blur(10px)",
    background: "rgba(15, 23, 42, 0.7)",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    zIndex: 1000
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const linkStyle = {
    textDecoration: "none",
    color: "#e2e8f0",
    fontWeight: 500,
    transition: "all 0.3s ease"
  };

  const activeStyle = {
    color: "#6366f1",
    borderBottom: "2px solid #6366f1",
    paddingBottom: "4px"
  };

  const mobileMenuStyle = {
    display: menuOpen ? "flex" : "none",
    flexDirection: "column",
    gap: "15px",
    marginTop: "15px"
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <h2 style={{ color: "#6366f1", letterSpacing: "1px" }}>
          DeepShield
        </h2>

        {/* Desktop Links */}
        <div className="desktop-menu" style={{ display: "flex", gap: "25px" }}>
          <NavLink to="/" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            Home
          </NavLink>
          <NavLink to="/features" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            Features
          </NavLink>
          <NavLink to="/how-it-works" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            How It Works
          </NavLink>
          <NavLink to="/faq" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            FAQ
          </NavLink>
          <NavLink to="/analyze-image" style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}>
            Analyze
          </NavLink>
        </div>

        {/* Mobile Hamburger */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none",
            cursor: "pointer",
            fontSize: "22px",
            color: "#fff"
          }}
          className="mobile-toggle"
        >
          ☰
        </div>
      </div>

      {/* Mobile Menu */}
      <div style={mobileMenuStyle} className="mobile-menu">
        <NavLink to="/" onClick={() => setMenuOpen(false)} style={linkStyle}>Home</NavLink>
        <NavLink to="/features" onClick={() => setMenuOpen(false)} style={linkStyle}>Features</NavLink>
        <NavLink to="/how-it-works" onClick={() => setMenuOpen(false)} style={linkStyle}>How It Works</NavLink>
        <NavLink to="/faq" onClick={() => setMenuOpen(false)} style={linkStyle}>FAQ</NavLink>
        <NavLink to="/analyze-image" onClick={() => setMenuOpen(false)} style={linkStyle}>Analyze</NavLink>
      </div>
    </nav>
  );
}
