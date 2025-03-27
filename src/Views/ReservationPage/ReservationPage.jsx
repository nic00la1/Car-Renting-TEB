import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ReservationPage.css";

export default function ReservationPage({ cars }) {
  const { carId } = useParams();
  const navigate = useNavigate();
  const car = cars.find(c => c.id === parseInt(carId));

  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(car ? car.pricePerDay : 0);
  const [error, setError] = useState("");

  const handleDaysChange = (e) => {
    const value = parseInt(e.target.value);
    if (value < 1) {
      setError("Liczba dni musi być większa niż 0");
      setDays(1);
      setTotalPrice(car.pricePerDay);
    } else {
      setError("");
      setDays(value);
      setTotalPrice(car.pricePerDay * value);
    }
  };

  const handleReservation = () => {
    if (days < 1) {
      setError("Liczba dni musi być większa niż 0");
      return;
    }

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

      // Wysłanie rezerwacji do serwera
      fetch('http://localhost:5000/update-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: user.username,
          reservation: reservation
        })
      })
      .then(response => response.json())
      .then(data => {
        alert('Rezerwacja została zapisana!');
        navigate("/thank-you");
      })
      .catch(error => {
        alert('Wystąpił błąd podczas zapisywania rezerwacji');
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="reservation-container">
      {car ? (
        <>
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
              {error && <p className="error">{error}</p>}
              <p><strong>Łączna cena:</strong> {totalPrice} zł</p>
              <button className="reserve-btn" onClick={handleReservation}>
                Potwierdź rezerwację
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>Samochód nie został znaleziony.</p>
      )}
    </div>
  );
}
