import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  // Basic Information
  _type: { type: String, default: "electronics" },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  brand: { type: String, required: true, default: "Generic" }, // Added default to avoid validation error
  category: { type: String, required: true },
  
  // Media
  images: { type: Array, required: true }, 
  videoUrl: { type: String, default: "" }, 
  
  // Pricing & Inventory
  price: { type: Number, required: true },
  discountedPercentage: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  
  // Electronics Specific Details (Updated for AI Flexibility)
  // Changed Map of String to Mixed Object to handle nested AI data
  specifications: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  }, 
  
  colors: { type: Array, default: [] },
  modelNumber: { type: String, default: "" },
  warranty: { type: String, default: "No Warranty" },
  
  // Status & Badges
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }, 
  offer: { type: Boolean, default: false },
  badge: { type: String, default: "" }, 
  
  // SEO & Filtering
  tags: { type: Array, default: [] },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

}, { timestamps: true });

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;