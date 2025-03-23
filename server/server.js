require("dotenv").config();
require('./models');
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth');


const app = express();
const path = require("path");



app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (_, callback) => {
      callback(null, true);
    },
    credentials: true,
  })
);
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
