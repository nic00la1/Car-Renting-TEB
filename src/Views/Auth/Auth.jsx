import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Auth({ isLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      const user = users.find(
        u => u.username === username && u.password === password
      );
      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        alert("Zalogowano!");
        navigate("/");
      } else {
        alert("Nieprawidłowe dane logowania!");
      }
    } else {
      const userExists = users.find(u => u.username === username);
      if (userExists) {
        alert("Użytkownik już istnieje!");
        return;
      }

      const newUser = { username, password, reservations: [] };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Zarejestrowano!");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Logowanie" : "Rejestracja"}</h2>
      <input
        type="text"
        placeholder="Nazwa użytkownika"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Hasło"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button className="auth-btn" onClick={handleAuth}>
        {isLogin ? "Zaloguj się" : "Zarejestruj się"}
      </button>
      {isLogin ? (
        <p>
          Nie masz konta? <Link to="/register">Zarejestruj się</Link>
        </p>
      ) : (
        <p>
          Masz już konto? <Link to="/login">Zaloguj się</Link>
        </p>
      )}
    </div>
  );
}
