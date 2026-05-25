const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const todoRoutes = require("./routes/todoRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const PORT = process.env.PORT || 5600;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/todos", todoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

connectDB();
app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(PORT, () => {
  console.log("Server running on port 5600");
});
