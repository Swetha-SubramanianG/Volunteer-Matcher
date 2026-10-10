import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import Application from '../models/Application.js';
import Task from '../models/Task.js';

const router = express.Router();

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// @route   POST /api/applications
// @desc    Apply for a task/opportunity
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { taskId, opportunityId, message } = req.body;

    if (!taskId && !opportunityId) {
      return res.status(400).json({ message: 'Please provide taskId or opportunityId' });
    }

    // Check if task exists and has available spots
    if (taskId) {
      // Validate ObjectId format
      if (!isValidObjectId(taskId)) {
        return res.status(400).json({ message: 'Invalid task ID format' });
      }
      
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      if (task.status === 'full') {
        return res.status(400).json({ message: 'Task is full' });
      }

      // Check if user already applied
      const existingApplication = await Application.findOne({
        user: req.user._id,
        task: taskId
      });

      if (existingApplication) {
        return res.status(400).json({ message: 'You have already applied for this task' });
      }

      // Create application
      const application = await Application.create({
        user: req.user._id,
        task: taskId,
        message
      });

      // Update task spots
      task.spots.filled += 1;
      await task.save();

      res.status(201).json({
        message: 'Application submitted successfully',
        application
      });
    } else {
      // Handle opportunity application (similar logic)
      const application = await Application.create({
        user: req.user._id,
        opportunity: opportunityId,
        message
      });

      res.status(201).json({
        message: 'Application submitted successfully',
        application
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this task' });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/applications/my-applications
// @desc    Get user's applications
// @access  Private
router.get('/my-applications', protect, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('task', 'title description date time location')
      .sort({ appliedAt: -1 });
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

