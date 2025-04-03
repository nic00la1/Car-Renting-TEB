import React, { useState } from "react";
import { Car, MapPin, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import cars from "../../data/carsData";
import TestimonialsSlider from "../TestimonialsSlider/TestimonialsSlider"; // Upewnij się, że importujesz komponent
import "./CarRental.css";

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

      {/* Slider z opiniami */}
      <TestimonialsSlider />
    </div>
  );
}

export default CarRental;
