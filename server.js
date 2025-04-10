const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5000;

// Import danych samochodów z pliku carsData.js
const carsFilePath = path.join(__dirname, "src", "data", "carsData.js");
let cars = require(carsFilePath);

// Funkcja do odczytu użytkowników z pliku JSON
const readUsers = () => {
  const usersFilePath = path.join(__dirname, "src", "data", "users.json");
  if (!fs.existsSync(usersFilePath)) return [];
  const data = fs.readFileSync(usersFilePath);
  return JSON.parse(data);
};

app.use(cors());
app.use(express.json());

// Funkcja do zapisu danych samochodów z powrotem do pliku carsData.js
const writeCarsToFile = () => {
  const content = `const cars = ${JSON.stringify(cars, null, 2)};\n\nexport default cars;`;
  fs.writeFileSync(carsFilePath, content);
};

// Endpoint do dodawania samochodu (tylko dla adminów)
const checkAdmin = (req, res, next) => {
  const { username } = req.body;
  const users = readUsers();

  const user = users.find(u => u.username === username);

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Brak uprawnień administratora!" });
  }

  next(); // Jeśli użytkownik jest adminem, przechodzi do następnego middleware lub endpointu
};

// Endpoint do dodawania samochodu
app.post("/add-car", checkAdmin, (req, res) => {
  const { name, location, pricePerDay, tags, image, isRecommended } = req.body;

  if (!name || !location || !pricePerDay || !tags || !image) {
    return res.status(400).json({ message: "Brak wymaganych danych!" });
  }

  const newCar = {
    id: cars.length ? cars[cars.length - 1].id + 1 : 1, // Generowanie unikalnego ID
    name,
    location,
    pricePerDay,
    tags,
    image,
    isRecommended: isRecommended || false, // Domyślnie `isRecommended` ustawiamy na `false`
  };

  cars.push(newCar);
  writeCarsToFile(); // Zapisz zmienione dane

  res.status(200).json({ message: "Samochód dodany pomyślnie!", car: newCar });
});

// Endpoint do usuwania samochodu
app.delete("/delete-car/:id", checkAdmin, (req, res) => {
  const { id } = req.params;
  const carIndex = cars.findIndex(car => car.id === parseInt(id));

  if (carIndex === -1) {
    return res.status(404).json({ message: "Samochód nie znaleziony!" });
  }

  cars.splice(carIndex, 1);
  writeCarsToFile(); // Zapisz zmienione dane

  res.status(200).json({ message: "Samochód usunięty pomyślnie!" });
});

// Endpoint do aktualizacji samochodu
app.put("/update-car/:id", checkAdmin, (req, res) => {
  const { id } = req.params;
  const { name, location, pricePerDay, tags, image, isRecommended } = req.body;

  if (!name || !location || !pricePerDay || !tags || !image) {
    return res.status(400).json({ message: "Brak wymaganych danych!" });
  }

  const carIndex = cars.findIndex(car => car.id === parseInt(id));

  if (carIndex === -1) {
    return res.status(404).json({ message: "Samochód nie znaleziony!" });
  }

  const updatedCar = {
    ...cars[carIndex],
    name,
    location,
    pricePerDay,
    tags,
    image,
    isRecommended: isRecommended !== undefined ? isRecommended : cars[carIndex].isRecommended,
  };

  cars[carIndex] = updatedCar;
  writeCarsToFile(); // Zapisz zmienione dane

  res.status(200).json({ message: "Samochód zaktualizowany pomyślnie!", car: updatedCar });
});

// Endpoint do pobierania wszystkich samochodów
app.get("/cars", (req, res) => {
  res.status(200).json(cars);
});

// Logowanie użytkownika
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  
  const user = users.find(user => user.username === username && user.password === password);
  
  if (!user) {
    return res.status(401).json({ message: "Nieprawidłowe dane logowania!" });
  }
  
  // Sprawdzenie, czy użytkownik jest administratorem
  const isAdmin = user.role === "admin";

  res.json({ message: "Zalogowano!", user, isAdmin });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
