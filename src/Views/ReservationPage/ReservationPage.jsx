import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ReservationPage.css";

export default function ReservationPage({ cars }) {
  const { carId } = useParams();
  const navigate = useNavigate();
  const car = cars.find(c => c.id === parseInt(carId));

  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(car.pricePerDay);

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    setDays(value);
    setTotalPrice(car.pricePerDay * value);
  };

  const handleReservation = () => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (user) {
      const reservation = {
        carId: car.id,
        carName: car.name,
        image: car.image,
        location: car.location,
        days,
        totalPrice,
        date: new Date().toLocaleDateString()
      };

      user.reservations = user.reservations || [];
      user.reservations.push(reservation);

      localStorage.setItem("loggedUser", JSON.stringify(user));
      navigate("/thank-you");
    } else {
      navigate("/login");
    }
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
          <button className="reserve-btn" onClick={handleReservation}>
            Potwierdź rezerwację
          </button>
        </div>
      </div>
    </div>
  );
}
