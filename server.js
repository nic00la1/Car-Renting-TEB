const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Handle the reservation update
app.post("/update-reservation", (req, res) => {
  const { username, reservation } = req.body;

  // Read the users.json file
  fs.readFile("src/data/users.json", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Could not read users data" });
    }

    const users = JSON.parse(data);

    // Find the user by username
    const user = users.find(u => u.username === username);

    if (user) {
      user.reservations.push(reservation); // Save the reservation to the user
      // Write the updated users data back to the file
      fs.writeFile("src/data/users.json", JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: "Could not update reservation" });
        }
        res.status(200).json({ message: "Reservation updated successfully" });
      });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
