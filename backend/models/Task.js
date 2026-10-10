const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, default: 'General' },
  location: { type: String, default: '' },
  address: { type: String, default: '' },
  date: { type: Date },
  time: { type: String, default: '' },
  duration: { type: String, default: '' },
  volunteersNeeded: { type: Number, default: 1 },
  requirements: { type: [String], default: [] },
  whatToBring: { type: [String], default: [] },
  contact: { type: String, default: '' },
  phone: { type: String, default: '' },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', default: null },
  organizationName: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);

