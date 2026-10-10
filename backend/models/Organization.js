const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  certificatePath: { type: String },
  approved: { type: Boolean, default: false }, // admin should approve
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Organization', OrgSchema);
