import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  // userId কে সরাসরি User মডেলের সাথে কানেক্ট করা ভালো
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'user', 
    required: true 
  },
  products: [
    {
      // ✅ এখানে String এর বদলে ObjectId এবং ref ব্যবহার করতে হবে
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'product', // আপনার প্রোডাক্ট মডেলের নাম যা mongoose.model("product", ...) এ দিয়েছেন
        required: true
      },
      quantity: { 
        type: Number, 
        default: 1, 
        required: true 
      },
    },
  ],
  totalAmount: { type: Number, required: true },
  address: { type: Object, required: true }, // address অবজেক্ট আকারে রাখা ভালো (city, phone, etc.)
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Pending" },
}, { timestamps: true });

// Model exports
const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;