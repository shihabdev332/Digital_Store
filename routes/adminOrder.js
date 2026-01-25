import express from "express";
import Order from "../model/orderModel.js";
import { 
  getAllOrders, 
  updateOrderStatus, 
  clientCancelOrder // নিশ্চিত করুন এটি আপনার কন্ট্রোলারে আছে
} from "../controller/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * @route   POST /api/order/create
 * @desc    Create a new order
 */
router.post("/create", verifyToken, async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user.id // verifyToken থেকে পাওয়া id
    };
    
    const newOrder = new Order(orderData);
    await newOrder.save();
    
    res.status(201).json({ 
      success: true, 
      message: "Order placed successfully!",
      order: newOrder 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/order/user/:userId
 * @desc    Get all orders for a specific user
 */
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Security: ইউজার কি নিজের অর্ডারই দেখছে? 
    // (verifyToken-এ decoded payload-এ id বা _id যা দিয়েছেন সেটি চেক করুন)
    const currentUserId = req.user.id || req.user._id;

    if (currentUserId !== userId && !req.user.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: "Forbidden: Access denied." 
      });
    }

    // .populate('products.productId') যোগ করা হয়েছে যাতে ফ্রন্টএন্ডে নাম/ইমেজ পায়
    const orders = await Order.find({ userId })
      .populate("products.productId") 
      .sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      orders 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/order/cancel
 * @desc    Cancel order by client (Added this to fix 404)
 */
router.put("/cancel", verifyToken, clientCancelOrder);

/**
 * @route   GET /api/order/all
 * @desc    Admin: Get all orders
 */
router.get("/all", adminAuth, getAllOrders);

/**
 * @route   PUT /api/order/status
 * @desc    Admin: Update status
 */
router.put("/status", adminAuth, updateOrderStatus);

export default router;