const mongoose = require("mongoose");

const AcceptedTaskSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
      index: true,
    },
    taskTitle: {
      type: String,
      default: "",
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    organizationName: {
      type: String,
      default: "",
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    volunteerName: {
      type: String,
      required: true,
    },
    volunteerEmail: {
      type: String,
      required: true,
    },
    acceptedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["accepted", "cancelled"],
      default: "accepted",
    },
    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

AcceptedTaskSchema.index({ taskId: 1, volunteerId: 1, status: 1 });

module.exports = mongoose.model("AcceptedTask", AcceptedTaskSchema);
