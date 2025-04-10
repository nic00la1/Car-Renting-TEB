import React, { useState } from "react";
import { Car, MapPin, Calendar, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import cars from "../../data/carsData";
import TestimonialsSlider from "../TestimonialsSlider/TestimonialsSlider";
import Slider from "react-slick"; // Importujemy Slider
import "./CarRental.css";

function CarRental() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const allTags = Array.from(new Set(cars.flatMap(car => car.tags || [])));
  const locations = Array.from(new Set(cars.map(car => car.location)));

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSortBy("");
    setSelectedTag("");
  };

  const filteredCars = cars.filter(car =>
    car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedLocation === "" || car.location === selectedLocation) &&
    (selectedTag === "" || (car.tags && car.tags.includes(selectedTag)))
  );

  const sortedCars = [...filteredCars].sort((a, b) => {
    if (sortBy === "priceAsc") return a.pricePerDay - b.pricePerDay;
    if (sortBy === "priceDesc") return b.pricePerDay - a.pricePerDay;
    return 0;
  });


  return (
    <div className="container">
      <h1 className="title">🚗 Wypożyczalnia Samochodów</h1>

      {/* 🔍 Filtry */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔎 Szukaj auta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-select"
        >
          <option value="">🌍 Wszystkie lokalizacje</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="">Sortuj wg</option>
          <option value="priceAsc">Cena rosnąco</option>
          <option value="priceDesc">Cena malejąco</option>
        </select>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="filter-select"
        >
          <option value="">Wszystkie typy</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>

        <button onClick={resetFilters} className="reset-btn">Resetuj filtry</button>
      </div>

      {/* 🚘 Lista aut */}
      <div className="grid-container">
        {sortedCars.length === 0 ? (
          <p className="no-results">Brak wyników. Spróbuj zmienić filtry.</p>
        ) : (
          sortedCars.map((car) => (
            <Link to={`/reservation/${car.id}`} key={car.id} className="car-card" >
              <img src={car.image} alt={car.name} className="car-image" />
              <h2 className="car-title"><Car className="icon" /> {car.name}</h2>
              <p className="car-info"><MapPin className="icon" /> {car.location}</p>
              <p className="car-info"><Calendar className="icon" /> {car.pricePerDay} zł/dzień</p>

              {/* Wyświetlanie tagów */}
              <div className="tags">
                {(car.tags || []).map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </Link>
          ))
        )}
      </div>
      {/* 💬 Opinie */}
      <TestimonialsSlider />
    </div>
  );
}

export default CarRental;
