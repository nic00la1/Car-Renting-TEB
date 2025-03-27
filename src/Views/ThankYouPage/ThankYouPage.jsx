import React from "react";
import { Link } from "react-router-dom";
import "./ThankYouPage.css";

export default function ThankYouPage() {
  return (
    <div className="thank-you-container">
      <h1>Dziękujemy za rezerwację tego auta! 🚗</h1>
      <p>Twoja rezerwacja została zapisana. Sprawdź swoją skrzynkę mailową 📧</p>
      <Link to="/" className="back-home-btn">Wróć do strony głównej</Link>
    </div>
  );
}
