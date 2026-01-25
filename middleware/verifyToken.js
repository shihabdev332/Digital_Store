import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Check for token in multiple places
  const authHeader = req.headers.authorization;
  const directToken = req.headers.token;
  
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (directToken) {
    token = directToken;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided!" });
  }

  // Ensure JWT_SECRET matches exactly with your login controller
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT Verification Error:", err.message); // Debugging
      return res.status(403).json({ message: "Invalid token!" });
    }
    
    // Decoded data often contains id as 'id' or '_id', make sure to normalize it
    req.user = {
        id: decoded.id || decoded._id,
        isAdmin: decoded.isAdmin
    };
    next();
  });
};