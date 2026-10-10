import express from 'express';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// @route   GET /api/organizations/:id/opportunities
// @desc    Get opportunities for an organization
// @access  Public
router.get('/:id/opportunities', async (req, res) => {
  try {
    const tasks = await Task.find({ 
      organization: req.params.id,
      status: { $ne: 'closed' }
    })
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

