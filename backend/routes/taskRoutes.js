import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $ne: 'closed' } })
      .populate('organization', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid task ID format' });
    }
    
    const task = await Task.findById(req.params.id)
      .populate('organization', 'fullName email');
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Organization only)
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'organization') {
      return res.status(403).json({ message: 'Only organizations can create tasks' });
    }

    const task = await Task.create({
      ...req.body,
      organization: req.user._id,
      organizationName: req.user.fullName
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

