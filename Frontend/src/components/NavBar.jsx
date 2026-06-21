import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./Navbar.css";


const Navbar = () => {
  const { isAuthed, me, logout } = useContext(AuthContext);

  const getInitials = (email) => {
    return email ? email.charAt(0).toUpperCase() : "?";
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* LOGO */}
        <div className="navbar-logo">
          <Link to="/">SCSP</Link>
        </div>

        {/* CENTER NAV LINKS */}
        <div className="navbar-center">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/schemes" className="nav-link">Schemes</Link>
          <Link to="/study-abroad" className="nav-link">Study Abroad</Link>
        </div>

        {/* NAV ACTIONS */}
        <div className="navbar-links">
        {isAuthed ? (
          <>
            {/* User Email with Letter Icon */}
            <div className="user-email-display">
              <div className="email-icon">
                {getInitials(me?.email)}
              </div>
              <span className="email-text">{me?.email}</span>
            </div>

            {/* Logout Button */}
            <button onClick={logout} className="nav-btn secondary">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn secondary">
              Login
            </Link>

            <Link to="/register" className="nav-btn primary">
              Register
            </Link>
          </>
        )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;