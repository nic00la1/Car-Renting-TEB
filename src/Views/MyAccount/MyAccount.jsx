import React, { useState, useEffect } from "react";
import "./MyAccount.css";

function MyAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        if (!loggedUser || !loggedUser.username) {
          throw new Error("Brak danych użytkownika w localStorage");
        }

        const userId = loggedUser.username;
        const response = await fetch(`http://localhost:5000/user/${userId}`);
        if (!response.ok) {
          throw new Error("Nie udało się pobrać danych użytkownika");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    
    const response = await fetch("http://localhost:5000/update-password", {
      method: "POST",
      body: JSON.stringify({ username: loggedUser.username, password: newPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (response.ok) {
      loggedUser.password = newPassword; // Zaktualizuj w localStorage
      localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
      alert("Hasło zostało zmienione!");
    } else {
      alert("Nie udało się zmienić hasła");
    }
  };

  // Funkcja do obsługi zmiany avatara
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const avatarUrl = reader.result;
        setNewAvatar(avatarUrl); // Ustawia avatar w stanie komponentu

        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        
        const response = await fetch("http://localhost:5000/update-avatar", {
          method: "POST",
          body: JSON.stringify({ username: loggedUser.username, avatar: avatarUrl }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          loggedUser.avatar = avatarUrl;  // Zaktualizuj avatar w localStorage
          localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

          // Zaktualizuj dane użytkownika w stanie, aby od razu pokazać nowy avatar
          setUser({ ...user, avatar: avatarUrl });

          alert("Avatar został zaktualizowany!");
        } else {
          alert("Nie udało się zaktualizować avatara");
        }
      };
      reader.readAsDataURL(file); // Konwertuje plik na Base64
    }
  };

  if (loading) {
    return <p>Ładowanie...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Proszę się zalogować...</p>;
  }

  return (
    <div className="my-account">
      <h2>Moje Konto</h2>

      <div className="user-info">
        <p><strong>Imię użytkownika:</strong> {user.username}</p>
        {user.avatar && <img src={user.avatar} alt="Avatar" className="avatar" />}
        {!user.avatar && <div className="avatar-placeholder">Brak avatara</div>}
      </div>

      <div className="form-section">
        <h3>Zmiana hasła</h3>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Nowe hasło"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button type="submit">Zmień hasło</button>
        </form>
      </div>

      <div className="form-section">
        <h3>Zmiana avatara</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
        />
        {newAvatar && (
          <div>
            <img src={newAvatar} alt="Nowy avatar" className="avatar-preview" />
          </div>
        )}
      </div>

      <div className="reservations">
        <h3>Rezerwacje:</h3>
        <ul>
          {user.reservations && user.reservations.length > 0 ? (
            user.reservations.map((res, index) => (
              <li key={index}>
                {res.carName} - {res.location} - {res.date}
              </li>
            ))
          ) : (
            <p>Brak rezerwacji</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MyAccount;
