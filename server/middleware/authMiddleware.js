const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "noted_super_secret_key_123";

const protect = (req, res, next) => {
  // 1. Get the token from the request header
  const token = req.header("Authorization")?.split(" ")[1]; // Expects format: "Bearer <token>"

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach the user object (containing userId) to the request
    req.user = decoded;

    // Move on to the controller function
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
// STEP 2: Add the isAdmin middleware here
const isAdmin = (req, res, next) => {
  // Check if req.user exists and if their role is strictly 'admin'
  if (req.user && req.user.role === "admin") {
    next(); // Access granted, move to the next function/route
  } else {
    // 403 Forbidden: We know who you are, but you don't have permission
    return res
      .status(403)
      .json({ message: "Access denied. Admin privileges required." });
  }
};

// Make sure to export BOTH functions now
module.exports = { protect, isAdmin };
