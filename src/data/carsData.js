const cars = [
  {
    id: 1,
    name: "Tesla Model 3",
    location: "Łódź",
    pricePerDay: 250,
    image: "../photos/tesla3.webp", // Use the relative path as a string
    tags: ["elektryczny", "sedan", "premium"],
    isRecommended: true,
  },
  {
    id: 2,
    name: "BMW 5 Series",
    location: "Warszawa",
    pricePerDay: 350,
    image: "../photos/bmw5.jpg", // Use the relative path as a string
    tags: ["lux", "sedan"],
    isRecommended: false,
  },
  {
    id: 3,
    name: "Audi A6",
    location: "Kraków",
    pricePerDay: 400,
    image: "../photos/audi-a6.jpg", // Use the relative path as a string
    tags: ["sedan", "komfort", "premium"],
    isRecommended: true,
  },
  {
    id: 4,
    name: "Dodge Challenger",
    location: "Gdańsk",
    pricePerDay: 500,
    image: "../photos/dodge-challenger.webp", // Use the relative path as a string
    tags: ["sport", "muscle", "coupe"],
    isRecommended: true,
  },
];

module.exports = cars;