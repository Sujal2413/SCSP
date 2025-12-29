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
      {/* LOGO */}
      <div className="navbar-logo">
        <Link to="/">SCSP</Link>
      </div>

      {/* NAV LINKS */}
      <div className="navbar-links">
        <Link to="/" className="nav-link">
          Home
        </Link>

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
            <Link to="/register" className="nav-btn secondary">
              Register
            </Link>

            <Link to="/login" className="nav-btn primary">
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;