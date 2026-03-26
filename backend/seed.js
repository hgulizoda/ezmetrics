require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, Worker, Shift, ClockRecord, BonusRule, Loan, Settings } = require('./models');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/globalmove-staffy');
  console.log('Connected to MongoDB, seeding...');

  // Clear all
  await Promise.all([
    User.deleteMany({}), Worker.deleteMany({}), Shift.deleteMany({}),
    ClockRecord.deleteMany({}), BonusRule.deleteMany({}), Loan.deleteMany({}), Settings.deleteMany({}),
  ]);

  // Admin user
  const hash = await bcrypt.hash('admin123', 10);
  await User.create({ email: 'admin@globalmove.com', password: hash, name: 'Admin', role: 'admin' });
  console.log('Admin created: admin@globalmove.com / admin123');

  // Workers
  const workersData = [
    { name: 'Bernardo Grossi', phone: '+1 555-0101', position: 'Junior Technician', salaryType: 'Hourly', rate: 30, language: 'English', faceIdStatus: 'pending' },
    { name: 'Guelo Retana', phone: '+1 555-0102', position: 'Technician', salaryType: 'Hourly', rate: 27, language: 'Spanish', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
    { name: 'Justin Naranjo', phone: '+1 555-0103', position: 'Senior Technician', salaryType: 'Hourly', rate: 25, language: 'English', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
    { name: 'Emilio Rivera', phone: '+1 555-0104', position: 'Technician', salaryType: 'Percentage', rate: 35, language: 'Spanish', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
    { name: 'Jeffrey Alvarez', phone: '+1 555-0105', position: 'Technician', salaryType: 'Hourly', rate: 27, language: 'English', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
    { name: 'Jesus Garcia', phone: '+1 555-0106', position: 'Technician', salaryType: 'Flat', rate: 2400, language: 'Spanish', faceIdStatus: 'not_verified' },
    { name: 'Ernesto Quesada', phone: '+1 555-0107', position: 'Technician', salaryType: 'Hourly', rate: 25, language: 'Spanish', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
    { name: 'Jose Retana', phone: '+1 555-0108', position: 'Technician', salaryType: 'Hourly', rate: 27, language: 'Spanish', status: 'active', faceIdStatus: 'not_verified' },
    { name: 'Islam A', phone: '+1 555-0109', position: 'Technician', salaryType: 'Hourly', rate: 28, language: 'English', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
    { name: 'Miguel Retana', phone: '+1 555-0110', position: 'Lead Technician', salaryType: 'Hourly', rate: 30, language: 'Spanish', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
    { name: 'Josue Delgado', phone: '+1 555-0111', position: 'Technician', salaryType: 'Hourly', rate: 25, language: 'Spanish', faceIdStatus: 'pending' },
    { name: 'Arslon Sher', phone: '+1 555-0112', position: 'Junior Technician', salaryType: 'Hourly', rate: 22, language: 'English', faceIdStatus: 'pending' },
    { name: 'Suorob Suyunov', phone: '+1 555-0113', position: 'Technician', salaryType: 'Hourly', rate: 26, language: 'Uzbek', faceIdStatus: 'verified', faceIdLastVerified: new Date() },
  ];
  const workers = await Worker.insertMany(workersData);
  console.log(`${workers.length} workers created`);

  // Shifts
  const shifts = await Shift.insertMany([
    { name: 'Morning Shift', startTime: '06:00', endTime: '14:00', breakMinutes: 30, totalHours: 7.5, color: '#FFAB00' },
    { name: 'Day Shift', startTime: '07:00', endTime: '16:00', breakMinutes: 60, totalHours: 8.0, color: '#2065D1' },
    { name: 'Evening Shift', startTime: '14:00', endTime: '22:00', breakMinutes: 30, totalHours: 7.5, color: '#7635DC' },
    { name: 'Full Day', startTime: '06:00', endTime: '18:00', breakMinutes: 60, totalHours: 11.0, color: '#22C55E' },
  ]);
  console.log(`${shifts.length} shifts created`);

  // Clock records - generate 2 weeks of data
  const clockRecords = [];
  for (let dayOffset = 13; dayOffset >= 0; dayOffset--) {
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    if (d.getDay() === 0) continue; // skip Sundays
    const dateStr = d.toISOString().split('T')[0];

    for (const w of workers) {
      if (Math.random() < 0.15) continue; // 15% chance of absence
      const startHour = 6 + Math.floor(Math.random() * 2);
      const startMin = Math.floor(Math.random() * 30);
      const clockIn = new Date(d);
      clockIn.setHours(startHour, startMin, 0, 0);

      const hoursWorked = 7 + Math.random() * 3;
      const clockOut = new Date(clockIn.getTime() + hoursWorked * 3600000);

      clockRecords.push({
        worker: w._id, date: dateStr, clockIn, clockOut,
        totalHours: hoursWorked.toFixed(2),
        status: Math.random() < 0.9 ? 'auto' : 'manual',
        note: Math.random() < 0.1 ? 'Manual correction by admin' : '',
      });
    }
  }
  // Today - some still active (no clockOut)
  const today = new Date().toISOString().split('T')[0];
  for (let i = 0; i < 5 && i < workers.length; i++) {
    const clockIn = new Date();
    clockIn.setHours(7, Math.floor(Math.random() * 30), 0, 0);
    clockRecords.push({
      worker: workers[i]._id, date: today, clockIn,
      clockOut: null, totalHours: 0, status: 'auto',
    });
  }
  await ClockRecord.insertMany(clockRecords);
  console.log(`${clockRecords.length} clock records created`);

  // Bonus rules - Formula based
  await BonusRule.insertMany([
    { type: 'formula', minEfficiency: 0, maxEfficiency: 90, ratePerHour: 0, fixedAmount: 0, label: 'Below 90%', color: '#FF5630' },
    { type: 'formula', minEfficiency: 90, maxEfficiency: 100, ratePerHour: 3, fixedAmount: 0, label: '90%-100%', color: '#FFAB00' },
    { type: 'formula', minEfficiency: 100, maxEfficiency: 110, ratePerHour: 3.5, fixedAmount: 0, label: '100%-110%', color: '#00B8D9' },
    { type: 'formula', minEfficiency: 110, maxEfficiency: 125, ratePerHour: 4, fixedAmount: 0, label: '110%-125%', color: '#22C55E' },
    { type: 'formula', minEfficiency: 125, maxEfficiency: 999, ratePerHour: 5, fixedAmount: 0, label: 'Above 125%', color: '#7635DC' },
    // Fixed bonus
    { type: 'fixed', minEfficiency: 0, maxEfficiency: 85, ratePerHour: 0, fixedAmount: 0, label: 'Below 85%', color: '#FF5630' },
    { type: 'fixed', minEfficiency: 85, maxEfficiency: 90, ratePerHour: 0, fixedAmount: 250, label: '85%-90%', color: '#FFAB00' },
    { type: 'fixed', minEfficiency: 90, maxEfficiency: 95, ratePerHour: 0, fixedAmount: 500, label: '90%-95%', color: '#00B8D9' },
    { type: 'fixed', minEfficiency: 95, maxEfficiency: 100, ratePerHour: 0, fixedAmount: 1000, label: '95%-100%', color: '#2065D1' },
    { type: 'fixed', minEfficiency: 100, maxEfficiency: 110, ratePerHour: 0, fixedAmount: 1500, label: '100%-110%', color: '#22C55E' },
    { type: 'fixed', minEfficiency: 110, maxEfficiency: 999, ratePerHour: 0, fixedAmount: 2000, label: 'Above 110%', color: '#7635DC' },
  ]);
  console.log('Bonus rules created');

  // Loans
  await Loan.insertMany([
    { worker: workers[1]._id, type: 'Loan', amount: 3000, paid: 900, remaining: 2100, date: '2026-02-15' },
    { worker: workers[2]._id, type: 'Pre-payment', amount: 650, paid: 200, remaining: 450, date: '2026-03-01' },
    { worker: workers[3]._id, type: 'Loan', amount: 1500, paid: 1500, remaining: 0, date: '2026-01-10', status: 'paid' },
  ]);
  console.log('Loans created');

  // Settings
  await Settings.insertMany([
    { key: 'companyName', value: 'GlobalMove Staffy' },
    { key: 'currency', value: 'USD' },
    { key: 'language', value: 'en' },
    { key: 'timezone', value: 'America/New_York' },
    { key: 'gracePeriodMinutes', value: 5 },
    { key: 'latePenaltyPerMinute', value: 1 },
    { key: 'overtimeMultiplier', value: 1.5 },
    { key: 'payPeriod', value: 'weekly' },
    { key: 'autoClockOutHours', value: 12 },
    { key: 'requireFaceId', value: true },
  ]);
  console.log('Settings created');

  console.log('\nSeed complete! You can now login with:');
  console.log('  Email: admin@globalmove.com');
  console.log('  Password: admin123');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
