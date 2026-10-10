const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Task = require("../models/Task");
const Application = require("../models/Application");
const AcceptedTask = require("../models/AcceptedTask");
const auth = require("../middleware/auth");
const orgAuth = require("../middleware/orgAuth");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const normalizeList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }
  return [];
};

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const filter = {};

    if (req.query.organizationId) {
      if (!isValidObjectId(req.query.organizationId)) {
        return res.status(400).json({ message: "Invalid organizationId" });
      }
      filter.organizationId = req.query.organizationId;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks (Organization only)
router.post("/", orgAuth, async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ message: "title and description are required" });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      location: req.body.location,
      address: req.body.address,
      date: req.body.date,
      time: req.body.time,
      duration: req.body.duration,
      volunteersNeeded: Number(req.body.volunteersNeeded) || 1,
      requirements: normalizeList(req.body.requirements),
      whatToBring: normalizeList(req.body.whatToBring),
      contact: req.body.contact,
      phone: req.body.phone,
      organizationId: req.org._id,
      organizationName: req.org.name,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/tasks/:id (Organization only)
router.put("/:id", orgAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.organizationId || task.organizationId.toString() !== req.org._id.toString()) {
      return res.status(403).json({ message: "You can only update your own tasks" });
    }

    const updates = {};
    const fields = [
      "title",
      "description",
      "category",
      "location",
      "address",
      "date",
      "time",
      "duration",
      "contact",
      "phone",
    ];

    fields.forEach((field) => {
      if (typeof req.body[field] !== "undefined") {
        updates[field] = req.body[field];
      }
    });

    if (typeof req.body.volunteersNeeded !== "undefined") {
      updates.volunteersNeeded = Number(req.body.volunteersNeeded) || 1;
    }

    if (typeof req.body.requirements !== "undefined") {
      updates.requirements = normalizeList(req.body.requirements);
    }

    if (typeof req.body.whatToBring !== "undefined") {
      updates.whatToBring = normalizeList(req.body.whatToBring);
    }

    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });
    res.json(updatedTask);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks/:id/apply (requires auth) - legacy
router.post("/:id/apply", auth, async (req, res) => {
  try {
    const volunteer = req.user;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const existing = await Application.findOne({ volunteerId: volunteer._id, taskId: task._id });
    if (existing) {
      return res.status(409).json({ message: "Already applied for this task" });
    }

    const app = new Application({
      volunteerId: volunteer._id,
      volunteerName: volunteer.fullName || volunteer.name || "",
      volunteerEmail: volunteer.email,
      taskId: task._id,
      taskTitle: task.title,
      organizationId: task.organizationId || null,
    });

    await app.save();
    return res.status(201).json({ message: "Application submitted successfully", application: app });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: err.message });
  }
});

// optional: get applications for a task (org/admin)
router.get("/:id/applications", auth, async (req, res) => {
  try {
    const apps = await Application.find({ taskId: req.params.id })
      .populate("volunteerId", "fullName email")
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/tasks/:id/accept (volunteer accepts task)
router.post("/:id/accept", auth, async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can accept tasks" });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const existing = await AcceptedTask.findOne({
      taskId: task._id,
      volunteerId: req.user._id,
      status: "accepted",
    });

    if (existing) {
      return res.status(200).json({ message: "Task already accepted", acceptance: existing });
    }

    const acceptance = await AcceptedTask.create({
      taskId: task._id,
      taskTitle: task.title,
      organizationId: task.organizationId,
      organizationName: task.organizationName,
      volunteerId: req.user._id,
      volunteerName: req.user.fullName || req.user.name || "Volunteer",
      volunteerEmail: req.user.email,
    });

    return res.status(201).json({ message: "Task accepted", acceptance });
  } catch (err) {
    console.error("Accept task error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:id/acceptance (volunteer status)
router.get("/:id/acceptance", auth, async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can view acceptance status" });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const acceptance = await AcceptedTask.findOne({
      taskId: id,
      volunteerId: req.user._id,
      status: "accepted",
    });

    return res.json({ accepted: Boolean(acceptance), acceptance });
  } catch (err) {
    console.error("Get acceptance error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/accepted/me (volunteer accepted tasks)
router.get("/accepted/me", auth, async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can view accepted tasks" });
    }

    const acceptances = await AcceptedTask.find({
      volunteerId: req.user._id,
      status: "accepted",
    })
      .populate("taskId", "title location date time organizationName")
      .sort({ acceptedAt: -1 });

    return res.json(acceptances);
  } catch (err) {
    console.error("List accepted tasks error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/tasks/:id/accept (volunteer cancels)
router.delete("/:id/accept", auth, async (req, res) => {
  try {
    if (req.user.role !== "volunteer") {
      return res.status(403).json({ message: "Only volunteers can cancel tasks" });
    }

    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const acceptance = await AcceptedTask.findOne({
      taskId: id,
      volunteerId: req.user._id,
      status: "accepted",
    });

    if (!acceptance) {
      return res.status(404).json({ message: "You have not accepted this task" });
    }

    acceptance.status = "cancelled";
    acceptance.cancelledAt = new Date();
    await acceptance.save();

    return res.json({ message: "Task cancelled", acceptance });
  } catch (err) {
    console.error("Cancel task error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/tasks/:id/volunteers (organization view)
router.get("/:id/volunteers", orgAuth, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (!task.organizationId || task.organizationId.toString() !== req.org._id.toString()) {
      return res.status(403).json({ message: "You can only view volunteers for your tasks" });
    }

    const volunteers = await AcceptedTask.find({
      taskId: id,
      status: "accepted",
    })
      .select("volunteerName volunteerEmail acceptedAt")
      .sort({ acceptedAt: -1 });

    return res.json(volunteers);
  } catch (err) {
    console.error("List volunteers error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
