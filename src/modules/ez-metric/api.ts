import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============ MOCK DATA ============

const today = new Date().toISOString().split('T')[0];

const MOCK_WORKERS = [
  { _id: '1', name: 'Justin Naranjo', phone: '(555) 101-2001', position: 'Lead Technician', salaryType: 'Hourly', rate: 30, status: 'active', hours: 42.5, efficiency: 112, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:30:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '2', name: 'Emilio Rivera', phone: '(555) 101-2002', position: 'Technician', salaryType: 'Hourly', rate: 28, status: 'active', hours: 38.2, efficiency: 98, language: 'Spanish', clockIn: `${today}T06:30:00Z`, clockOut: `${today}T14:45:00Z`, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Fleet' },
  { _id: '3', name: 'Jeffrey Alvarez', phone: '(555) 101-2003', position: 'Technician', salaryType: 'Hourly', rate: 27, status: 'active', hours: 40.0, efficiency: 105, language: 'English', clockIn: `${today}T07:15:00Z`, clockOut: `${today}T16:00:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '4', name: 'Miguel Retana', phone: '(555) 101-2004', position: 'Senior Technician', salaryType: 'Percentage', rate: 35, status: 'active', hours: 45.3, efficiency: 95, language: 'Spanish', clockIn: `${today}T06:00:00Z`, clockOut: `${today}T15:45:00Z`, shiftPeriod: '6AM-4PM', type: 'Overtime', department: 'Fleet' },
  { _id: '5', name: 'Bernardo Grossi', phone: '(555) 101-2005', position: 'Technician', salaryType: 'Hourly', rate: 25, status: 'active', hours: 36.8, efficiency: 88, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: `${today}T12:18:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Office' },
  { _id: '6', name: 'Islam Abdullaev', phone: '(555) 101-2006', position: 'Technician', salaryType: 'Hourly', rate: 26, status: 'active', hours: 39.5, efficiency: 102, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:00:00Z`, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: '7', name: 'Carlos Mendez', phone: '(555) 101-2007', position: 'Apprentice', salaryType: 'Hourly', rate: 18, status: 'active', hours: 32.0, efficiency: 72, language: 'Spanish', clockIn: `${today}T08:00:00Z`, clockOut: null, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '8', name: 'David Kim', phone: '(555) 101-2008', position: 'Fleet Technician', salaryType: 'Flat', rate: 2400, status: 'inactive', hours: 0, efficiency: null, language: 'English', clockIn: null, clockOut: null, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '9', name: 'Alex Thompson', phone: '(555) 101-2009', position: 'Technician', salaryType: 'Hourly', rate: 27, status: 'active', hours: 41.0, efficiency: 110, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: null, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Fleet' },
  { _id: '10', name: 'Roberto Sanchez', phone: '(555) 101-2010', position: 'Technician', salaryType: 'Hourly', rate: 26, status: 'active', hours: 37.5, efficiency: 92, language: 'Spanish', clockIn: `${today}T07:30:00Z`, clockOut: `${today}T15:30:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Office' },
  { _id: '11', name: 'James Wilson', phone: '(555) 101-2011', position: 'Technician', salaryType: 'Hourly', rate: 25, status: 'active', hours: 34.0, efficiency: 85, language: 'English', clockIn: `${today}T08:15:00Z`, clockOut: `${today}T16:30:00Z`, shiftPeriod: '8AM-5PM', type: 'Overtime', department: 'Office' },
  { _id: '12', name: 'Marco Lopez', phone: '(555) 101-2012', position: 'Technician', salaryType: 'Hourly', rate: 28, status: 'active', hours: 43.0, efficiency: 108, language: 'Spanish', clockIn: `${today}T06:45:00Z`, clockOut: `${today}T15:30:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
];

const MOCK_DASHBOARD_SUMMARY = {
  totalWorkers: 12,
  todayClockedIn: 10,
  onShift: 8,
  avgEfficiency: 97,
  todayCompleted: 14,
  totalBilledHours: 428,
  totalJobs: 67,
};

// Helper to generate a date string N days ago
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

const MOCK_CLOCK_RECORDS_RAW = [
  // Today
  { _id: 'c1', worker: { name: 'Justin Naranjo' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:30:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 112, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c2', worker: { name: 'Emilio Rivera' }, date: `${today}T00:00:00Z`, clockIn: `${today}T06:30:00Z`, clockOut: `${today}T14:45:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 98, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Fleet' },
  { _id: 'c3', worker: { name: 'Jeffrey Alvarez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:15:00Z`, clockOut: `${today}T16:00:00Z`, totalHours: 8.75, status: 'auto', note: '', efficiency: 105, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c4', worker: { name: 'Miguel Retana' }, date: `${today}T00:00:00Z`, clockIn: `${today}T06:00:00Z`, clockOut: `${today}T15:45:00Z`, totalHours: 9.75, status: 'auto', note: '', efficiency: 95, shiftPeriod: '6AM-4PM', type: 'Overtime', department: 'Fleet' },
  { _id: 'c5', worker: { name: 'Bernardo Grossi' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: `${today}T12:18:00Z`, totalHours: 5.3, status: 'auto', note: '', efficiency: 88, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Office' },
  { _id: 'c6', worker: { name: 'Islam Abdullaev' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 102, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: 'c7', worker: { name: 'Carlos Mendez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T08:00:00Z`, clockOut: null, totalHours: null, status: 'auto', note: '', efficiency: null, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c8', worker: { name: 'Alex Thompson' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: null, totalHours: null, status: 'auto', note: '', efficiency: null, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Fleet' },
  { _id: 'c9', worker: { name: 'Roberto Sanchez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:30:00Z`, clockOut: `${today}T15:30:00Z`, totalHours: 8.0, status: 'manual', note: 'Adjusted by admin', efficiency: 92, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Office' },
  { _id: 'c10', worker: { name: 'Marco Lopez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T06:45:00Z`, clockOut: `${today}T15:30:00Z`, totalHours: 8.75, status: 'auto', note: '', efficiency: 108, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c40', worker: { name: 'James Wilson' }, date: `${today}T00:00:00Z`, clockIn: `${today}T08:15:00Z`, clockOut: `${today}T16:30:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 85, shiftPeriod: '8AM-5PM', type: 'Overtime', department: 'Office' },

  // 1 day ago
  { _id: 'c11', worker: { name: 'Justin Naranjo' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T07:00:00Z`, clockOut: `${daysAgo(1)}T15:30:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 110, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c12', worker: { name: 'Emilio Rivera' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T06:30:00Z`, clockOut: `${daysAgo(1)}T15:00:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 96, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Fleet' },
  { _id: 'c13', worker: { name: 'Jeffrey Alvarez' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T07:00:00Z`, clockOut: `${daysAgo(1)}T15:45:00Z`, totalHours: 8.75, status: 'auto', note: '', efficiency: 100, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c14', worker: { name: 'Miguel Retana' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T06:00:00Z`, clockOut: `${daysAgo(1)}T16:00:00Z`, totalHours: 10.0, status: 'auto', note: '', efficiency: 98, shiftPeriod: '6AM-4PM', type: 'Overtime', department: 'Fleet' },
  { _id: 'c15', worker: { name: 'Bernardo Grossi' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T07:00:00Z`, clockOut: `${daysAgo(1)}T15:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 91, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c16', worker: { name: 'Islam Abdullaev' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T07:15:00Z`, clockOut: `${daysAgo(1)}T15:15:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 99, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: 'c17', worker: { name: 'Carlos Mendez' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T08:00:00Z`, clockOut: `${daysAgo(1)}T16:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 74, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c18', worker: { name: 'Alex Thompson' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T07:00:00Z`, clockOut: `${daysAgo(1)}T15:30:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 108, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c19', worker: { name: 'Roberto Sanchez' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T07:30:00Z`, clockOut: `${daysAgo(1)}T15:30:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 90, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c20', worker: { name: 'Marco Lopez' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T06:45:00Z`, clockOut: `${daysAgo(1)}T15:15:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 105, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c41', worker: { name: 'James Wilson' }, date: `${daysAgo(1)}T00:00:00Z`, clockIn: `${daysAgo(1)}T08:00:00Z`, clockOut: `${daysAgo(1)}T16:15:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 82, shiftPeriod: '8AM-5PM', type: 'Normal', department: 'Office' },

  // 2 days ago
  { _id: 'c21', worker: { name: 'Justin Naranjo' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T07:00:00Z`, clockOut: `${daysAgo(2)}T16:00:00Z`, totalHours: 9.0, status: 'auto', note: '', efficiency: 115, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c22', worker: { name: 'Emilio Rivera' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T06:30:00Z`, clockOut: `${daysAgo(2)}T14:30:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 94, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Shop' },
  { _id: 'c23', worker: { name: 'Jeffrey Alvarez' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T07:15:00Z`, clockOut: `${daysAgo(2)}T15:30:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 102, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c24', worker: { name: 'Miguel Retana' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T06:00:00Z`, clockOut: `${daysAgo(2)}T15:30:00Z`, totalHours: 9.5, status: 'auto', note: '', efficiency: 92, shiftPeriod: '6AM-4PM', type: 'Normal', department: 'Fleet' },
  { _id: 'c25', worker: { name: 'Islam Abdullaev' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T07:00:00Z`, clockOut: `${daysAgo(2)}T15:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 104, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: 'c26', worker: { name: 'Carlos Mendez' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T08:00:00Z`, clockOut: `${daysAgo(2)}T15:30:00Z`, totalHours: 7.5, status: 'auto', note: '', efficiency: 70, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c27', worker: { name: 'Alex Thompson' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T07:00:00Z`, clockOut: `${daysAgo(2)}T16:00:00Z`, totalHours: 9.0, status: 'auto', note: '', efficiency: 112, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c28', worker: { name: 'Roberto Sanchez' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T07:30:00Z`, clockOut: `${daysAgo(2)}T15:00:00Z`, totalHours: 7.5, status: 'auto', note: '', efficiency: 88, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c29', worker: { name: 'Marco Lopez' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T06:45:00Z`, clockOut: `${daysAgo(2)}T15:45:00Z`, totalHours: 9.0, status: 'auto', note: '', efficiency: 110, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c42', worker: { name: 'James Wilson' }, date: `${daysAgo(2)}T00:00:00Z`, clockIn: `${daysAgo(2)}T08:15:00Z`, clockOut: `${daysAgo(2)}T16:45:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 87, shiftPeriod: '8AM-5PM', type: 'Normal', department: 'Office' },

  // 3 days ago
  { _id: 'c30', worker: { name: 'Justin Naranjo' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T07:00:00Z`, clockOut: `${daysAgo(3)}T15:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 108, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c31', worker: { name: 'Emilio Rivera' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T06:30:00Z`, clockOut: `${daysAgo(3)}T15:00:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 100, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Shop' },
  { _id: 'c32', worker: { name: 'Jeffrey Alvarez' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T07:00:00Z`, clockOut: `${daysAgo(3)}T16:00:00Z`, totalHours: 9.0, status: 'auto', note: '', efficiency: 107, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c33', worker: { name: 'Miguel Retana' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T06:00:00Z`, clockOut: `${daysAgo(3)}T15:00:00Z`, totalHours: 9.0, status: 'auto', note: '', efficiency: 90, shiftPeriod: '6AM-4PM', type: 'Normal', department: 'Fleet' },
  { _id: 'c34', worker: { name: 'Bernardo Grossi' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T07:00:00Z`, clockOut: `${daysAgo(3)}T14:30:00Z`, totalHours: 7.5, status: 'auto', note: '', efficiency: 85, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c35', worker: { name: 'Islam Abdullaev' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T07:00:00Z`, clockOut: `${daysAgo(3)}T15:30:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 106, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: 'c36', worker: { name: 'Alex Thompson' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T07:00:00Z`, clockOut: `${daysAgo(3)}T15:15:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 106, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c37', worker: { name: 'Roberto Sanchez' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T07:30:00Z`, clockOut: `${daysAgo(3)}T16:00:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 95, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c38', worker: { name: 'Marco Lopez' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T06:45:00Z`, clockOut: `${daysAgo(3)}T15:00:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 103, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c39', worker: { name: 'Carlos Mendez' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T08:00:00Z`, clockOut: `${daysAgo(3)}T15:00:00Z`, totalHours: 7.0, status: 'auto', note: '', efficiency: 68, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c43', worker: { name: 'James Wilson' }, date: `${daysAgo(3)}T00:00:00Z`, clockIn: `${daysAgo(3)}T08:00:00Z`, clockOut: `${daysAgo(3)}T16:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 80, shiftPeriod: '8AM-5PM', type: 'Normal', department: 'Office' },

  // 4 days ago
  { _id: 'c44', worker: { name: 'Justin Naranjo' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T07:00:00Z`, clockOut: `${daysAgo(4)}T15:45:00Z`, totalHours: 8.75, status: 'auto', note: '', efficiency: 114, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c45', worker: { name: 'Emilio Rivera' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T06:30:00Z`, clockOut: `${daysAgo(4)}T14:30:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 93, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Shop' },
  { _id: 'c46', worker: { name: 'Jeffrey Alvarez' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T07:15:00Z`, clockOut: `${daysAgo(4)}T15:45:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 103, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c47', worker: { name: 'Miguel Retana' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T06:00:00Z`, clockOut: `${daysAgo(4)}T15:30:00Z`, totalHours: 9.5, status: 'auto', note: '', efficiency: 97, shiftPeriod: '6AM-4PM', type: 'Normal', department: 'Fleet' },
  { _id: 'c48', worker: { name: 'Islam Abdullaev' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T07:00:00Z`, clockOut: `${daysAgo(4)}T14:45:00Z`, totalHours: 7.75, status: 'auto', note: '', efficiency: 97, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: 'c49', worker: { name: 'Carlos Mendez' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T08:00:00Z`, clockOut: `${daysAgo(4)}T15:45:00Z`, totalHours: 7.75, status: 'auto', note: '', efficiency: 75, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c50', worker: { name: 'Alex Thompson' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T07:00:00Z`, clockOut: `${daysAgo(4)}T15:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 105, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c51', worker: { name: 'Roberto Sanchez' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T07:30:00Z`, clockOut: `${daysAgo(4)}T15:30:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 94, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c52', worker: { name: 'Marco Lopez' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T06:45:00Z`, clockOut: `${daysAgo(4)}T15:30:00Z`, totalHours: 8.75, status: 'auto', note: '', efficiency: 111, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c53', worker: { name: 'James Wilson' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T08:15:00Z`, clockOut: `${daysAgo(4)}T16:30:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 83, shiftPeriod: '8AM-5PM', type: 'Overtime', department: 'Office' },
  { _id: 'c54', worker: { name: 'Bernardo Grossi' }, date: `${daysAgo(4)}T00:00:00Z`, clockIn: `${daysAgo(4)}T07:00:00Z`, clockOut: `${daysAgo(4)}T14:00:00Z`, totalHours: 7.0, status: 'auto', note: '', efficiency: 82, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
];

// Derive billedHours from totalHours and efficiency
const MOCK_CLOCK_RECORDS = MOCK_CLOCK_RECORDS_RAW.map((r) => ({
  ...r,
  billedHours: r.totalHours != null && r.efficiency != null
    ? Math.round(r.totalHours * (r.efficiency / 100) * 100) / 100
    : null,
}));

const MOCK_SHIFTS = [
  { _id: 's1', name: 'Morning Shift', startTime: '06:00', endTime: '14:00', breakMinutes: 30, totalHours: 7.5, color: '#FFAB00', active: true },
  { _id: 's2', name: 'Day Shift', startTime: '07:00', endTime: '16:00', breakMinutes: 60, totalHours: 8.0, color: '#2065D1', active: true },
  { _id: 's3', name: 'Full Day', startTime: '06:00', endTime: '17:00', breakMinutes: 60, totalHours: 10.0, color: '#7635DC', active: true },
  { _id: 's4', name: 'Evening Shift', startTime: '14:00', endTime: '22:00', breakMinutes: 30, totalHours: 7.5, color: '#22C55E', active: false },
];

const MOCK_EFFICIENCY: Array<{ _id: string; name: string; jobs: number; actualHours: number; billedHours: number; efficiency: number | null }> = [
  { _id: '1', name: 'Justin Naranjo', jobs: 8, actualHours: 42.5, billedHours: 47.6, efficiency: 112 },
  { _id: '2', name: 'Emilio Rivera', jobs: 6, actualHours: 38.2, billedHours: 37.4, efficiency: 98 },
  { _id: '3', name: 'Jeffrey Alvarez', jobs: 7, actualHours: 40.0, billedHours: 42.0, efficiency: 105 },
  { _id: '4', name: 'Miguel Retana', jobs: 9, actualHours: 45.3, billedHours: 43.0, efficiency: 95 },
  { _id: '5', name: 'Bernardo Grossi', jobs: 5, actualHours: 36.8, billedHours: 32.4, efficiency: 88 },
  { _id: '6', name: 'Islam Abdullaev', jobs: 7, actualHours: 39.5, billedHours: 40.3, efficiency: 102 },
  { _id: '7', name: 'Carlos Mendez', jobs: 4, actualHours: 32.0, billedHours: 23.0, efficiency: 72 },
  { _id: '9', name: 'Alex Thompson', jobs: 8, actualHours: 41.0, billedHours: 45.1, efficiency: 110 },
  { _id: '10', name: 'Roberto Sanchez', jobs: 6, actualHours: 37.5, billedHours: 34.5, efficiency: 92 },
  { _id: '11', name: 'James Wilson', jobs: 5, actualHours: 34.0, billedHours: 28.9, efficiency: 85 },
  { _id: '12', name: 'Marco Lopez', jobs: 7, actualHours: 43.0, billedHours: 46.4, efficiency: 108 },
  { _id: '8', name: 'David Kim', jobs: 0, actualHours: 0, billedHours: 0, efficiency: null },
];

const MOCK_BONUS_RULES: Array<{ _id: string; type: 'formula' | 'fixed'; minEfficiency: number; maxEfficiency: number; ratePerHour: number; fixedAmount: number; label: string; color: string }> = [
  { _id: 'br1', type: 'formula', minEfficiency: 90, maxEfficiency: 100, ratePerHour: 3, fixedAmount: 0, label: '90%-100%', color: '#FFAB00' },
  { _id: 'br2', type: 'formula', minEfficiency: 100, maxEfficiency: 110, ratePerHour: 3.5, fixedAmount: 0, label: '100%-110%', color: '#00B8D9' },
  { _id: 'br3', type: 'formula', minEfficiency: 110, maxEfficiency: 125, ratePerHour: 4, fixedAmount: 0, label: '110%-125%', color: '#22C55E' },
  { _id: 'br4', type: 'formula', minEfficiency: 125, maxEfficiency: 150, ratePerHour: 5, fixedAmount: 0, label: '125%-150%', color: '#7635DC' },
  { _id: 'br5', type: 'fixed', minEfficiency: 0, maxEfficiency: 90, ratePerHour: 0, fixedAmount: 0, label: 'Below 90%', color: '#FF5630' },
  { _id: 'br6', type: 'fixed', minEfficiency: 90, maxEfficiency: 100, ratePerHour: 0, fixedAmount: 50, label: '90%-100%', color: '#FFAB00' },
  { _id: 'br7', type: 'fixed', minEfficiency: 100, maxEfficiency: 125, ratePerHour: 0, fixedAmount: 100, label: '100%-125%', color: '#22C55E' },
  { _id: 'br8', type: 'fixed', minEfficiency: 125, maxEfficiency: 150, ratePerHour: 0, fixedAmount: 200, label: '125%+', color: '#7635DC' },
];

const MOCK_SALARY = [
  { _id: '1', name: 'Justin Naranjo', actualHours: 42.5, billedHours: 47.6, efficiency: '112%', bonus: 190.4, baseSalary: 1275.0, rate: 30, overtime: 37.5, charge: 0, totalPayroll: 1502.9, debtLeft: 0 },
  { _id: '2', name: 'Emilio Rivera', actualHours: 38.2, billedHours: 37.4, efficiency: '98%', bonus: 162.2, baseSalary: 1069.6, rate: 28, overtime: 0, charge: 0, totalPayroll: 1231.8, debtLeft: 500 },
  { _id: '3', name: 'Jeffrey Alvarez', actualHours: 40.0, billedHours: 42.0, efficiency: '105%', bonus: 197.0, baseSalary: 1080.0, rate: 27, overtime: 0, charge: 0, totalPayroll: 1277.0, debtLeft: 0 },
  { _id: '4', name: 'Miguel Retana', actualHours: 45.3, billedHours: 43.0, efficiency: '95%', bonus: 179.0, baseSalary: 1505.0, rate: 35, overtime: 92.75, charge: 5, totalPayroll: 1771.75, debtLeft: 200 },
  { _id: '5', name: 'Bernardo Grossi', actualHours: 36.8, billedHours: 32.4, efficiency: '88%', bonus: -12.5, baseSalary: 920.0, rate: 25, overtime: 0, charge: 12, totalPayroll: 895.5, debtLeft: 0 },
  { _id: '6', name: 'Islam Abdullaev', actualHours: 39.5, billedHours: 40.3, efficiency: '102%', bonus: 191.1, baseSalary: 1027.0, rate: 26, overtime: 0, charge: 0, totalPayroll: 1218.1, debtLeft: 0 },
  { _id: '7', name: 'Carlos Mendez', actualHours: 32.0, billedHours: 23.0, efficiency: '72%', bonus: -25.0, baseSalary: 576.0, rate: 18, overtime: 0, charge: 8, totalPayroll: 543.0, debtLeft: 300 },
  { _id: '8', name: 'David Kim', actualHours: 0, billedHours: 0, efficiency: 'N/A', bonus: 0, baseSalary: 2400.0, rate: 2400, overtime: 0, charge: 0, totalPayroll: 2400.0, debtLeft: 0 },
  { _id: '9', name: 'Alex Thompson', actualHours: 41.0, billedHours: 45.1, efficiency: '110%', bonus: 180.4, baseSalary: 1107.0, rate: 27, overtime: 13.5, charge: 0, totalPayroll: 1300.9, debtLeft: 0 },
  { _id: '10', name: 'Roberto Sanchez', actualHours: 37.5, billedHours: 34.5, efficiency: '92%', bonus: 153.5, baseSalary: 975.0, rate: 26, overtime: 0, charge: 0, totalPayroll: 1128.5, debtLeft: 150 },
  { _id: '11', name: 'James Wilson', actualHours: 34.0, billedHours: 28.9, efficiency: '85%', bonus: -18.0, baseSalary: 850.0, rate: 25, overtime: 0, charge: 5, totalPayroll: 827.0, debtLeft: 0 },
  { _id: '12', name: 'Marco Lopez', actualHours: 43.0, billedHours: 46.4, efficiency: '108%', bonus: 212.4, baseSalary: 1204.0, rate: 28, overtime: 42.0, charge: 0, totalPayroll: 1458.4, debtLeft: 0 },
];

const MOCK_LOANS = [
  { _id: 'l1', worker: { name: 'Emilio Rivera' }, type: 'Loan', amount: 1000, paid: 500, remaining: 500, date: '2026-02-15', status: 'active' },
  { _id: 'l2', worker: { name: 'Carlos Mendez' }, type: 'Loan', amount: 500, paid: 200, remaining: 300, date: '2026-03-01', status: 'active' },
  { _id: 'l3', worker: { name: 'Miguel Retana' }, type: 'Pre-payment', amount: 400, paid: 200, remaining: 200, date: '2026-03-10', status: 'active' },
  { _id: 'l4', worker: { name: 'Roberto Sanchez' }, type: 'Loan', amount: 300, paid: 150, remaining: 150, date: '2026-02-20', status: 'active' },
  { _id: 'l5', worker: { name: 'Justin Naranjo' }, type: 'Loan', amount: 800, paid: 800, remaining: 0, date: '2026-01-05', status: 'paid' },
];

const MOCK_REPORT_TOTALS = [
  { _id: '1', name: 'Justin Naranjo', jobs: 8, billedTime: '47.60 hrs', clockedTime: '42.50 hrs', efficiency: '112%', laborSales: '$5,712.00' },
  { _id: '2', name: 'Emilio Rivera', jobs: 6, billedTime: '37.40 hrs', clockedTime: '38.20 hrs', efficiency: '98%', laborSales: '$4,488.00' },
  { _id: '3', name: 'Jeffrey Alvarez', jobs: 7, billedTime: '42.00 hrs', clockedTime: '40.00 hrs', efficiency: '105%', laborSales: '$5,040.00' },
  { _id: '4', name: 'Miguel Retana', jobs: 9, billedTime: '43.00 hrs', clockedTime: '45.30 hrs', efficiency: '95%', laborSales: '$5,160.00' },
  { _id: '5', name: 'Bernardo Grossi', jobs: 5, billedTime: '32.40 hrs', clockedTime: '36.80 hrs', efficiency: '88%', laborSales: '$3,888.00' },
  { _id: '6', name: 'Islam Abdullaev', jobs: 7, billedTime: '40.30 hrs', clockedTime: '39.50 hrs', efficiency: '102%', laborSales: '$4,836.00' },
  { _id: '7', name: 'Carlos Mendez', jobs: 4, billedTime: '23.00 hrs', clockedTime: '32.00 hrs', efficiency: '72%', laborSales: '$2,760.00' },
  { _id: '9', name: 'Alex Thompson', jobs: 8, billedTime: '45.10 hrs', clockedTime: '41.00 hrs', efficiency: '110%', laborSales: '$5,412.00' },
  { _id: '10', name: 'Roberto Sanchez', jobs: 6, billedTime: '34.50 hrs', clockedTime: '37.50 hrs', efficiency: '92%', laborSales: '$4,140.00' },
  { _id: '11', name: 'James Wilson', jobs: 5, billedTime: '28.90 hrs', clockedTime: '34.00 hrs', efficiency: '85%', laborSales: '$3,468.00' },
  { _id: '12', name: 'Marco Lopez', jobs: 7, billedTime: '46.40 hrs', clockedTime: '43.00 hrs', efficiency: '108%', laborSales: '$5,568.00' },
];

const MOCK_REPORT_TRENDS = [
  { month: 'Oct', totalPayroll: 11200, laborSales: 38500 },
  { month: 'Nov', totalPayroll: 12400, laborSales: 41200 },
  { month: 'Dec', totalPayroll: 10800, laborSales: 36800 },
  { month: 'Jan', totalPayroll: 13100, laborSales: 44600 },
  { month: 'Feb', totalPayroll: 13800, laborSales: 47200 },
  { month: 'Mar', totalPayroll: 14554, laborSales: 50472 },
];

const MOCK_SETTINGS = [
  { key: 'companyName', value: 'EZ Metric' },
  { key: 'currency', value: 'USD' },
  { key: 'language', value: 'en' },
  { key: 'timezone', value: 'America/New_York' },
];

const MOCK_DEPARTMENTS: Array<{ _id: string; name: string; description: string; status: 'active' | 'inactive' }> = [
  { _id: 'dep1', name: 'Shop', description: 'Main repair shop', status: 'active' },
  { _id: 'dep2', name: 'Fleet', description: 'Fleet maintenance', status: 'active' },
  { _id: 'dep3', name: 'Office', description: 'Office and admin', status: 'active' },
];

// ============ DASHBOARD ============
export function useDashboardSummary() {
  return useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: async () => MOCK_DASHBOARD_SUMMARY,
  });
}

// ============ WORKERS ============
export function useWorkers() {
  return useQuery({
    queryKey: ['workers'],
    queryFn: async () => MOCK_WORKERS,
  });
}

export function useWorkerStatus() {
  return useQuery({
    queryKey: ['workers-status'],
    queryFn: async () => MOCK_WORKERS.filter((w) => w.status === 'active'),
  });
}

export function useCreateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const newWorker = { _id: `w${Date.now()}`, ...body, status: 'active', hours: 0, efficiency: null };
      MOCK_WORKERS.push(newWorker);
      return newWorker;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }),
  });
}

export function useUpdateWorker() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_WORKERS.findIndex((w) => w._id === id);
      if (idx >= 0) Object.assign(MOCK_WORKERS[idx], body);
      return MOCK_WORKERS[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workers'] }),
  });
}

// ============ CLOCK ============
export function useClockRecords(_date?: string) {
  return useQuery({
    queryKey: ['clock-records', _date],
    queryFn: async () => MOCK_CLOCK_RECORDS.map((r) => ({ ...r })),
  });
}

export function useClockIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => body,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clock-records'] });
      qc.invalidateQueries({ queryKey: ['workers-status'] });
    },
  });
}

export function useClockOut() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => body,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['clock-records'] });
      qc.invalidateQueries({ queryKey: ['workers-status'] });
    },
  });
}

export function useUpdateClockRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_CLOCK_RECORDS.findIndex((r) => r._id === id);
      if (idx >= 0) Object.assign(MOCK_CLOCK_RECORDS[idx], body);
      return MOCK_CLOCK_RECORDS[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clock-records'] }),
  });
}

// ============ SHIFTS ============
export function useShifts() {
  return useQuery({
    queryKey: ['shifts'],
    queryFn: async () => MOCK_SHIFTS,
  });
}

export function useCreateShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const newShift = { _id: `s${Date.now()}`, ...body, active: true, totalHours: 8 };
      MOCK_SHIFTS.push(newShift);
      return newShift;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shifts'] }),
  });
}

export function useDeleteShift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const idx = MOCK_SHIFTS.findIndex((s) => s._id === id);
      if (idx >= 0) MOCK_SHIFTS.splice(idx, 1);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['shifts'] }),
  });
}

// ============ EFFICIENCY ============
export function useEfficiency() {
  return useQuery({
    queryKey: ['efficiency'],
    queryFn: async () => MOCK_EFFICIENCY,
  });
}

// Generate ~50 days of daily clock/efficiency records per active worker
const WORKER_META: Record<string, { name: string; department: string; billedHours: number }> = {
  '1':  { name: 'Justin Naranjo',   department: 'Shop',   billedHours: 8 },
  '2':  { name: 'Emilio Rivera',    department: 'Fleet',  billedHours: 9 },
  '3':  { name: 'Jeffrey Alvarez',  department: 'Shop',   billedHours: 8 },
  '4':  { name: 'Miguel Retana',    department: 'Fleet',  billedHours: 9 },
  '5':  { name: 'Bernardo Grossi',  department: 'Office', billedHours: 8 },
  '6':  { name: 'Islam Abdullaev',  department: 'Office', billedHours: 8 },
  '7':  { name: 'Carlos Mendez',    department: 'Shop',   billedHours: 8 },
  '9':  { name: 'Alex Thompson',    department: 'Fleet',  billedHours: 9 },
  '10': { name: 'Roberto Sanchez',  department: 'Office', billedHours: 8 },
  '11': { name: 'James Wilson',     department: 'Office', billedHours: 8 },
  '12': { name: 'Marco Lopez',      department: 'Shop',   billedHours: 8 },
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateDailyRecords() {
  const records: Array<{
    workerId: string;
    workerName: string;
    department: string;
    date: string;
    clockIn: string;
    clockOut: string;
    efficiency: number;
    actualHours: number;
    billedHours: number;
  }> = [];

  const baseDate = new Date(today);
  const workerIds = Object.keys(WORKER_META);

  for (let dayOffset = 0; dayOffset < 50; dayOffset += 1) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - dayOffset);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();

    // Skip Sundays
    if (dayOfWeek !== 0) {
      workerIds.forEach((wId, wIdx) => {
        const seed = dayOffset * 100 + wIdx;
        const rand = seededRandom(seed);
        const meta = WORKER_META[wId];

        // ~15% chance worker is absent on any given day
        if (rand < 0.15) return;

        const baseHour = 6 + Math.floor(seededRandom(seed + 1) * 3); // 6-8
        const baseMin = Math.floor(seededRandom(seed + 2) * 4) * 15; // 0,15,30,45
        const shiftLen = 7.5 + seededRandom(seed + 3) * 2.5; // 7.5-10 hours
        const outHour = baseHour + Math.floor(shiftLen);
        const outMin = Math.floor((shiftLen % 1) * 60);
        const eff = Math.round(65 + seededRandom(seed + 4) * 55); // 65-120
        const actualHrs = Math.round((shiftLen + Number.EPSILON) * 100) / 100;

        const pad = (n: number) => String(n).padStart(2, '0');

        records.push({
          workerId: wId,
          workerName: meta.name,
          department: meta.department,
          date: dateStr,
          clockIn: `${pad(baseHour)}:${pad(baseMin)} AM`,
          clockOut: `${pad(outHour > 12 ? outHour - 12 : outHour)}:${pad(outMin)} PM`,
          efficiency: eff,
          actualHours: actualHrs,
          billedHours: meta.billedHours,
        });
      });
    }
  }

  return records;
}

const MOCK_DAILY_EFFICIENCY = generateDailyRecords();

export function useEfficiencyHistory() {
  return useQuery({
    queryKey: ['efficiency-history'],
    queryFn: async () => MOCK_DAILY_EFFICIENCY,
  });
}

// ============ BONUS RULES ============
export function useBonusRules() {
  return useQuery({
    queryKey: ['bonus-rules'],
    queryFn: async () => MOCK_BONUS_RULES,
  });
}

export function useCreateBonusRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const newRule = { _id: `br${Date.now()}`, ...body };
      MOCK_BONUS_RULES.push(newRule);
      return newRule;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bonus-rules'] }),
  });
}

export function useUpdateBonusRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_BONUS_RULES.findIndex((r) => r._id === id);
      if (idx >= 0) Object.assign(MOCK_BONUS_RULES[idx], body);
      return MOCK_BONUS_RULES[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bonus-rules'] }),
  });
}

export function useDeleteBonusRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const idx = MOCK_BONUS_RULES.findIndex((r) => r._id === id);
      if (idx >= 0) MOCK_BONUS_RULES.splice(idx, 1);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bonus-rules'] }),
  });
}

// ============ DEPARTMENTS ============
export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => MOCK_DEPARTMENTS,
  });
}

export function useCreateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { name: string; description: string }) => {
      const newDep = { _id: `dep${Date.now()}`, ...body, status: 'active' as const };
      MOCK_DEPARTMENTS.push(newDep);
      return newDep;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useUpdateDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_DEPARTMENTS.findIndex((d) => d._id === id);
      if (idx >= 0) Object.assign(MOCK_DEPARTMENTS[idx], body);
      return MOCK_DEPARTMENTS[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

export function useDeleteDepartment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const idx = MOCK_DEPARTMENTS.findIndex((d) => d._id === id);
      if (idx >= 0) MOCK_DEPARTMENTS.splice(idx, 1);
      return id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['departments'] }),
  });
}

// ============ SALARY ============
export function useSalary() {
  return useQuery({
    queryKey: ['salary'],
    queryFn: async () => MOCK_SALARY,
  });
}

export function useUpdateSalary() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_SALARY.findIndex((s) => s._id === id);
      if (idx >= 0) Object.assign(MOCK_SALARY[idx], body);
      return MOCK_SALARY[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salary'] }),
  });
}

export function useSalaryRates() {
  return useQuery({
    queryKey: ['salary-rates'],
    queryFn: async () => [],
  });
}

// ============ SALARY TYPES ============
const MOCK_SALARY_TYPES = [
  { _id: 'st1', name: 'Standard Hourly', type: 'hourly' as const, salaryValue: 25, workersCount: 7, status: 'active' },
  { _id: 'st2', name: 'Senior Hourly', type: 'hourly' as const, salaryValue: 30, workersCount: 3, status: 'active' },
  { _id: 'st3', name: 'Project Percentage', type: 'percentage' as const, salaryValue: 35, workersCount: 1, status: 'active' },
  { _id: 'st4', name: 'Monthly Flat', type: 'flat' as const, salaryValue: 2400, workersCount: 1, status: 'active' },
  { _id: 'st5', name: 'Intern Hourly', type: 'hourly' as const, salaryValue: 18, workersCount: 0, status: 'inactive' },
];

export function useSalaryTypes() {
  return useQuery({
    queryKey: ['salary-types'],
    queryFn: async () => MOCK_SALARY_TYPES,
  });
}

export function useSalaryTypeDetail(typeId: string) {
  return useQuery({
    queryKey: ['salary-type-detail', typeId],
    queryFn: async () => {
      const salaryType = MOCK_SALARY_TYPES.find((st) => st._id === typeId);
      if (!salaryType) return null;
      const workers = MOCK_WORKERS.filter(
        (w) => w.salaryType.toLowerCase() === salaryType.type
      );
      return { ...salaryType, workers };
    },
    enabled: !!typeId,
  });
}

export function useCreateSalaryType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const newType = { _id: `st${Date.now()}`, ...body, workersCount: 0, status: 'active' };
      MOCK_SALARY_TYPES.push(newType);
      return newType;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salary-types'] }),
  });
}

export function useUpdateSalaryType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_SALARY_TYPES.findIndex((st) => st._id === id);
      if (idx >= 0) Object.assign(MOCK_SALARY_TYPES[idx], body);
      return MOCK_SALARY_TYPES[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salary-types'] }),
  });
}

export function useDeleteSalaryType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const idx = MOCK_SALARY_TYPES.findIndex((st) => st._id === id);
      if (idx >= 0) MOCK_SALARY_TYPES.splice(idx, 1);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['salary-types'] }),
  });
}

// ============ OVERTIME ============
const MOCK_OVERTIME_RECORDS = [
  { _id: 'ot1', workerId: '1', name: 'Justin Naranjo', salaryType: 'Hourly', overtimeHours: 2.5, bonusAmount: 75.00, status: 'Calculated', period: '2026-03' },
  { _id: 'ot2', workerId: '2', name: 'Emilio Rivera', salaryType: 'Hourly', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot3', workerId: '3', name: 'Jeffrey Alvarez', salaryType: 'Hourly', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot4', workerId: '4', name: 'Miguel Retana', salaryType: 'Percentage', overtimeHours: 5.3, bonusAmount: 185.50, status: 'Calculated', period: '2026-03' },
  { _id: 'ot5', workerId: '5', name: 'Bernardo Grossi', salaryType: 'Hourly', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot6', workerId: '6', name: 'Islam Abdullaev', salaryType: 'Hourly', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot7', workerId: '7', name: 'Carlos Mendez', salaryType: 'Hourly', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot8', workerId: '8', name: 'David Kim', salaryType: 'Flat', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot9', workerId: '9', name: 'Alex Thompson', salaryType: 'Hourly', overtimeHours: 1.0, bonusAmount: 27.00, status: 'Calculated', period: '2026-03' },
  { _id: 'ot10', workerId: '10', name: 'Roberto Sanchez', salaryType: 'Hourly', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot11', workerId: '11', name: 'James Wilson', salaryType: 'Hourly', overtimeHours: 0, bonusAmount: 0, status: 'No overtime', period: '2026-03' },
  { _id: 'ot12', workerId: '12', name: 'Marco Lopez', salaryType: 'Hourly', overtimeHours: 3.0, bonusAmount: 84.00, status: 'Calculated', period: '2026-03' },
  { _id: 'ot13', workerId: '1', name: 'Justin Naranjo', salaryType: 'Hourly', overtimeHours: 4.0, bonusAmount: 120.00, status: 'Calculated', period: '2026-02' },
  { _id: 'ot14', workerId: '4', name: 'Miguel Retana', salaryType: 'Percentage', overtimeHours: 3.5, bonusAmount: 122.50, status: 'Calculated', period: '2026-02' },
  { _id: 'ot15', workerId: '12', name: 'Marco Lopez', salaryType: 'Hourly', overtimeHours: 1.5, bonusAmount: 42.00, status: 'Calculated', period: '2026-02' },
];

export function useOvertimeRecords(period?: string) {
  return useQuery({
    queryKey: ['overtime-records', period],
    queryFn: async () =>
      period
        ? MOCK_OVERTIME_RECORDS.filter((r) => r.period === period)
        : MOCK_OVERTIME_RECORDS,
  });
}

export function useUpdateOvertime() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_OVERTIME_RECORDS.findIndex((r) => r._id === id);
      if (idx >= 0) Object.assign(MOCK_OVERTIME_RECORDS[idx], body);
      return MOCK_OVERTIME_RECORDS[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['overtime-records'] }),
  });
}

// ============ CHARGE TYPES ============
const MOCK_CHARGE_TYPES = [
  { _id: 'ct1', name: 'Late Penalty', chargeType: 'Deduction' as const, defaultAmount: 50, status: 'active' },
  { _id: 'ct2', name: 'Loan Repayment', chargeType: 'Deduction' as const, defaultAmount: null, status: 'active' },
  { _id: 'ct3', name: 'Prepayment', chargeType: 'Advance' as const, defaultAmount: null, status: 'active' },
  { _id: 'ct4', name: 'Uniform Fee', chargeType: 'Deduction' as const, defaultAmount: 30, status: 'active' },
  { _id: 'ct5', name: 'Tool Replacement', chargeType: 'Deduction' as const, defaultAmount: null, status: 'inactive' },
];

export function useChargeTypes() {
  return useQuery({
    queryKey: ['charge-types'],
    queryFn: async () => MOCK_CHARGE_TYPES,
  });
}

export function useCreateChargeType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const newType = { _id: `ct${Date.now()}`, ...body, status: 'active' };
      MOCK_CHARGE_TYPES.push(newType);
      return newType;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['charge-types'] }),
  });
}

export function useUpdateChargeType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_CHARGE_TYPES.findIndex((ct) => ct._id === id);
      if (idx >= 0) Object.assign(MOCK_CHARGE_TYPES[idx], body);
      return MOCK_CHARGE_TYPES[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['charge-types'] }),
  });
}

export function useDeleteChargeType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const idx = MOCK_CHARGE_TYPES.findIndex((ct) => ct._id === id);
      if (idx >= 0) MOCK_CHARGE_TYPES.splice(idx, 1);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['charge-types'] }),
  });
}

// ============ CHARGED EMPLOYEES ============
const MOCK_CHARGED_EMPLOYEES = [
  { _id: 'ce1', workerId: '1', employee: 'Justin Naranjo', chargeType: 'Late Penalty', chargeCategory: 'Deduction', amount: 50, date: '2026-03-05', note: 'Late 10 min', period: '2026-03' },
  { _id: 'ce2', workerId: '2', employee: 'Emilio Rivera', chargeType: 'Loan Repayment', chargeCategory: 'Deduction', amount: 200, date: '2026-03-01', note: 'Monthly installment', period: '2026-03' },
  { _id: 'ce3', workerId: '2', employee: 'Emilio Rivera', chargeType: 'Late Penalty', chargeCategory: 'Deduction', amount: 50, date: '2026-03-15', note: '', period: '2026-03' },
  { _id: 'ce4', workerId: '3', employee: 'Jeffrey Alvarez', chargeType: 'Prepayment', chargeCategory: 'Advance', amount: 100, date: '2026-03-10', note: 'Salary advance', period: '2026-03' },
  { _id: 'ce5', workerId: '7', employee: 'Carlos Mendez', chargeType: 'Uniform Fee', chargeCategory: 'Deduction', amount: 30, date: '2026-03-01', note: 'New uniform', period: '2026-03' },
  { _id: 'ce6', workerId: '4', employee: 'Miguel Retana', chargeType: 'Loan Repayment', chargeCategory: 'Deduction', amount: 200, date: '2026-03-01', note: 'Monthly installment', period: '2026-03' },
  { _id: 'ce7', workerId: '10', employee: 'Roberto Sanchez', chargeType: 'Loan Repayment', chargeCategory: 'Deduction', amount: 150, date: '2026-03-01', note: 'Monthly installment', period: '2026-03' },
  { _id: 'ce8', workerId: '1', employee: 'Justin Naranjo', chargeType: 'Late Penalty', chargeCategory: 'Deduction', amount: 50, date: '2026-02-12', note: '', period: '2026-02' },
  { _id: 'ce9', workerId: '2', employee: 'Emilio Rivera', chargeType: 'Loan Repayment', chargeCategory: 'Deduction', amount: 200, date: '2026-02-01', note: 'Monthly installment', period: '2026-02' },
  { _id: 'ce10', workerId: '5', employee: 'Bernardo Grossi', chargeType: 'Prepayment', chargeCategory: 'Advance', amount: 150, date: '2026-02-20', note: 'Emergency advance', period: '2026-02' },
];

export function useChargedEmployees(period?: string) {
  return useQuery({
    queryKey: ['charged-employees', period],
    queryFn: async () =>
      period
        ? MOCK_CHARGED_EMPLOYEES.filter((ce) => ce.period === period)
        : MOCK_CHARGED_EMPLOYEES,
  });
}

export function useCreateCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const worker = MOCK_WORKERS.find((w) => w._id === body.workerId);
      const chargeType = MOCK_CHARGE_TYPES.find((ct) => ct.name === body.chargeType);
      const newCharge = {
        _id: `ce${Date.now()}`,
        workerId: body.workerId,
        employee: worker?.name || 'Unknown',
        chargeType: body.chargeType,
        chargeCategory: chargeType?.chargeType || 'Deduction',
        amount: body.amount,
        date: body.date || new Date().toISOString().split('T')[0],
        note: body.note || '',
        period: body.date ? body.date.substring(0, 7) : new Date().toISOString().substring(0, 7),
      };
      MOCK_CHARGED_EMPLOYEES.push(newCharge);
      return newCharge;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['charged-employees'] });
      qc.invalidateQueries({ queryKey: ['salary'] });
    },
  });
}

export function useUpdateCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: any }) => {
      const idx = MOCK_CHARGED_EMPLOYEES.findIndex((ce) => ce._id === id);
      if (idx >= 0) Object.assign(MOCK_CHARGED_EMPLOYEES[idx], body);
      return MOCK_CHARGED_EMPLOYEES[idx];
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['charged-employees'] }),
  });
}

export function useDeleteCharge() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const idx = MOCK_CHARGED_EMPLOYEES.findIndex((ce) => ce._id === id);
      if (idx >= 0) MOCK_CHARGED_EMPLOYEES.splice(idx, 1);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['charged-employees'] }),
  });
}

// ============ LOANS ============
export function useLoans() {
  return useQuery({
    queryKey: ['loans'],
    queryFn: async () => MOCK_LOANS,
  });
}

export function useCreateLoan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const worker = MOCK_WORKERS.find((w) => w._id === body.worker);
      const newLoan = {
        _id: `l${Date.now()}`,
        worker: { name: worker?.name || 'Unknown' },
        type: body.type === 'loan' ? 'Loan' : 'Pre-payment',
        amount: body.amount,
        paid: 0,
        remaining: body.amount,
        date: new Date().toISOString().split('T')[0],
        status: 'active',
      };
      MOCK_LOANS.push(newLoan);
      return newLoan;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['loans'] });
      qc.invalidateQueries({ queryKey: ['salary'] });
    },
  });
}

// ============ REPORTS ============
export function useReportTotals() {
  return useQuery({
    queryKey: ['report-totals'],
    queryFn: async () => MOCK_REPORT_TOTALS,
  });
}

export function useReportTrends() {
  return useQuery({
    queryKey: ['report-trends'],
    queryFn: async () => MOCK_REPORT_TRENDS,
  });
}

// ============ SETTINGS ============
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => MOCK_SETTINGS,
  });
}

export function useUpdateSetting() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const idx = MOCK_SETTINGS.findIndex((s) => s.key === key);
      if (idx >= 0) MOCK_SETTINGS[idx].value = value;
      return { key, value };
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
}

