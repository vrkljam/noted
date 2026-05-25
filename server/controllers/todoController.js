const Todo = require("../models/Todo");

// GET ALL TODOS
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json(todos);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE TODO
const createTodo = async (req, res) => {
  try {
    const newTodo = new Todo({
      text: req.body.text,
      user: req.user.userId,
    });

    const savedTodo = await newTodo.save();

    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TODO
const updateTodo = async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,

      {
        text: req.body.text,
        completed: req.body.completed,
      },

      { returnDocument: "after" },
    );

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE TODO
const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);

    res.json({
      message: "Todo deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
