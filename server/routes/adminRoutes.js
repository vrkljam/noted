const express = require("express");
const router = express.Router();

// Import controllers
const {
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController.js");

// Import your middlewares
const { protect, isAdmin } = require("../middleware/authMiddleware.js");

// GET /api/admin/users
router.get("/users", protect, isAdmin, getAllUsers);

// DELETE /api/admin/users/:id
router.delete("/users/:id", protect, isAdmin, deleteUser);

module.exports = router;
