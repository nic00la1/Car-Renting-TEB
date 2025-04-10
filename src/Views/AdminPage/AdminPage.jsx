import React, { useState } from "react";
import axios from "axios";

function AdminPage() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddCar = async () => {
    try {
      const newCar = {
        name,
        location,
        pricePerDay,
        tags: tags.split(","),
        image,
        isRecommended,
      };

      const response = await axios.post(
        "http://localhost:5000/add-car",
        newCar
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage("Wystąpił błąd podczas dodawania samochodu.");
    }
  };

  return (
    <div>
      <h2>Dodaj samochód</h2>
      <input
        type="text"
        placeholder="Nazwa"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Lokalizacja"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="number"
        placeholder="Cena za dzień"
        value={pricePerDay}
        onChange={(e) => setPricePerDay(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tagi (oddziel przecinkami)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        type="text"
        placeholder="Link do zdjęcia"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <label>
        Polecane:
        <input
          type="checkbox"
          checked={isRecommended}
          onChange={() => setIsRecommended(!isRecommended)}
        />
      </label>
      <button onClick={handleAddCar}>Dodaj samochód</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AdminPage;
