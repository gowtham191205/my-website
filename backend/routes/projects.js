const router  = require('express').Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const projects = await Project.find(query).populate('assignedEmployees', 'name empId role').sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('assignedEmployees', 'name empId role department');
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, data: project });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

router.put('/:id', protect, authorize('Admin', 'Manager'), async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (err) { res.status(400).json({ success: false, error: err.message }); }
});

router.delete('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
    res.json({ success: true, message: `${project.name} deleted` });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
