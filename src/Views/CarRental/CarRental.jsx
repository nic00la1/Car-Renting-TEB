import React, { useState } from "react";
import { Car, MapPin, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import cars from "../../data/carsData";
import "./CarRental.css";

function CarRental() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();

  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedLocation === "" || car.location === selectedLocation)
  );

  const handleReservation = async (car) => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (!user) {
      alert("Zaloguj się, aby dokonać rezerwacji!");
      return;
    }

    const reservation = {
      carName: car.name,
      location: car.location,
      days: 3, // Przykład: zarezerwowane na 3 dni
      totalPrice: car.pricePerDay * 3,
      date: new Date().toLocaleDateString(),
      image: car.image,
    };

    // Wyślij dane rezerwacji do API
    const response = await fetch("http://localhost:5000/update-reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        reservation: reservation,
      }),
    });

    if (response.ok) {
      alert("Rezerwacja została zapisana!");
      navigate("/my-reservations"); // Przeniesienie do strony rezerwacji
    } else {
      alert("Wystąpił błąd podczas zapisywania rezerwacji.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Wypożyczalnia Samochodów</h1>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Wyszukaj auto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-select"
        >
          <option value="">Wszystkie lokalizacje</option>
          {[...new Set(cars.map(car => car.location))].map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      <div className="grid-container">
        {filteredCars.map((car) => (
          <div key={car.id} className="car-card">
            <img src={car.image} alt={car.name} className="car-image" />
            <h2 className="car-title">
              <Car className="icon" /> {car.name}
            </h2>
            <p className="car-info">
              <MapPin className="icon" /> {car.location}
            </p>
            <p className="car-info">
              <Calendar className="icon" /> {car.pricePerDay} zł/dzień
            </p>
            <button onClick={() => handleReservation(car)} className="reserve-btn">
              Zarezerwuj
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarRental;
