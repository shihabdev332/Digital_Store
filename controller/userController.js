import userModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

// Function to create a JWT token with longer expiration
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Increased expiration to 7 days to fix "jwt expired" issue
  );
};

// ✅ User Login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validation for required fields
    if (!email || !password) {
      return res.json({ success: false, message: "Email and Password are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist!" });
    }

    // Compare encrypted password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password!" });
    }

    const token = createToken(user);

    // Return success response with user data
    res.json({
      success: true,
      token,
      message: "User Logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
        isAdmin: user.isAdmin || false,
        userCart: user.userCart || {},
      },
    });
  } catch (error) {
    console.error("User Login error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Register User
const userRegister = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    
    // Check for missing fields
    if (!name || !email || !password) {
      return res.json({ success: false, message: "All fields are required" });
    }

    // Email format validation
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid Email Address" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User Already exists!" });
    }

    // Password length validation
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters" });
    }

    // Password Hashing
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: encryptedPassword,
      isAdmin: isAdmin || false,
    });

    await newUser.save();
    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("User register Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    const user = await userModel.findOne({ email });

    // Check if user exists and is an Admin
    if (!user || !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to login as admin!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials!" });
    }

    const token = createToken(user);
    console.log("Admin Login success for:", email);

    res.status(200).json({
      success: true,
      token, 
      admin: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "Admin logged in successfully",
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Remove User
const removeUser = async (req, res) => {
  try {
    const { _id } = req.body;
    await userModel.findByIdAndDelete(_id);
    res.json({ success: true, message: "User Deleted Successfully!" });
  } catch (error) {
    console.error("Remove User error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update User
const updateUser = async (req, res) => {
  try {
    const { _id, name, email, password } = req.body;
    const user = await userModel.findById(_id);
    if (!user) return res.json({ success: false, message: "User not found!" });

    if (name) user.name = name;

    if (email) {
      if (!validator.isEmail(email)) {
        return res.json({ success: false, message: "Please enter a valid email address!" });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 8) {
        return res.json({ success: false, message: "Password must be at least 8 characters!" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ success: true, message: "User updated successfully!" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Users
const getUser = async (req, res) => {
  try {
    const total = await userModel.countDocuments({});
    // Fetch users excluding password field for security
    const users = await userModel.find({}).select("-password");
    res.json({ success: true, total, users });
  } catch (error) {
    console.error("All user get error:", error);
    res.json({ success: false, message: error.message });
  }
};

export { userLogin, userRegister, adminLogin, removeUser, updateUser, getUser };