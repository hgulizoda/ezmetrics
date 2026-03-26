const mongoose = require('mongoose');

// ---------- USER (admin/manager) ----------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager'], default: 'admin' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// ---------- WORKER ----------
const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  position: { type: String, default: 'Technician' },
  salaryType: { type: String, enum: ['Hourly', 'Percentage', 'Flat'], default: 'Hourly' },
  rate: { type: Number, default: 25 },
  language: { type: String, default: 'English' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  photo: { type: String, default: '' },
  faceIdStatus: { type: String, enum: ['verified', 'pending', 'not_verified'], default: 'not_verified' },
  faceIdLastVerified: { type: Date, default: null },
}, { timestamps: true });

// ---------- SHIFT ----------
const shiftSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  breakMinutes: { type: Number, default: 60 },
  totalHours: { type: Number, default: 8 },
  overtimeThreshold: { type: Number, default: 8 },
  color: { type: String, default: '#2065D1' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// ---------- CLOCK RECORD ----------
const clockRecordSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  clockIn: { type: Date, required: true },
  clockOut: { type: Date, default: null },
  totalHours: { type: Number, default: 0 },
  status: { type: String, enum: ['auto', 'manual'], default: 'auto' },
  note: { type: String, default: '' },
  shift: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', default: null },
}, { timestamps: true });

// ---------- BONUS RULE ----------
const bonusRuleSchema = new mongoose.Schema({
  type: { type: String, enum: ['formula', 'fixed'], required: true },
  minEfficiency: { type: Number, required: true },
  maxEfficiency: { type: Number, required: true },
  ratePerHour: { type: Number, default: 0 },
  fixedAmount: { type: Number, default: 0 },
  label: { type: String, default: '' },
  color: { type: String, default: '#2065D1' },
}, { timestamps: true });

// ---------- SALARY RECORD ----------
const salaryRecordSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  period: { type: String, required: true }, // e.g. "2026-W12" or "2026-03"
  actualHours: { type: Number, default: 0 },
  billedHours: { type: Number, default: 0 },
  efficiency: { type: Number, default: 0 },
  baseSalary: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  overtime: { type: Number, default: 0 },
  lateDeduction: { type: Number, default: 0 },
  chargeDeduction: { type: Number, default: 0 },
  totalPayroll: { type: Number, default: 0 },
  overrideAmount: { type: Number, default: null },
  overrideReason: { type: String, default: '' },
}, { timestamps: true });

// ---------- LOAN ----------
const loanSchema = new mongoose.Schema({
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  type: { type: String, enum: ['Loan', 'Pre-payment'], required: true },
  amount: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  remaining: { type: Number, required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['active', 'paid'], default: 'active' },
  notes: { type: String, default: '' },
}, { timestamps: true });

// ---------- SYSTEM SETTINGS ----------
const settingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Worker: mongoose.model('Worker', workerSchema),
  Shift: mongoose.model('Shift', shiftSchema),
  ClockRecord: mongoose.model('ClockRecord', clockRecordSchema),
  BonusRule: mongoose.model('BonusRule', bonusRuleSchema),
  SalaryRecord: mongoose.model('SalaryRecord', salaryRecordSchema),
  Loan: mongoose.model('Loan', loanSchema),
  Settings: mongoose.model('Settings', settingsSchema),
};
