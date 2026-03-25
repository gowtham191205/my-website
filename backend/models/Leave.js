const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  empName:  { type: String },   // denormalized for quick display
  type: {
    type: String,
    enum: ['Annual Leave', 'Sick Leave', 'Maternity/Paternity', 'Unpaid Leave', 'Comp Off'],
    required: true,
  },
  fromDate: { type: Date, required: true },
  toDate:   { type: Date, required: true },
  reason:   { type: String, maxlength: 300 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Leave', LeaveSchema);
