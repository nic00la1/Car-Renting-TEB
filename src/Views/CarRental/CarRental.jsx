import React, { useState } from "react";
import { Car, MapPin, Calendar, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import cars from "../../data/carsData";
import TestimonialsSlider from "../TestimonialsSlider/TestimonialsSlider";
import Slider from "react-slick"; // importujemy Slider
import "./CarRental.css";

function CarRental() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [modalOpen, setModalOpen] = useState(false); // Stan do otwierania/zamknięcia modala
  const [selectedCar, setSelectedCar] = useState(null); // Auto wybrane z listy
  const [cart, setCart] = useState([]); // Koszyk, przechowujący dodane samochody

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

  const openModal = (car) => {
    setSelectedCar(car);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCar(null);
  };

  const addToCart = (car) => {
    setCart([...cart, car]); // Dodajemy auto do koszyka
    closeModal(); // Zamykamy modal po dodaniu
  };

  const viewCart = () => {
    alert(`W koszyku znajduje się ${cart.length} samochodów.`); // Pokazujemy liczbę samochodów w koszyku
  };

  // Konfiguracja slidera
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

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
            <Link to={`/reservation/${car.id}`} key={car.id} className="car-card" onClick={() => openModal(car)}>
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

      {/* Modal z wybranym autem */}
      {modalOpen && selectedCar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>X</button>
            <h2>{selectedCar.name}</h2>
            <img src={selectedCar.image} alt={selectedCar.name} className="car-image" />
            <p>{selectedCar.pricePerDay} zł/dzień</p>
            <div className="tags">
              {(selectedCar.tags || []).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <button onClick={() => addToCart(selectedCar)} className="add-to-cart-btn">Dodaj do koszyka</button>
          </div>
        </div>
      )}

      {/* 💬 Opinie */}
      <TestimonialsSlider />
    </div>
  );
}

export default CarRental;
