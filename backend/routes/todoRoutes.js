const express = require('express');
const router = express.Router();
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  shareTodo,
} = require('../controllers/todoController');
const { protect } = require('../middleware/authMiddleware');

// GET all todos + POST a new todo
router.route('/').get(protect, getTodos).post(protect, createTodo);

// UPDATE or DELETE specific todo
router.route('/:id').put(protect, updateTodo).delete(protect, deleteTodo);

router.route('/:id/share').post(protect, shareTodo);

module.exports = router;

