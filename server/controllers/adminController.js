const User = require("../models/User");

// GET ALL USERS (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding passwords, sorted by newest first
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error fetching users", error: error.message });
  }
};

// DELETE A USER (Admin Only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user first to make sure they exist
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent the admin from accidentally deleting their own account
    if (user._id.toString() === req.user.userId) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Server error deleting user", error: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
};
