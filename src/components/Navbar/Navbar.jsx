import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">AutoRent</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {loggedUser && <Link to="/my-reservations">Moje rezerwacje</Link>}
        {!loggedUser && <Link to="/login">Logowanie</Link>}
        {!loggedUser && <Link to="/register">Rejestracja</Link>}
        {loggedUser && (
          <button className="logout-btn" onClick={handleLogout}>Wyloguj się</button>
        )}
      </div>
    </nav>
  );
}
