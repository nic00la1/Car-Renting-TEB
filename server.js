const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const PORT = 5000;
const USERS_FILE = "src/data/users.json";

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

// Rejestracja użytkownika
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

// Logowanie użytkownika
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Nieprawidłowe dane logowania!" });
  }
  
  res.json({ message: "Zalogowano!", user });
});

// Aktualizacja rezerwacji użytkownika
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

// Route to get user reservations
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


app.listen(PORT, () => {
  console.log(`Serwer działa na http://localhost:${PORT}`);
});
