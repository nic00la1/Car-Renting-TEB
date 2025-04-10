const cars = [
  {
    id: 1,
    name: "Tesla Model 3",
    location: "Łódź",
    pricePerDay: 250,
    image: require("../photos/tesla3.webp"),
    tags: ["elektryczny", "sedan", "premium"],
    isRecommended: true,
  },
  {
    id: 2,
    name: "BMW 5 Series",
    location: "Warszawa",
    pricePerDay: 350,
    image: require("../photos/bmw5.jpg"),
    tags: ["lux", "sedan"],
    isRecommended: false,
  },
  {
    id: 3,
    name: "Audi A6",
    location: "Kraków",
    pricePerDay: 400,
    image: require("../photos/audi-a6.jpg"),
    tags: ["sedan", "komfort", "premium"],
    isRecommended: true,
  },
  {
    id: 4,
    name: "Dodge Challenger",
    location: "Gdańsk",
    pricePerDay: 500,
    image: require("../photos/dodge-challenger.webp"),
    tags: ["sport", "muscle", "coupe"],
    isRecommended: true,
  },
];

export default cars;
