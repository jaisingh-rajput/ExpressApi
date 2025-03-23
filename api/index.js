const express = require("express");
const route = require("./routes/route"); // Ensure this path is correct
const { connectDB } = require("./config/db");

const app = express();
connectDB();
app.use("/", route)
app.listen(3001, () => console.log("Server ready on port 3000."));

module.exports = app;
