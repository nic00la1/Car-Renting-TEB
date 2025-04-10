import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCar.css";

const AddCar = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState([]);
  const [isRecommended, setIsRecommended] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tworzymy obiekt nowego samochodu
    const newCar = {
      name,
      location,
      pricePerDay,
      image,
      tags,
      isRecommended,
    };

    try {
      // Wysłanie danych na backend
      const response = await fetch("http://localhost:5000/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCar),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Samochód dodany pomyślnie!");
        navigate("/"); // Przekierowanie na stronę główną po udanym dodaniu
      } else {
        alert(data.message || "Wystąpił błąd przy dodawaniu samochodu.");
      }
    } catch (error) {
      console.error("Błąd podczas dodawania samochodu:", error);
      alert("Wystąpił błąd. Spróbuj ponownie później.");
    }
  };

  return (
    <div className="add-car-container">
      <h2>Dodaj Nowy Samochód</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nazwa samochodu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Lokalizacja"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cena za dzień"
          value={pricePerDay}
          onChange={(e) => setPricePerDay(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL obrazu"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tagi (oddzielone przecinkami)"
          value={tags.join(", ")}
          onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
        />
        <label>
          Polecane:
          <input
            type="checkbox"
            checked={isRecommended}
            onChange={() => setIsRecommended(!isRecommended)}
          />
        </label>
        <button type="submit">Dodaj Samochód</button>
      </form>
    </div>
  );
};

export default AddCar;
