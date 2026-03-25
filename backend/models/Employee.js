const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Employee name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: [
      'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
      'QA Engineer', 'DevOps Engineer', 'Engineering Manager',
      'Product Manager', 'UI/UX Designer', 'Data Engineer',
      'Data Scientist', 'ML Engineer', 'Scrum Master',
    ],
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    enum: ['Engineering', 'QA', 'DevOps', 'Management', 'Design', 'Data Science'],
  },
  experience: { type: Number, default: 0, min: 0, max: 50 },
  salary:     { type: Number, default: 0, min: 0 },
  skills:     [{ type: String, trim: true }],
  status: {
    type: String,
    enum: ['active', 'bench', 'leave', 'offboard'],
    default: 'active',
  },
  performance: { type: Number, default: 80, min: 0, max: 100 },
  location: { type: String, trim: true },
  phone:    { type: String, trim: true },
  joinDate: { type: Date, default: Date.now },
  notes:    { type: String, maxlength: 500 },
}, {
  timestamps: true,  // adds createdAt, updatedAt
});

// ── Auto-generate empId ──
EmployeeSchema.pre('save', async function (next) {
  if (!this.empId) {
    const count = await mongoose.model('Employee').countDocuments();
    this.empId = `EMP${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// ── Indexes ──
EmployeeSchema.index({ email: 1 }, { unique: true });
EmployeeSchema.index({ department: 1 });
EmployeeSchema.index({ status: 1 });
EmployeeSchema.index({ skills: 1 });
EmployeeSchema.index({ name: 'text', email: 'text', role: 'text' });

module.exports = mongoose.model('Employee', EmployeeSchema);
