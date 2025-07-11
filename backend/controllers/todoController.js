const asyncHandler = require('express-async-handler');
const Todo = require('../models/todoModel');
const User = require('../models/userModel');

const createTodo = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate, sharedWith } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const todo = await Todo.create({
    title,
    description,
    priority,
    dueDate,
    owner: req.user.id,
    sharedWith,
  });

  res.status(201).json(todo);
});
//get
const getTodos = asyncHandler(async (req, res) => {
    const todos = await Todo.find({
      $or: [
        { owner: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort('-createdAt');
  
    res.status(200).json(todos);
  });
  //update
  const updateTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);
  
    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }
  
    if (todo.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized');
    }
  
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
  
    res.json(updated);
});
//delete
const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);
  
    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }
  
    if (todo.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized');
    }
  
    await todo.deleteOne();
    res.json({ message: 'Todo removed' });
  });

  const shareTodo = asyncHandler(async (req, res) => {
    const todoId = req.params.id;
    const { email } = req.body;
  
    const todo = await Todo.findById(todoId);
    const userToShare = await User.findOne({ email });
  
    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }
  
    if (!userToShare) {
      res.status(404);
      throw new Error('User to share with not found');
    }
  
    // Only owner can share
    if (!todo.owner || todo.owner.toString() !== req.user.id) {
      res.status(403);
      throw new Error('Not authorized to share this todo');
    }
  
    // Add to sharedWith array if not already there
    if (!todo.sharedWith.includes(userToShare._id)) {
      todo.sharedWith.push(userToShare._id);
      await todo.save();
    }
  
    res.status(200).json({ message: 'Todo shared successfully' });
  });
  
  
  module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    shareTodo
  };
  