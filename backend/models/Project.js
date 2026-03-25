const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: 100,
  },
  description: { type: String, trim: true, maxlength: 500 },
  stack:       { type: String, trim: true },
  status: {
    type: String,
    enum: ['Active', 'Planning', 'On Hold', 'Completed'],
    default: 'Active',
  },
  progress:  { type: Number, default: 0, min: 0, max: 100 },
  teamSize:  { type: Number, default: 1, min: 1 },
  startDate: { type: Date },
  endDate:   { type: Date },
  assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee' }],
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
