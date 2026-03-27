import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// ============ MOCK DATA ============

const today = new Date().toISOString().split('T')[0];

const MOCK_WORKERS = [
  { _id: '1', name: 'Justin Naranjo', phone: '(555) 101-2001', position: 'Lead Technician', salaryType: 'Hourly', rate: 30, status: 'active', hours: 42.5, efficiency: 112, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:30:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '2', name: 'Emilio Rivera', phone: '(555) 101-2002', position: 'Technician', salaryType: 'Hourly', rate: 28, status: 'active', hours: 38.2, efficiency: 98, language: 'Spanish', clockIn: `${today}T06:30:00Z`, clockOut: `${today}T14:45:00Z`, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Shop' },
  { _id: '3', name: 'Jeffrey Alvarez', phone: '(555) 101-2003', position: 'Technician', salaryType: 'Hourly', rate: 27, status: 'active', hours: 40.0, efficiency: 105, language: 'English', clockIn: `${today}T07:15:00Z`, clockOut: `${today}T16:00:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '4', name: 'Miguel Retana', phone: '(555) 101-2004', position: 'Senior Technician', salaryType: 'Percentage', rate: 35, status: 'active', hours: 45.3, efficiency: 95, language: 'Spanish', clockIn: `${today}T06:00:00Z`, clockOut: `${today}T15:45:00Z`, shiftPeriod: '6AM-4PM', type: 'Overtime', department: 'Fleet' },
  { _id: '5', name: 'Bernardo Grossi', phone: '(555) 101-2005', position: 'Technician', salaryType: 'Hourly', rate: 25, status: 'active', hours: 36.8, efficiency: 88, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: `${today}T12:18:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '6', name: 'Islam Abdullaev', phone: '(555) 101-2006', position: 'Technician', salaryType: 'Hourly', rate: 26, status: 'active', hours: 39.5, efficiency: 102, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:00:00Z`, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: '7', name: 'Carlos Mendez', phone: '(555) 101-2007', position: 'Apprentice', salaryType: 'Hourly', rate: 18, status: 'active', hours: 32.0, efficiency: 72, language: 'Spanish', clockIn: `${today}T08:00:00Z`, clockOut: null, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '8', name: 'David Kim', phone: '(555) 101-2008', position: 'Fleet Technician', salaryType: 'Flat', rate: 2400, status: 'inactive', hours: 0, efficiency: null, language: 'English', clockIn: null, clockOut: null, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Fleet' },
  { _id: '9', name: 'Alex Thompson', phone: '(555) 101-2009', position: 'Technician', salaryType: 'Hourly', rate: 27, status: 'active', hours: 41.0, efficiency: 110, language: 'English', clockIn: `${today}T07:00:00Z`, clockOut: null, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: '10', name: 'Roberto Sanchez', phone: '(555) 101-2010', position: 'Technician', salaryType: 'Hourly', rate: 26, status: 'active', hours: 37.5, efficiency: 92, language: 'Spanish', clockIn: `${today}T07:30:00Z`, clockOut: `${today}T15:30:00Z`, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
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

const MOCK_CLOCK_RECORDS = [
  { _id: 'c1', worker: { name: 'Justin Naranjo' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:30:00Z`, totalHours: 8.5, status: 'auto', note: '', efficiency: 112, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c2', worker: { name: 'Emilio Rivera' }, date: `${today}T00:00:00Z`, clockIn: `${today}T06:30:00Z`, clockOut: `${today}T14:45:00Z`, totalHours: 8.25, status: 'auto', note: '', efficiency: 98, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Shop' },
  { _id: 'c3', worker: { name: 'Jeffrey Alvarez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:15:00Z`, clockOut: `${today}T16:00:00Z`, totalHours: 8.75, status: 'auto', note: '', efficiency: 105, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c4', worker: { name: 'Miguel Retana' }, date: `${today}T00:00:00Z`, clockIn: `${today}T06:00:00Z`, clockOut: `${today}T15:45:00Z`, totalHours: 9.75, status: 'auto', note: '', efficiency: 95, shiftPeriod: '6AM-4PM', type: 'Overtime', department: 'Fleet' },
  { _id: 'c5', worker: { name: 'Bernardo Grossi' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: `${today}T12:18:00Z`, totalHours: 5.3, status: 'auto', note: '', efficiency: 88, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c6', worker: { name: 'Islam Abdullaev' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: `${today}T15:00:00Z`, totalHours: 8.0, status: 'auto', note: '', efficiency: 102, shiftPeriod: '7AM-3PM', type: 'Normal', department: 'Office' },
  { _id: 'c7', worker: { name: 'Carlos Mendez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T08:00:00Z`, clockOut: null, totalHours: null, status: 'auto', note: '', efficiency: null, shiftPeriod: '8AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c8', worker: { name: 'Alex Thompson' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:00:00Z`, clockOut: null, totalHours: null, status: 'auto', note: '', efficiency: null, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c9', worker: { name: 'Roberto Sanchez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T07:30:00Z`, clockOut: `${today}T15:30:00Z`, totalHours: 8.0, status: 'manual', note: 'Adjusted by admin', efficiency: 92, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c10', worker: { name: 'Marco Lopez' }, date: `${today}T00:00:00Z`, clockIn: `${today}T06:45:00Z`, clockOut: `${today}T15:30:00Z`, totalHours: 8.75, status: 'auto', note: '', efficiency: 108, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  // Previous day records
  { _id: 'c11', worker: { name: 'Justin Naranjo' }, date: '2026-03-23T00:00:00Z', clockIn: '2026-03-23T07:00:00Z', clockOut: '2026-03-23T15:30:00Z', totalHours: 8.5, status: 'auto', note: '', efficiency: 110, shiftPeriod: '7AM-4PM', type: 'Normal', department: 'Shop' },
  { _id: 'c12', worker: { name: 'Emilio Rivera' }, date: '2026-03-23T00:00:00Z', clockIn: '2026-03-23T06:30:00Z', clockOut: '2026-03-23T15:00:00Z', totalHours: 8.5, status: 'auto', note: '', efficiency: 96, shiftPeriod: '6AM-3PM', type: 'Normal', department: 'Shop' },
];

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
    queryFn: async () => MOCK_CLOCK_RECORDS,
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
    mutationFn: async ({ id, body }: { id: string; body: any }) => ({ id, ...body }),
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

export function useEfficiencyHistory() {
  return useQuery({
    queryKey: ['efficiency-history'],
    queryFn: async () => [],
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

// ============ SALARY ============
export function useSalary() {
  return useQuery({
    queryKey: ['salary'],
    queryFn: async () => MOCK_SALARY,
  });
}

export function useSalaryRates() {
  return useQuery({
    queryKey: ['salary-rates'],
    queryFn: async () => [],
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

