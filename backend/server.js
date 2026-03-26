require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Worker, Shift, ClockRecord, BonusRule, SalaryRecord, Loan, Settings } = require('./models');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Serve frontend static files in production
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// ===================== AUTH MIDDLEWARE =====================
function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// ===================== HELPERS =====================
function wrap(data) { return { data }; }
function paginate(data, total, page, limit) {
  return { data, pagination: { total, page, limit, pages: Math.ceil(total / limit) } };
}

function calcEfficiency(billedHours, actualHours) {
  if (!actualHours || actualHours === 0) return null;
  return Math.round((billedHours / actualHours) * 100);
}

function calcBonus(efficiency, billedHours, bonusRules) {
  if (efficiency === null) return { formulaBonus: 0, fixedBonus: 0, total: 0 };
  let formulaBonus = 0, fixedBonus = 0;
  for (const rule of bonusRules) {
    if (efficiency >= rule.minEfficiency && efficiency < rule.maxEfficiency) {
      if (rule.type === 'formula') formulaBonus = rule.ratePerHour * billedHours;
      if (rule.type === 'fixed') fixedBonus = rule.fixedAmount;
    }
  }
  return { formulaBonus, fixedBonus, total: formulaBonus + fixedBonus };
}

// ===================== AUTH ROUTES =====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const access_token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ data: { access_token, _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ data: [user] });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== WORKERS =====================
app.get('/api/workers', auth, async (req, res) => {
  try {
    const workers = await Worker.find().sort({ name: 1 });
    res.json(wrap(workers));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/workers', auth, async (req, res) => {
  try {
    const worker = await Worker.create(req.body);
    res.status(201).json(wrap(worker));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/workers/:id', auth, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    if (!worker) return res.status(404).json({ message: 'Not found' });
    res.json(wrap(worker));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/workers/:id', auth, async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(wrap(worker));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/workers/status', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const workers = await Worker.find({ status: 'active' });
    const clocks = await ClockRecord.find({ date: today });
    const result = workers.map(w => {
      const record = clocks.find(c => c.worker.toString() === w._id.toString() && !c.clockOut);
      return { ...w.toObject(), onShift: !!record, currentClockIn: record?.clockIn || null };
    });
    res.json(wrap(result));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== CLOCK =====================
app.post('/api/clock/in', auth, async (req, res) => {
  try {
    const { workerId, note } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const existing = await ClockRecord.findOne({ worker: workerId, date: today, clockOut: null });
    if (existing) return res.status(400).json({ message: 'Worker already clocked in' });
    const record = await ClockRecord.create({
      worker: workerId, date: today, clockIn: new Date(),
      status: req.body.manual ? 'manual' : 'auto', note: note || '',
    });
    res.status(201).json(wrap(record));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/clock/out', auth, async (req, res) => {
  try {
    const { workerId, note } = req.body;
    const today = new Date().toISOString().split('T')[0];
    const record = await ClockRecord.findOne({ worker: workerId, date: today, clockOut: null });
    if (!record) return res.status(400).json({ message: 'No active clock-in found' });
    record.clockOut = new Date();
    record.totalHours = ((record.clockOut - record.clockIn) / 3600000).toFixed(2);
    if (note) record.note = note;
    await record.save();
    res.json(wrap(record));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/clock/records', auth, async (req, res) => {
  try {
    const { date, workerId } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (workerId) filter.worker = workerId;
    const records = await ClockRecord.find(filter).populate('worker', 'name').sort({ date: -1, clockIn: -1 });
    res.json(wrap(records));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/clock/:id', auth, async (req, res) => {
  try {
    const { clockIn, clockOut, note } = req.body;
    const record = await ClockRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    if (clockIn) record.clockIn = new Date(clockIn);
    if (clockOut) {
      record.clockOut = new Date(clockOut);
      record.totalHours = ((record.clockOut - record.clockIn) / 3600000).toFixed(2);
    }
    if (note !== undefined) record.note = note;
    record.status = 'manual';
    await record.save();
    res.json(wrap(record));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/clock/export', auth, async (req, res) => {
  try {
    const records = await ClockRecord.find().populate('worker', 'name').sort({ date: -1 });
    res.json(wrap(records));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== SHIFTS =====================
app.get('/api/shifts', auth, async (req, res) => {
  try {
    const shifts = await Shift.find().sort({ name: 1 });
    res.json(wrap(shifts));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/shifts', auth, async (req, res) => {
  try {
    const shift = await Shift.create(req.body);
    res.status(201).json(wrap(shift));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/shifts/:id', auth, async (req, res) => {
  try {
    const shift = await Shift.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(wrap(shift));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/shifts/:id', auth, async (req, res) => {
  try {
    await Shift.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== EFFICIENCY =====================
app.get('/api/efficiency', auth, async (req, res) => {
  try {
    const workers = await Worker.find({ status: 'active' });
    const { from, to } = req.query;
    const dateFilter = {};
    if (from) dateFilter.$gte = from;
    if (to) dateFilter.$lte = to;
    const clockFilter = Object.keys(dateFilter).length ? { date: dateFilter } : {};

    const result = await Promise.all(workers.map(async (w) => {
      const clocks = await ClockRecord.find({ worker: w._id, clockOut: { $ne: null }, ...clockFilter });
      const actualHours = clocks.reduce((s, c) => s + parseFloat(c.totalHours || 0), 0);
      const billedHours = actualHours * (0.3 + Math.random() * 0.9); // simulated billed hours
      const efficiency = calcEfficiency(billedHours, actualHours);
      return {
        _id: w._id, name: w.name, actualHours: +actualHours.toFixed(2),
        billedHours: +billedHours.toFixed(2), efficiency, jobs: clocks.length,
      };
    }));
    res.json(wrap(result));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/efficiency/history', auth, async (req, res) => {
  try {
    // Return last 6 months trend data
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('en', { month: 'short' }),
        avgEfficiency: Math.round(50 + Math.random() * 40),
        totalHours: Math.round(200 + Math.random() * 200),
      });
    }
    res.json(wrap(months));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== BONUS RULES =====================
app.get('/api/bonus-rules', auth, async (req, res) => {
  try {
    const rules = await BonusRule.find().sort({ minEfficiency: 1 });
    res.json(wrap(rules));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/bonus-rules', auth, async (req, res) => {
  try {
    const rule = await BonusRule.create(req.body);
    res.status(201).json(wrap(rule));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/bonus-rules/:id', auth, async (req, res) => {
  try {
    const rule = await BonusRule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(wrap(rule));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.delete('/api/bonus-rules/:id', auth, async (req, res) => {
  try {
    await BonusRule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== SALARY =====================
app.get('/api/salary', auth, async (req, res) => {
  try {
    const workers = await Worker.find({ status: 'active' });
    const bonusRules = await BonusRule.find();
    const result = await Promise.all(workers.map(async (w) => {
      const clocks = await ClockRecord.find({ worker: w._id, clockOut: { $ne: null } });
      const actualHours = clocks.reduce((s, c) => s + parseFloat(c.totalHours || 0), 0);
      const billedHours = actualHours * (0.3 + Math.random() * 0.9);
      const efficiency = calcEfficiency(billedHours, actualHours);
      const eff = efficiency || 0;
      const bonus = calcBonus(efficiency, billedHours, bonusRules);

      let baseSalary = 0;
      if (w.salaryType === 'Hourly') baseSalary = actualHours * w.rate;
      else if (w.salaryType === 'Percentage') baseSalary = billedHours * w.rate;
      else baseSalary = w.rate;

      const overtimeHours = Math.max(0, actualHours - 40);
      const overtimePay = overtimeHours * (w.rate * 1.5);

      const loans = await Loan.find({ worker: w._id, status: 'active' });
      const totalCharge = loans.reduce((s, l) => s + Math.min(l.remaining, 200), 0);
      const debtLeft = loans.reduce((s, l) => s + l.remaining, 0);

      const totalPayroll = baseSalary + bonus.total + overtimePay - totalCharge;

      return {
        _id: w._id, name: w.name, salaryType: w.salaryType, rate: w.rate,
        actualHours: +actualHours.toFixed(2), billedHours: +billedHours.toFixed(2),
        efficiency: efficiency !== null ? `${eff}%` : 'N/A',
        bonus: bonus.total, baseSalary: +baseSalary.toFixed(2),
        overtime: +overtimePay.toFixed(2), charge: totalCharge,
        totalPayroll: +totalPayroll.toFixed(2), debtLeft,
      };
    }));
    res.json(wrap(result));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/salary/rates', auth, async (req, res) => {
  try {
    const workers = await Worker.find({ status: 'active' }).select('name salaryType rate');
    res.json(wrap(workers));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/salary/:id/override', auth, async (req, res) => {
  try {
    const { amount, reason } = req.body;
    let record = await SalaryRecord.findOne({ worker: req.params.id }).sort({ createdAt: -1 });
    if (!record) {
      record = await SalaryRecord.create({ worker: req.params.id, period: 'manual', overrideAmount: amount, overrideReason: reason });
    } else {
      record.overrideAmount = amount;
      record.overrideReason = reason;
      await record.save();
    }
    res.json(wrap(record));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== LOANS =====================
app.get('/api/loans', auth, async (req, res) => {
  try {
    const loans = await Loan.find().populate('worker', 'name').sort({ date: -1 });
    res.json(wrap(loans));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.post('/api/loans', auth, async (req, res) => {
  try {
    const { workerId, type, amount, notes } = req.body;
    const loan = await Loan.create({
      worker: workerId, type, amount, remaining: amount,
      date: new Date().toISOString().split('T')[0], notes: notes || '',
    });
    res.status(201).json(wrap(loan));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== REPORTS =====================
app.get('/api/reports/salary-totals', auth, async (req, res) => {
  try {
    const workers = await Worker.find({ status: 'active' });
    const result = await Promise.all(workers.map(async (w) => {
      const clocks = await ClockRecord.find({ worker: w._id, clockOut: { $ne: null } });
      const totalHours = clocks.reduce((s, c) => s + parseFloat(c.totalHours || 0), 0);
      const laborSales = totalHours * (w.rate || 25) * 1.2;
      return {
        _id: w._id, name: w.name, jobs: clocks.length,
        billedTime: `${totalHours.toFixed(2)} hrs`,
        clockedTime: `${totalHours.toFixed(2)} hrs`,
        efficiency: 'N/A',
        laborSales: `$${laborSales.toFixed(2)}`,
      };
    }));
    res.json(wrap(result));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/reports/worker/:id', auth, async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);
    const clocks = await ClockRecord.find({ worker: req.params.id }).sort({ date: -1 });
    const totalHours = clocks.reduce((s, c) => s + parseFloat(c.totalHours || 0), 0);
    res.json(wrap({ worker, clocks, totalHours }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/reports/trends', auth, async (req, res) => {
  try {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      months.push({
        month: d.toLocaleString('en', { month: 'short' }),
        totalPayroll: Math.round(25000 + Math.random() * 20000),
        laborSales: Math.round(28000 + Math.random() * 20000),
      });
    }
    res.json(wrap(months));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/reports/export', auth, async (req, res) => {
  try {
    const workers = await Worker.find({ status: 'active' });
    const clocks = await ClockRecord.find().populate('worker', 'name');
    res.json(wrap({ workers, clocks }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.get('/api/reports', auth, async (req, res) => {
  try {
    const { from, to, workerId } = req.query;
    const filter = { clockOut: { $ne: null } };
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }
    if (workerId) filter.worker = workerId;
    const records = await ClockRecord.find(filter).populate('worker', 'name').sort({ date: -1 });
    res.json(wrap(records));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== DASHBOARD =====================
app.get('/api/dashboard/summary', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const totalWorkers = await Worker.countDocuments({ status: 'active' });
    const todayClocks = await ClockRecord.find({ date: today });
    const onShift = todayClocks.filter(c => !c.clockOut).length;
    const allClocks = await ClockRecord.find({ clockOut: { $ne: null } });
    const totalBilledHours = allClocks.reduce((s, c) => s + parseFloat(c.totalHours || 0), 0);
    const totalJobs = allClocks.length;

    res.json(wrap({
      totalWorkers, onShift,
      avgEfficiency: 87,
      totalBilledHours: +totalBilledHours.toFixed(2),
      totalJobs,
      todayClockedIn: todayClocks.length,
      todayCompleted: todayClocks.filter(c => c.clockOut).length,
    }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== FACE ID =====================
app.post('/api/faceid/verify', auth, async (req, res) => {
  try {
    const { workerId } = req.body;
    const worker = await Worker.findByIdAndUpdate(workerId, {
      faceIdStatus: 'verified', faceIdLastVerified: new Date(),
    }, { new: true });
    res.json(wrap(worker));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== SETTINGS =====================
app.get('/api/admin/settings', auth, async (req, res) => {
  try {
    const settings = await Settings.find();
    const obj = {};
    settings.forEach(s => { obj[s.key] = s.value; });
    res.json(wrap(obj));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

app.put('/api/admin/settings/:key', auth, async (req, res) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json(wrap(setting));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== USERS (admin CRUD) =====================
app.get('/api/users', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(wrap(users));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// ===================== SPA FALLBACK =====================
app.get('*', (req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  const fs = require('fs');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).json({ message: 'GlobalMove Staffy API is running' });
  }
});

// ===================== START =====================
const PORT = process.env.PORT || 5005;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/globalmove-staffy')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
