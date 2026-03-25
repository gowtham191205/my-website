const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ──
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connection ──
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nexushr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected → nexushr'))
.catch(err => { console.error('❌ MongoDB Error:', err.message); process.exit(1); });

// ── Routes ──
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/employees',  require('./routes/employees'));
app.use('/api/projects',   require('./routes/projects'));
app.use('/api/leaves',     require('./routes/leaves'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ── 404 Handler ──
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NexusHR API running on http://localhost:${PORT}`);
  console.log(`📖 Docs: http://localhost:${PORT}/api/health`);
});
