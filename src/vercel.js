const serverless = require("serverless-http");
const express = require('express')
const app = express()
const route = require('../src/routes/route')
const {connectDB, getDB} = require("./config/db");
app.use(express.json())
app.use("", route)
// Connect to MongoDB
connectDB();

module.exports = serverless(app);
