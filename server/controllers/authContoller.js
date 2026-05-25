const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT Secret Key (Fallback if not in your .env file)
const JWT_SECRET = process.env.JWT_SECRET || "noted_super_secret_key_123";

// REGISTER A NEW USER
const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the user
    user = new User({
      username,
      password: hashedPassword,
    });
    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role || "user" },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(201).json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
