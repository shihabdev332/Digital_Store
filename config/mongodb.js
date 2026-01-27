import mongoose from "mongoose";

// English Comment: Function to establish or reuse a MongoDB connection
const dbConnect = async () => {
    try {
        // ✅ Check if already connected to avoid multiple connections
        if (mongoose.connection.readyState >= 1) {
            return; 
        }

        mongoose.connection.on("connected", () => {
            console.log("Db is connected successfully");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });

        // ✅ Added timeout options to prevent long-term buffering
        await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000, // 5 seconds timeout
        });

    } catch (error) {
        console.error("not connected", error);
        // English Comment: Throw error to be caught by global error handler
        throw new Error("Database connection failed");
    }
};

export default dbConnect;
