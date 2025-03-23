const express = require("express");
const serverless = require("serverless-http");
const route = require("./routes/route"); // Ensure the correct path
// const { connectDB } = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
// connectDB();

// Routes
app.use("/", route);

// Export as a serverless function
module.exports = serverless(app);
