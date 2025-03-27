import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find(u => u.username === username);

    if (exists) {
      alert("Użytkownik już istnieje!");
    } else {
      const newUser = { id: Date.now(), username, password, reservations: [] };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      alert("Zarejestrowano pomyślnie!");
      navigate("/login");
    }
  };

  return (
    <div className="auth-container">
      <h2>Rejestracja</h2>
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
      <button onClick={handleRegister}>Zarejestruj się</button>
    </div>
  );
}
