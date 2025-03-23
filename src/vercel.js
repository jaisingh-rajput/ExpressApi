const express = require("express");
const serverless = require("serverless-http");
const route = require("./routes/route"); // Ensure correct path
const { connectDB } = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/", route);

// Export serverless function
module.exports = serverless(app);
