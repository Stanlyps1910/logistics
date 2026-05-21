require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const quotesRoutes = require("./routes/quotes");
const shipmentsRoutes = require("./routes/shipments");
const clientsRoutes = require("./routes/clients");

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quotes", quotesRoutes);
app.use("/api/shipments", shipmentsRoutes);
app.use("/api/clients", clientsRoutes);

const path = require("path");

// Serve Static Frontend Assets in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
  });
} else {
  // Root Endpoint
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to NexaFreight Logistics API" });
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
