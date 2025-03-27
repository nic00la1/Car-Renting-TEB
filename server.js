const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5000;

// Enable CORS for all origins
app.use(cors());

app.use(express.json());

// Route for updating reservation
app.post("/update-reservation", (req, res) => {
  const { username, reservation } = req.body;

  // Read the users.json file
  fs.readFile("src/data/users.json", "utf-8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading file" });
    }

    const users = JSON.parse(data);
    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user's reservations
    users[userIndex].reservations.push(reservation);

    // Write updated data back to users.json
    fs.writeFile("src/data/users.json", JSON.stringify(users, null, 2), "utf-8", (err) => {
      if (err) {
        return res.status(500).json({ error: "Error writing to file" });
      }
      res.status(200).json({ message: "Reservation updated successfully" });
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
