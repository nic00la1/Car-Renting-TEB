import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">AutoRent</Link>
      </div>

      <div className="navbar-right">
        {loggedUser ? (
          <div
            className="user-dropdown"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <span className="username">Witaj, {loggedUser.username} ▼</span>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/my-reservations">Moje rezerwacje</Link>
                <Link to="/my-account">Moje konto</Link>
                <button onClick={handleLogout}>Wyloguj się</button>
              </div>
            )}
          </div>
        ) : (
          <div className="nav-links">
          </div>
        )}
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className="bar" />
        <div className="bar" />
        <div className="bar" />
      </div>

      <div className={`nav-links mobile ${menuOpen ? "open" : ""}`}>
        <Link to="/">Home</Link>
        {!loggedUser && <Link to="/login">Logowanie</Link>}
      </div>
    </nav>
  );
}
