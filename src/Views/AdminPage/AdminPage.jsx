import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminPage.css"; // Add a CSS file for custom styles

function AdminPage() {
  const [cars, setCars] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");
  const [isRecommended, setIsRecommended] = useState(false);
  const [message, setMessage] = useState("");
  const [editCarId, setEditCarId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Dodano dla paginacji
  const carsPerPage = 5; // Liczba samochodów na stronę

  // Fetch cars from the server
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/cars");
        setCars(response.data);
      } catch (error) {
        console.error("Błąd podczas pobierania samochodów:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Handle adding or updating a car
  const handleSaveCar = async () => {
    setLoading(true);
    try {
      const carData = {
        username: "admin",
        name,
        location,
        pricePerDay,
        tags: tags.split(","),
        image,
        isRecommended,
      };

      if (editCarId) {
        // Update car
        const response = await axios.put(
          `http://localhost:5000/update-car/${editCarId}`,
          carData
        );
        setMessage(response.data.message);
      } else {
        // Add new car
        const response = await axios.post("http://localhost:5000/add-car", carData);
        setMessage(response.data.message);
      }

      // Refresh car list
      const updatedCars = await axios.get("http://localhost:5000/cars");
      setCars(updatedCars.data);

      // Reset form
      resetForm();
      setShowModal(false);
    } catch (error) {
      setMessage("Wystąpił błąd podczas zapisywania samochodu.");
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a car
  const handleDeleteCar = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten samochód?")) return;

    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:5000/delete-car/${id}`, {
        params: { username: "admin" },
      });
      setMessage(response.data.message);

      // Refresh car list
      const updatedCars = await axios.get("http://localhost:5000/cars");
      setCars(updatedCars.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Wystąpił błąd podczas usuwania samochodu.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing a car
  const handleEditCar = (car) => {
    setEditCarId(car.id);
    setName(car.name);
    setLocation(car.location);
    setPricePerDay(car.pricePerDay);
    setTags(car.tags.join(","));
    setImage(car.image);
    setIsRecommended(car.isRecommended);
    setImagePreview(car.image);
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setEditCarId(null);
    setName("");
    setLocation("");
    setPricePerDay("");
    setTags("");
    setImage("");
    setIsRecommended(false);
    setImagePreview("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:5000/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImage(response.data.imagePath);
      setImagePreview(URL.createObjectURL(file)); // Preview the uploaded image
      setMessage("Zdjęcie przesłane pomyślnie!");
    } catch (error) {
      setMessage("Wystąpił błąd podczas przesyłania zdjęcia.");
    }
  };

  // Filter cars based on search input
  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(search.toLowerCase()) ||
      car.location.toLowerCase().includes(search.toLowerCase()) ||
      car.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
  );

  // Obliczanie samochodów dla aktualnej strony
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Zmiana strony
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="admin-page">
      <h2>Panel Administracyjny</h2>
      <button onClick={() => setShowModal(true)} className="add-car-button">
        Dodaj Samochód
      </button>
      <div className="search-container">
        <input
          type="text"
          placeholder="Szukaj..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
      </div>
      {loading ? (
        <p>Ładowanie...</p>
      ) : (
        <>
          <table className="car-table">
            <thead>
              <tr>
                <th>Nazwa</th>
                <th>Lokalizacja</th>
                <th>Cena za dzień</th>
                <th>Tagi</th>
                <th>Zdjęcie</th>
                <th>Polecane</th>
                <th>Akcje</th>
              </tr>
            </thead>
            <tbody>
              {currentCars.map((car) => (
                <tr key={car.id}>
                  <td>{car.name}</td>
                  <td>{car.location}</td>
                  <td>{car.pricePerDay} zł</td>
                  <td>{car.tags.join(", ")}</td>
                  <td>
                    <img src={car.image} alt={car.name} style={{ width: "100px" }} />
                  </td>
                  <td>{car.isRecommended ? "Tak" : "Nie"}</td>
                  <td>
                    <button onClick={() => handleEditCar(car)}>Edytuj</button>
                    <button onClick={() => handleDeleteCar(car.id)}>Usuń</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginacja */}
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Poprzednia
            </button>
            {Array.from(
              { length: Math.ceil(filteredCars.length / carsPerPage) },
              (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? "active" : ""}
                >
                  {index + 1}
                </button>
              )
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredCars.length / carsPerPage)}
            >
              Następna
            </button>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editCarId ? "Edytuj samochód" : "Dodaj samochód"}</h3>
            <input
              type="text"
              placeholder="Nazwa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Lokalizacja"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="number"
              placeholder="Cena za dzień"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
            />
            <input
              type="text"
              placeholder="Tagi (oddziel przecinkami)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
            <label>
              Polecane:
              <input
                type="checkbox"
                checked={isRecommended}
                onChange={() => setIsRecommended(!isRecommended)}
              />
            </label>
            <button onClick={handleSaveCar} disabled={loading}>
              {editCarId ? "Zapisz zmiany" : "Dodaj samochód"}
            </button>
            <button onClick={() => setShowModal(false)}>Anuluj</button>
          </div>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default AdminPage;