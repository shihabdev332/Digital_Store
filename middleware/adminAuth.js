import jwt from "jsonwebtoken";

/**
 * Middleware to verify Admin access using JWT.
 * It checks for token in both 'Authorization' header and a custom 'token' header.
 */
const adminAuth = async (req, res, next) => {
  try {
    // Extract token from 'Authorization' header or a custom 'token' header
    const authHeader = req.headers.authorization;
    let token = req.headers.token; // Support for custom token header

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // If no token is found in any expected headers
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No token provided. Please login again.",
      });
    }

    // Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the token contains isAdmin status and it is true
    // Note: The 'isAdmin' field must be added to the payload during sign-in
    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required.",
      });
    }

    // Attach decoded data to request object for use in controllers
    req.user = decoded;

    // Proceed to the next middleware or controller function
    next();

  } catch (error) {
    console.error("❌ Admin Auth Error:", error.message);

    // Handle specific JWT expiration error
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "jwt expired", // Keep this exact string for frontend detection if needed
      });
    }

    // Handle other types of token errors (invalid signature, etc.)
    return res.status(401).json({
      success: false,
      message: "Authentication failed: Invalid or malformed token.",
    });
  }
};

export default adminAuth;