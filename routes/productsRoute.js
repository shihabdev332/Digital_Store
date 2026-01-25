import express from "express";
import {
  addProduct,
  removeProduct,
  listProducts,
  singleProduct,
  searchProducts,
} from "../controller/productController.js";
import { generatePremiumProductData } from "../controller/adminAiController.js"; // Importing the Premium AI Controller
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRoute = express.Router();

// ✅ Route for AI Data Generation (Admin Only)

productRoute.post("/ai-generate", adminAuth, generatePremiumProductData);

// ✅ Route for Adding Product
productRoute.post(
  "/add",
  adminAuth, // Middleware alignment
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }, // Added extra slot for high-end electronics
  ]),
  addProduct
);

// ✅ Other Product Management Routes
productRoute.post("/remove", adminAuth, removeProduct); // Added adminAuth for security
productRoute.get("/list", listProducts);
productRoute.get("/single/:id", singleProduct);
productRoute.get("/search", searchProducts);

export default productRoute;