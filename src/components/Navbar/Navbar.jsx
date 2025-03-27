import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo">AutoRent</Link>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </div>

      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        {loggedUser && (
          <>
            <Link to="/my-reservations" onClick={() => setMenuOpen(false)}>Moje rezerwacje</Link>
            <span className="user-info">
              👤 {loggedUser.username}
            </span>
            <button className="logout-btn" onClick={handleLogout}>Wyloguj się</button>
          </>
        )}
        {!loggedUser && (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Logowanie</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Rejestracja</Link>
          </>
        )}
      </div>
    </nav>
  );
}
