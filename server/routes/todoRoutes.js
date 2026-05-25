const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");

// GET TODOS
router.get("/", protect, getTodos);

// CREATE TODO
router.post("/", protect, createTodo);

// UPDATE TODO
router.put("/:id", protect, updateTodo);

// DELETE TODO
router.delete("/:id", protect, deleteTodo);

module.exports = router;
