import Order from "../model/orderModel.js";

/**
 * ✅ Get all orders with full details (Admin Only)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId", "name images price") // English Comment: Changed 'image' to 'images' to match your schema
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ 
      success: true, 
      count: orders.length, 
      orders 
    });
  } catch (err) {
    console.error("❌ Admin Fetch Error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching database records" });
  }
};

/**
 * ✅ Get orders for a specific user
 */
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const orders = await Order.find({ userId })
      .populate("products.productId", "name images price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching your orders" });
  }
};

/**
 * ✅ Update order status (Premium State Machine Logic)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    // English Comment: Defining a strict workflow to prevent logical errors
    const statusFlow = ["Order Placed", "Processing", "Shipped", "Delivered"];
    const finalStatuses = ["Delivered", "Cancelled"];

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    // 1. Check if order is already in a final state
    if (finalStatuses.includes(order.status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Status cannot be changed. Order is already ${order.status}.` 
      });
    }

    // 2. Prevent moving backward (e.g., Shipped to Processing)
    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(status);
    
    if (status !== "Cancelled" && newIndex < currentIndex) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid sequence. You cannot move from ${order.status} to ${status}.` 
      });
    }

    order.status = status;
    await order.save();

    res.json({ 
      success: true, 
      message: `Order successfully updated to ${status}`,
      status: order.status 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Premium update failed" });
  }
};

/**
 * ✅ Client Self-Cancellation (Enhanced Security)
 */
export const clientCancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id; 

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order record missing" });

    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized action" });
    }

    // Logic: Only allow cancellation if order is in initial stage
    if (order.status !== "Order Placed" && order.status !== "Pending") {
      return res.status(400).json({ 
        success: false, 
        message: `Cancellation locked. Order is already in ${order.status} stage.` 
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({ success: true, message: "Order revoked successfully", order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cancellation process interrupted" });
  }
};