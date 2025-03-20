import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./ReservationPage.css";

export default function ReservationPage({ cars }) {
  const { carId } = useParams();
  const car = cars.find(c => c.id === parseInt(carId));

  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(car.pricePerDay);

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    setDays(value);
    setTotalPrice(car.pricePerDay * value);
  };

  return (
    <div className="reservation-container">
      <h1>Rezerwacja {car.name}</h1>
      <div className="reservation-content">
        <img src={car.image} alt={car.name} className="reservation-image" />
        <div className="reservation-info">
          <p><strong>Lokalizacja:</strong> {car.location}</p>
          <p><strong>Cena za dzień:</strong> {car.pricePerDay} zł</p>
          <label>
            <strong>Liczba dni:</strong>
            <input
              type="number"
              min="1"
              value={days}
              onChange={handleDaysChange}
            />
          </label>
          <p><strong>Łączna cena:</strong> {totalPrice} zł</p>
          <button className="reserve-btn">Potwierdź rezerwację</button>
        </div>
      </div>
    </div>
  );
}
