import React, { useState } from "react";
import { Car, MapPin, Calendar } from "lucide-react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ReservationPage from "./ReservationPage";
import "./CarRental.css";

const cars = [
  { id: 1, name: "Tesla Model 3", location: "Łódź", pricePerDay: 250, image: require("./photos/tesla3.webp") },
  { id: 2, name: "BMW 5 Series", location: "Warszawa", pricePerDay: 350, image: require("./photos/bmw5.jpg") },
  { id: 3, name: "Audi A6", location: "Kraków", pricePerDay: 400, image: require("./photos/audi-a6.jpg") },
  { id: 4, name: "Dodge Challenger", location: "Gdańsk", pricePerDay: 500, image: require("./photos/dodge-challenger.webp") } // NOWE AUTO
];

function CarRental() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedLocation === "" || car.location === selectedLocation)
  );

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
          <Link to={`/reservation/${car.id}`} key={car.id} className="car-card">
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
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarRental />} />
        <Route path="/reservation/:carId" element={<ReservationPage cars={cars} />} />
      </Routes>
    </Router>
  );
}
