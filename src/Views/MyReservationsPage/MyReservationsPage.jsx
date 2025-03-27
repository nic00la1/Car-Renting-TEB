import React, { useEffect, useState } from "react";
import "./MyReservationsPage.css";

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedUser"));
    if (user && user.reservations) {
      setReservations(user.reservations);
    }
  }, []);

  if (reservations.length === 0) {
    return <p className="no-reservations">Brak rezerwacji 😢</p>;
  }

  return (
    <div className="reservations-container">
      <h2>Moje rezerwacje</h2>
      <div className="reservations-list">
        {reservations.map((res, index) => (
          <div key={index} className="reservation-card">
            <img src={res.image} alt={res.carName} />
            <div>
              <h3>{res.carName}</h3>
              <p><strong>Lokalizacja:</strong> {res.location}</p>
              <p><strong>Dni:</strong> {res.days}</p>
              <p><strong>Łączna cena:</strong> {res.totalPrice} zł</p>
              <p><strong>Data rezerwacji:</strong> {res.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
