const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bookRoutes = require("./routes/bookRoutes");
const sequelize = require("./config/db"); 

const app = express();
const PORT = process.env.SERVER_PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Routes
app.use("/", bookRoutes);

sequelize.sync({ alter: true }) 
    .then(() => {
        console.log("✅ Database synced successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database sync error:", err);
    });
