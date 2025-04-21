require("dotenv").config();
require('./models');
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const cleanerRoutes = require('./routes/cleanerRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminBookingRoutes = require('./routes/adminBookingRoutes');

const app = express();
const path = require("path");


// Middlewares
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
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/cleaner/bookings', cleanerRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 
