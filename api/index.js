const express = require("express");
const serverless = require("serverless-http");
const route = require("./routes/route"); // Ensure this path is correct
const { connectDB } = require("./config/db");

const app = express();
connectDB();
app.use("/", route)
app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = serverless(app); 
