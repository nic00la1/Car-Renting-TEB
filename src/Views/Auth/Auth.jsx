import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

export default function Auth({ isLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(""); // To store error messages

  const handleAuth = async () => {
    setLoading(true); // Set loading state to true when the request starts
    const endpoint = isLogin ? "http://localhost:5000/login" : "http://localhost:5000/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Wystąpił błąd. Spróbuj ponownie.");
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
      setError("Wystąpił błąd. Spróbuj ponownie później.");
    } finally {
      setLoading(false); // Set loading to false when the request finishes
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
      <button
        className="auth-btn"
        onClick={handleAuth}
        disabled={loading} // Disable button while loading
      >
        {loading ? "Proszę czekać..." : isLogin ? "Zaloguj się" : "Zarejestruj się"}
      </button>
      {error && <p className="error-message">{error}</p>}
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
