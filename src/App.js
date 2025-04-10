import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CarRental from "./Views/CarRental/CarRental";
import ReservationPage from "./Views/ReservationPage/ReservationPage";
import LoginPage from "./Views/LoginPage/LoginPage";
import RegisterPage from "./Views/RegisterPage/RegisterPage";
import ThankYouPage from "./Views/ThankYouPage/ThankYouPage";
import MyReservationsPage from "./Views/MyReservationsPage/MyReservationsPage";
import Navbar from "./components/Navbar/Navbar";
import cars from "./data/carsData";
import MyAccount from "./Views/MyAccount/MyAccount";
import AdminPage from "./Views/AdminPage/AdminPage";

export default function App() {
  const [user, setUser] = useState(null); // Stan przechowujący dane o użytkowniku

  // Pobierz dane użytkownika z localStorage przy ładowaniu aplikacji
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, []);

  // Funkcja do wylogowania użytkownika
  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedUser");
  };

  // ProtectedRoute do sprawdzenia autoryzacji
  const ProtectedRoute = ({ element, isAdmin = false }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (isAdmin && user.role !== "admin") {
      return <Navigate to="/" />;
    }

    return element;
  };

  return (
    <Router>
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<CarRental />} />
        <Route path="/reservation/:carId" element={<ReservationPage cars={cars} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route path="/my-reservations" element={<ProtectedRoute element={<MyReservationsPage />} />} />
        <Route path="/my-account" element={<ProtectedRoute element={<MyAccount />} />} />
        
        {/* Tylko dla administratorów */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminPage />} isAdmin={true} />} />
      </Routes>
    </Router>
  );
}
