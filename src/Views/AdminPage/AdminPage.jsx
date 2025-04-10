import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPage() {
  const [cars, setCars] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [message, setMessage] = useState("");
  const [editCarId, setEditCarId] = useState(null);

  // Fetch cars from the server
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get("http://localhost:5000/cars");
        setCars(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania samochodów:", error);
      }
    };

    fetchCars();
  }, []);

  // Handle adding or updating a car
  const handleSaveCar = async () => {
    try {
      const carData = {
        username: "admin", // Dodaj nazwę użytkownika
        name,
        location,
        pricePerDay,
        tags: tags.split(","),
        image,
        isRecommended,
      };
  
      if (editCarId) {
        // Update car
        const response = await axios.put(
          `http://localhost:5000/update-car/${editCarId}`,
          carData
        );
        setMessage(response.data.message);
      } else {
        // Add new car
        const response = await axios.post("http://localhost:5000/add-car", carData);
        setMessage(response.data.message);
      }
  
      // Refresh car list
      const updatedCars = await axios.get("http://localhost:5000/cars");
      setCars(updatedCars.data);
  
      // Reset form
      resetForm();
    } catch (error) {
      setMessage("Wystąpił błąd podczas zapisywania samochodu.");
    }
  };

  // Handle deleting a car
  const handleDeleteCar = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/delete-car/${id}`, {
        params: { username: "admin" }, // Przesyłanie username jako parametru zapytania
      });
      setMessage(response.data.message);
  
      // Odśwież listę samochodów
      const updatedCars = await axios.get("http://localhost:5000/cars");
      setCars(updatedCars.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Wystąpił błąd podczas usuwania samochodu.");
    }
  };

  // Handle editing a car
  const handleEditCar = (car) => {
    setEditCarId(car.id);
    setName(car.name);
    setLocation(car.location);
    setPricePerDay(car.pricePerDay);
    setTags(car.tags.join(","));
    setImage(car.image);
    setIsRecommended(car.isRecommended);
  };

  // Reset form
  const resetForm = () => {
    setEditCarId(null);
    setName("");
    setLocation("");
    setPricePerDay("");
    setTags("");
    setImage("");
    setIsRecommended(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await axios.post("http://localhost:5000/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(response.data.imagePath); // Ustaw ścieżkę do przesłanego zdjęcia
      setMessage("Zdjęcie przesłane pomyślnie!");
    } catch (error) {
      setMessage("Wystąpił błąd podczas przesyłania zdjęcia.");
    }
  };

  return (
    <div>
      <h2>{editCarId ? "Edytuj samochód" : "Dodaj samochód"}</h2>
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
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        />
      <label>
        Polecane:
        <input
          type="checkbox"
          checked={isRecommended}
          onChange={() => setIsRecommended(!isRecommended)}
        />
      </label>
      <button onClick={handleSaveCar}>
        {editCarId ? "Zapisz zmiany" : "Dodaj samochód"}
      </button>
      <button onClick={resetForm}>Resetuj</button>
      {message && <p>{message}</p>}

      <h2>Lista samochodów</h2>
      <table>
        <thead>
          <tr>
            <th>Nazwa</th>
            <th>Lokalizacja</th>
            <th>Cena za dzień</th>
            <th>Tagi</th>
            <th>Zdjęcie</th>
            <th>Polecane</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => (
            <tr key={car.id}>
              <td>{car.name}</td>
              <td>{car.location}</td>
              <td>{car.pricePerDay} zł</td>
              <td>{car.tags.join(", ")}</td>
              <td>
                <img src={car.image} alt={car.name} style={{ width: "100px" }} />
              </td>
              <td>{car.isRecommended ? "Tak" : "Nie"}</td>
              <td>
                <button onClick={() => handleEditCar(car)}>Edytuj</button>
                <button onClick={() => handleDeleteCar(car.id)}>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;