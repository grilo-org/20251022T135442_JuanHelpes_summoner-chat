require("dotenv").config(); // Load environment variables from .env file

const express = require("express");

const summonerRoutes = require("./routes/summonerRoutes"); // Import user routes
const chatRoutes = require("./routes/chatRoutes"); // Import chat routes

//const connectToDataBase = require("./database");
const cors = require("cors"); // Import CORS middleware

// Connect to the database
//connectToDataBase();

// Initialize the Express application
const app = express();
const port = 3333;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request bodies

app.use("/summoner", summonerRoutes);
app.use("/chat", chatRoutes);

app.listen(port, () => {
  console.log(`Backend started at http://localhost:${port}`);
});
