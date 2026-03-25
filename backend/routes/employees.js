const router   = require('express').Router();
const Employee = require('../models/Employee');
const { protect, authorize } = require('../middleware/auth');

// GET /api/employees  — list with optional filters
router.get('/', protect, async (req, res) => {
  try {
    const { department, status, search, page = 1, limit = 50 } = req.query;
    const query = {};
    if (department) query.department = department;
    if (status)     query.status = status;
    if (search)     query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [employees, total] = await Promise.all([
      Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(+limit),
      Employee.countDocuments(query),
    ]);

    res.json({ success: true, count: employees.length, total, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/employees/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/employees
router.post('/', protect, authorize('Admin', 'Manager', 'HR'), async (req, res) => {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json({ success: true, data: emp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/employees/:id
router.put('/:id', protect, authorize('Admin', 'Manager', 'HR'), async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/employees/:id
router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const emp = await Employee.findByIdAndDelete(req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: 'Employee not found' });
    res.json({ success: true, message: `${emp.name} deleted` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/employees/analytics/departments — aggregation pipeline
router.get('/analytics/departments', protect, async (req, res) => {
  try {
    const result = await Employee.aggregate([
      { $group: {
        _id: '$department',
        count:          { $sum: 1 },
        avgSalary:      { $avg: '$salary' },
        avgPerformance: { $avg: '$performance' },
        avgExperience:  { $avg: '$experience' },
      }},
      { $sort: { count: -1 } },
      { $project: {
        department:     '$_id',
        count:          1,
        avgSalary:      { $round: ['$avgSalary', 0] },
        avgPerformance: { $round: ['$avgPerformance', 1] },
        avgExperience:  { $round: ['$avgExperience', 1] },
      }},
    ]);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/employees/analytics/skills
router.get('/analytics/skills', protect, async (req, res) => {
  try {
    const result = await Employee.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
