import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Auth({ isLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    const endpoint = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";
    
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        return;
      }
      
      if (isLogin) {
        localStorage.setItem("loggedUser", JSON.stringify(data.user));
        alert("Zalogowano!");
        navigate("/");
      } else {
        alert("Zarejestrowano!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Błąd podczas uwierzytelniania:", error);
      alert("Wystąpił błąd. Spróbuj ponownie później.");
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
