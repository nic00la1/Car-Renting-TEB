import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CarRental from "./Views/CarRental/CarRental";
import ReservationPage from "./Views/ReservationPage/ReservationPage";
import cars from "./data/carsData";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CarRental />} />
        <Route path="/reservation/:carId" element={<ReservationPage cars={cars} />} />
      </Routes>
    </Router>
  );
}
