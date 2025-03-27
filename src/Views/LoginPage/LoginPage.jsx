import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
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
  };

  return (
    <div className="auth-container">
      <h2>Logowanie</h2>
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
      <button onClick={handleLogin}>Zaloguj się</button>
    </div>
  );
}
