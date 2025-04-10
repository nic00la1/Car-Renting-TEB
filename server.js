const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 5000;

// Pliki danych
const USERS_FILE = "src/data/users.json";
const carsFilePath = path.join(__dirname, "src", "data", "carsData.js");
let cars = require(carsFilePath);

app.use(cors());
app.use(express.json());

// Funkcja do odczytu użytkowników z pliku JSON
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Funkcja do zapisu użytkowników do pliku JSON
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Funkcja do zapisu danych samochodów z powrotem do pliku carsData.js
const writeCarsToFile = () => {
  const content = `const cars = ${JSON.stringify(cars, null, 2)};\n\nmodule.exports = cars;`;
  fs.writeFileSync(carsFilePath, content);
};

// Middleware do sprawdzania, czy użytkownik jest adminem
const checkAdmin = (req, res, next) => {
  const username = req.body.username || req.query.username || req.headers["username"];
  console.log("Sprawdzam użytkownika:", username); // Logowanie
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user || user.role !== "admin") {
    console.log("Brak uprawnień administratora:", username); // Logowanie
    return res.status(403).json({ message: "Brak uprawnień administratora!" });
  }

  console.log("Użytkownik jest adminem:", username); // Logowanie
  next();
};
// Endpointy użytkowników
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  if (users.find(user => user.username === username)) {
    return res.status(400).json({ message: "Użytkownik już istnieje!" });
  }

  const newUser = { username, password, reservations: [] };
  users.push(newUser);
  writeUsers(users);

  res.json({ message: "Zarejestrowano!" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) {
    return res.status(401).json({ message: "Nieprawidłowe dane logowania!" });
  }

  res.json({ message: "Zalogowano!", user });
});

app.post("/update-reservation", (req, res) => {
  const { username, reservation } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (user) {
    user.reservations.push(reservation);
    writeUsers(users);
    res.status(200).json({ message: "Rezerwacja zapisana!" });
  } else {
    res.status(404).json({ error: "Użytkownik nie znaleziony!" });
  }
});

app.post("/get-reservations", (req, res) => {
  const { username } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (user) {
    res.status(200).json({ reservations: user.reservations });
  } else {
    res.status(404).json({ error: "Użytkownik nie znaleziony!" });
  }
});

app.get("/user/:username", (req, res) => {
  const { username } = req.params;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ message: "Użytkownik nie znaleziony" });
  }

  res.json(user);
});

app.post("/update-password", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: "Użytkownik nie znaleziony!" });
  }

  user.password = password;
  writeUsers(users);
  res.status(200).json({ message: "Hasło zostało zmienione!" });
});

app.post("/update-avatar", (req, res) => {
  const { username, avatar } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(404).json({ error: "Użytkownik nie znaleziony!" });
  }

  user.avatar = avatar;
  writeUsers(users);
  res.status(200).json({ message: "Avatar został zaktualizowany!" });
});

// Endpointy samochodów
app.post("/add-car", checkAdmin, (req, res) => {
  const { name, location, pricePerDay, tags, image, isRecommended } = req.body;

  if (!name || !location || !pricePerDay || !tags || !image) {
    return res.status(400).json({ message: "Brak wymaganych danych!" });
  }

  const newCar = {
    id: cars.length ? cars[cars.length - 1].id + 1 : 1,
    name,
    location,
    pricePerDay,
    tags,
    image,
    isRecommended: isRecommended || false,
  };

  cars.push(newCar);
  writeCarsToFile();
  res.status(200).json({ message: "Samochód dodany pomyślnie!", car: newCar });
});

app.delete("/delete-car/:id", checkAdmin, (req, res) => {
  const { id } = req.params;
  const carIndex = cars.findIndex(car => car.id === parseInt(id));

  if (carIndex === -1) {
    return res.status(404).json({ message: "Samochód nie znaleziony!" });
  }

  cars.splice(carIndex, 1);
  writeCarsToFile();
  res.status(200).json({ message: "Samochód usunięty pomyślnie!" });
});

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
  writeCarsToFile();
  res.status(200).json({ message: "Samochód zaktualizowany pomyślnie!", car: updatedCar });
});

app.get("/cars", (req, res) => {
  res.status(200).json(cars);
});

const multer = require("multer");

// Konfiguracja multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "photos")); // Folder, gdzie będą zapisywane zdjęcia
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unikalna nazwa pliku
  },
});

const upload = multer({ storage });

// Endpoint do przesyłania zdjęcia
app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nie przesłano pliku!" });
  }
  res.status(200).json({ imagePath: `/photos/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});