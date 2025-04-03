// MyReservationsPage.js
import React, { useEffect, useState } from "react";
import InvoiceGenerator from "../InvoiceGenerator/InvoiceGenerator";

import "./MyReservationsPage.css";

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      const user = JSON.parse(localStorage.getItem("loggedUser"));
      if (user) {
        const response = await fetch("http://localhost:5000/get-reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: user.username }),
        });

        if (response.ok) {
          const data = await response.json();
          setReservations(data.reservations);
        } else {
          alert("Nie udało się pobrać rezerwacji.");
        }
      }
    };
    fetchReservations();
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
              {/* Dodajemy komponent generujący fakturę */}
              <InvoiceGenerator reservation={res} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
