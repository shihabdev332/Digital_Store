import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Configurations
import dbConnect from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";

// Routes
import userRouter from "./routes/userRouters.js";
import productRoute from "./routes/productsRoute.js";
import orderRoute from "./routes/adminOrder.js";
import locationRouter from "./routes/locationRoute.js";
import aiRouter from "./routes/aiRoute.js"; // ✅ Re-added AI Router

const app = express();

// Initialize Database & Cloudinary Connections
dbConnect();
connectCloudinary();

// Middlewares
// English Comment: Configure CORS to allow requests from any origin (helpful for Vercel)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Body Parsers with increased limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Root Health Check Route
app.get("/", (req, res) => {
  res.status(200).send("Digital Shop API - Status: Operational ✅");
});

// Primary API Endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/location", locationRouter);
app.use("/api/ai", aiRouter); // ✅ Re-added AI endpoint

// Standard 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Global Error Stack:", err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Server Configuration
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
