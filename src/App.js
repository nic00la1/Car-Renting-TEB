import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CarRental from "./Views/CarRental/CarRental";
import ReservationPage from "./Views/ReservationPage/ReservationPage";
import LoginPage from "./Views/LoginPage/LoginPage";
import RegisterPage from "./Views/RegisterPage/RegisterPage";
import ThankYouPage from "./Views/ThankYouPage/ThankYouPage";
import MyReservationsPage from "./Views/MyReservationsPage/MyReservationsPage";
import Navbar from "./components/Navbar/Navbar"; // 👈 dodaj to
import cars from "./data/carsData";

export default function App() {
  return (
    <Router>
      <Navbar /> {/* 👈 to pokazuje menu */}
      <Routes>
        <Route path="/" element={<CarRental />} />
        <Route path="/reservation/:carId" element={<ReservationPage cars={cars} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/my-reservations" element={<MyReservationsPage />} />
      </Routes>
    </Router>
  );
}
