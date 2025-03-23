const express = require('express')
const app = express()
const route = require('../src/routes/route')
const {connectDB, getDB} = require("./config/db");
app.use(express.json())
app.use("", route)
// Connect to MongoDB
connectDB();
app.listen(3000, function () {
    console.log('Express app running on port ', 3000)
});
