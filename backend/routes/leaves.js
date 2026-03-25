const router = require('express').Router();
const Leave  = require('../models/Leave');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const leaves = await Leave.find(query).populate('employee', 'name empId department').sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/', protect, async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json({ success: true, data: leave });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

router.put('/:id', protect, authorize('Admin', 'Manager', 'HR'), async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });
    res.json({ success: true, data: leave });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

router.delete('/:id', protect, authorize('Admin', 'Manager', 'HR'), async (req, res) => {
  try {
    await Leave.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Leave request deleted' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
