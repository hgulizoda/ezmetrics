import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useNavigate } from 'react-router-dom';

import { exportCsv } from 'src/utils/exportCsv';

import {
  useSalary,
  useWorkers,
  useChargeTypes,
  useUpdateSalary,
  useCreateCharge,
  useUpdateCharge,
  useDeleteCharge,
  useUpdateOvertime,
  useOvertimeRecords,
  useChargedEmployees,
} from 'src/modules/ez-metric/api';

import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SALARY_TYPE_COLORS: Record<string, string> = {
  hourly: '#2065D1',
  percentage: '#7635DC',
  flat: '#22C55E',
};

function getCurrentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function formatPeriodLabel(period: string) {
  const [y, m] = period.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
}

const PERIOD_OPTIONS = (() => {
  const periods: string[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    periods.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return periods;
})();

function getEfficiencyChipColor(efficiency: string): 'success' | 'info' | 'warning' {
  const val = parseInt(efficiency, 10);
  if (val >= 100) return 'success';
  if (val >= 80) return 'info';
  return 'warning';
}

// ======================================================================
// MAIN COMPONENT
// ======================================================================

export default function SalaryPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const isAdmin = user?.role === 'admin';
  const [tab, setTab] = useState(0);

  // --- Overall Salary state ---
  const [salarySearch, setSalarySearch] = useState('');
  const [salaryTypeFilter, setSalaryTypeFilter] = useState('all');
  const [salaryPeriod, setSalaryPeriod] = useState(getCurrentPeriod());
  const [salaryEditDialog, setSalaryEditDialog] = useState(false);
  const [salaryEditForm, setSalaryEditForm] = useState({
    _id: '', baseSalary: '', rate: '', bonus: '', overtime: '', charge: '',
  });

  // --- Overtime state ---
  const [otPeriod, setOtPeriod] = useState(getCurrentPeriod());
  const [otSearch, setOtSearch] = useState('');
  const [otFilter, setOtFilter] = useState('all');
  const [otEditDialog, setOtEditDialog] = useState(false);
  const [otEditForm, setOtEditForm] = useState({ _id: '', overtimeHours: '', bonusAmount: '' });

  // --- Charged Employees state ---
  const [cePeriod, setCePeriod] = useState(getCurrentPeriod());
  const [ceFilter, setCeFilter] = useState('all');
  const [ceDialog, setCeDialog] = useState(false);
  const [ceEditId, setCeEditId] = useState<string | null>(null);
  const [ceForm, setCeForm] = useState({ workerId: '', chargeType: '', amount: '', date: '', note: '' });

  // --- Data hooks ---
  const { data: salaryData = [], isLoading: salaryLoading } = useSalary();
  const updateSalary = useUpdateSalary();
  const { data: overtimeRecords = [], isLoading: otLoading } = useOvertimeRecords(otPeriod);
  const updateOT = useUpdateOvertime();

  const { data: chargeTypes = [] } = useChargeTypes();

  const { data: chargedEmployees = [], isLoading: ceLoading } = useChargedEmployees(cePeriod);
  const createCE = useCreateCharge();
  const updateCE = useUpdateCharge();
  const deleteCE = useDeleteCharge();

  const { data: workers = [] } = useWorkers();

  // --- Summary calculations ---
  const totalPayroll = salaryData.reduce((s: number, w: any) => s + (w.totalPayroll || 0), 0);
  const totalBonuses = salaryData.reduce((s: number, w: any) => s + Math.max(w.bonus || 0, 0), 0);
  const totalCharges = chargedEmployees
    .filter((ce: any) => ce.chargeCategory === 'Deduction')
    .reduce((s: number, ce: any) => s + (ce.amount || 0), 0);
  const totalOvertime = overtimeRecords.reduce((s: number, r: any) => s + (r.bonusAmount || 0), 0);

  // --- Overtime filtered ---
  const filteredOvertime = useMemo(() => {
    let list = overtimeRecords as any[];
    if (otSearch) list = list.filter((r: any) => r.name.toLowerCase().includes(otSearch.toLowerCase()));
    if (otFilter !== 'all') list = list.filter((r: any) => r.salaryType.toLowerCase() === otFilter);
    return list;
  }, [overtimeRecords, otSearch, otFilter]);

  // --- Charged Employees filtered ---
  const filteredCharges = useMemo(() => {
    let list = chargedEmployees as any[];
    if (ceFilter !== 'all') list = list.filter((ce: any) => ce.chargeType === ceFilter);
    return list;
  }, [chargedEmployees, ceFilter]);

  // --- Salary filtered ---
  const filteredSalary = useMemo(() => {
    let list = salaryData as any[];
    if (salarySearch) list = list.filter((w: any) => w.name.toLowerCase().includes(salarySearch.toLowerCase()));
    if (salaryTypeFilter !== 'all') list = list.filter((w: any) => (w.salaryType || '').toLowerCase() === salaryTypeFilter);
    return list;
  }, [salaryData, salarySearch, salaryTypeFilter]);

  // --- Export handlers (per table) ---
  const exportSalaryOverview = () => {
    exportCsv('salary-overview', ['Worker', 'Base Salary', 'Rate', 'Efficiency', 'Bonus', 'Overtime', 'Charge', 'Total Payroll'],
      filteredSalary.map((w: any) => [w.name, w.baseSalary, w.rate, w.efficiency, w.bonus, w.overtime, w.charge, w.totalPayroll]));
  };

  const exportOvertime = () => {
    exportCsv('overtime-records', ['Name', 'Salary Type', 'Overtime Hours', 'Bonus Amount', 'Status'],
      filteredOvertime.map((r: any) => [r.name, r.salaryType, r.overtimeHours, r.bonusAmount, r.status]));
  };

  const exportChargedEmployees = () => {
    exportCsv('charged-employees', ['Employee', 'Charge Type', 'Category', 'Amount', 'Date', 'Note'],
      filteredCharges.map((ce: any) => [ce.employee, ce.chargeType, ce.chargeCategory, ce.amount, ce.date, ce.note]));
  };

  // --- Handlers: Overall Salary ---
  const handleEditSalary = (w: any) => {
    setSalaryEditForm({
      _id: w._id,
      baseSalary: String(w.baseSalary || 0),
      rate: String(w.rate || 0),
      bonus: String(w.bonus || 0),
      overtime: String(w.overtime || 0),
      charge: String(w.charge || 0),
    });
    setSalaryEditDialog(true);
  };

  const handleSaveSalary = async () => {
    const baseSalary = Number(salaryEditForm.baseSalary);
    const bonus = Number(salaryEditForm.bonus);
    const overtime = Number(salaryEditForm.overtime);
    const charge = Number(salaryEditForm.charge);
    const totalPayrollCalc = baseSalary + bonus + overtime - charge;
    await updateSalary.mutateAsync({
      id: salaryEditForm._id,
      body: {
        baseSalary,
        rate: Number(salaryEditForm.rate),
        bonus,
        overtime,
        charge,
        totalPayroll: totalPayrollCalc,
      },
    });
    setSalaryEditDialog(false);
  };

  // --- Handlers: Overtime ---
  const handleEditOT = (item: any) => {
    setOtEditForm({ _id: item._id, overtimeHours: String(item.overtimeHours), bonusAmount: String(item.bonusAmount) });
    setOtEditDialog(true);
  };

  const handleSaveOT = async () => {
    await updateOT.mutateAsync({
      id: otEditForm._id,
      body: {
        overtimeHours: Number(otEditForm.overtimeHours),
        bonusAmount: Number(otEditForm.bonusAmount),
        status: Number(otEditForm.overtimeHours) > 0 ? 'Calculated' : 'No overtime',
      },
    });
    setOtEditDialog(false);
  };

  // --- Handlers: Charged Employees ---
  const handleOpenCeDialog = (item?: any) => {
    if (item) {
      setCeEditId(item._id);
      setCeForm({ workerId: item.workerId, chargeType: item.chargeType, amount: String(item.amount), date: item.date, note: item.note || '' });
    } else {
      setCeEditId(null);
      setCeForm({ workerId: '', chargeType: '', amount: '', date: '', note: '' });
    }
    setCeDialog(true);
  };

  const handleSaveCE = async () => {
    const body = { workerId: ceForm.workerId, chargeType: ceForm.chargeType, amount: Number(ceForm.amount), date: ceForm.date, note: ceForm.note };
    if (ceEditId) {
      await updateCE.mutateAsync({ id: ceEditId, body });
    } else {
      await createCE.mutateAsync(body);
    }
    setCeDialog(false);
  };

  // ======================================================================
  // RENDER
  // ======================================================================

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Salary Calculation</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage payroll, overtime, charges, and deductions
          </Typography>
        </Box>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Payroll', value: `$${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#2065D1', icon: 'solar:wallet-money-bold-duotone' },
          { label: 'Total Bonuses', value: `$${totalBonuses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#22C55E', icon: 'solar:gift-bold-duotone' },
          { label: 'Total Overtime', value: `$${totalOvertime.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#7635DC', icon: 'solar:clock-circle-bold-duotone' },
          { label: 'Total Charges', value: `$${totalCharges.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#FF5630', icon: 'solar:bill-list-bold-duotone' },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${alpha(s.color, 0.2)}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(s.color, 0.1) }}>
                  <Iconify icon={s.icon} width={24} sx={{ color: s.color }} />
                </Box>
                <Box>
                  <Typography variant="h5">{s.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tabs Card */}
      <Card sx={{ borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pr: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2.5, pt: 1 }}>
            <Tab label="Overall Salary" />
            <Tab label="Overtime Hours" />
            <Tab label="Charged Employees" />
          </Tabs>
          <Tooltip title="Export CSV">
            <IconButton
              size="small"
              sx={{ color: 'text.secondary' }}
              onClick={(() => { if (tab === 0) return exportSalaryOverview; if (tab === 1) return exportOvertime; return exportChargedEmployees; })()}
            >
              <Iconify icon="solar:download-minimalistic-bold-duotone" width={22} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* ============================================================ */}
        {/* TAB 0: OVERALL SALARY */}
        {/* ============================================================ */}
        {tab === 0 && (
          salaryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : (
            <Box>
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                alignItems="center"
                sx={{ px: 3, py: 2.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}
              >
                  <TextField
                    size="small"
                    placeholder="Search worker..."
                    value={salarySearch}
                    onChange={(e) => setSalarySearch(e.target.value)}
                    sx={{ minWidth: 220 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:magnifer-bold-duotone" width={20} sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    select
                    size="small"
                    label="Salary Type"
                    value={salaryTypeFilter}
                    onChange={(e) => setSalaryTypeFilter(e.target.value)}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="percentage">Percentage</MenuItem>
                    <MenuItem value="flat">Flat</MenuItem>
                  </TextField>
                  <TextField
                    select
                    size="small"
                    label="Period"
                    value={salaryPeriod}
                    onChange={(e) => setSalaryPeriod(e.target.value)}
                    sx={{ minWidth: 160 }}
                  >
                    {PERIOD_OPTIONS.map((p) => (
                      <MenuItem key={p} value={p}>{formatPeriodLabel(p)}</MenuItem>
                    ))}
                  </TextField>
              </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Worker</TableCell>
                    <TableCell align="right">Base Salary</TableCell>
                    <TableCell align="right">Rate</TableCell>
                    <TableCell align="center">Efficiency</TableCell>
                    <TableCell align="right">Bonus</TableCell>
                    <TableCell align="right">Overtime</TableCell>
                    <TableCell align="right">Charge</TableCell>
                    <TableCell align="right">Total Payroll</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSalary.map((w: any) => (
                    <TableRow
                      key={w._id}
                      hover
                      sx={{
                        bgcolor: (w.bonus || 0) < 0 ? alpha('#FF5630', 0.04) : 'transparent',
                      }}
                    >
                      <TableCell><Typography variant="subtitle2">{w.name}</Typography></TableCell>
                      <TableCell align="right">
                        ${(w.baseSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell align="right">${w.rate}</TableCell>
                      <TableCell align="center">
                        {w.efficiency && w.efficiency !== 'N/A' ? (
                          <Chip label={w.efficiency} size="small" variant="soft" color={getEfficiencyChipColor(w.efficiency)} />
                        ) : (
                          <Chip label="N/A" size="small" variant="soft" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{ color: (w.bonus || 0) >= 0 ? '#22C55E' : '#FF5630' }}
                        >
                          {(w.bonus || 0) >= 0 ? '' : '-'}${Math.abs(w.bonus || 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {(w.overtime || 0) > 0 ? (
                          <Chip label={`$${w.overtime}`} size="small" color="warning" variant="soft" />
                        ) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {(w.charge || 0) > 0 ? (
                          <Typography variant="subtitle2" sx={{ color: '#FF5630' }}>${w.charge}</Typography>
                        ) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          ${(w.totalPayroll || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => navigate(`/dashboard/salary/${w._id}`)}>
                            <Iconify icon="solar:eye-bold-duotone" width={18} />
                          </IconButton>
                        </Tooltip>
                        {isAdmin && (
                          <Tooltip title="Edit Salary">
                            <IconButton size="small" onClick={() => handleEditSalary(w)}>
                              <Iconify icon="solar:pen-bold-duotone" width={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals row */}
                  <TableRow sx={{ bgcolor: alpha('#2065D1', 0.04) }}>
                    <TableCell><Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total</Typography></TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        ${filteredSalary.reduce((s: number, w: any) => s + (w.baseSalary || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#22C55E' }}>
                        ${filteredSalary.reduce((s: number, w: any) => s + (w.bonus || 0), 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FFAB00' }}>
                        ${filteredSalary.reduce((s: number, w: any) => s + (w.overtime || 0), 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#FF5630' }}>
                        ${filteredSalary.reduce((s: number, w: any) => s + (w.charge || 0), 0).toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          )
        )}

        {/* ============================================================ */}
        {/* TAB 1: OVERTIME HOURS */}
        {/* ============================================================ */}
        {tab === 1 && (
          <Box>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              alignItems="center"
              sx={{ px: 3, py: 2.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}
            >
                <TextField
                  size="small"
                  placeholder="Search worker..."
                  value={otSearch}
                  onChange={(e) => setOtSearch(e.target.value)}
                  sx={{ minWidth: 220 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Iconify icon="solar:magnifer-bold-duotone" width={20} sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  select
                  size="small"
                  label="Salary Type"
                  value={otFilter}
                  onChange={(e) => setOtFilter(e.target.value)}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="hourly">Hourly</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="flat">Flat</MenuItem>
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Period"
                  value={otPeriod}
                  onChange={(e) => setOtPeriod(e.target.value)}
                  sx={{ minWidth: 160 }}
                >
                  {PERIOD_OPTIONS.map((p) => (
                    <MenuItem key={p} value={p}>{formatPeriodLabel(p)}</MenuItem>
                  ))}
                </TextField>
            </Stack>

            {otLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Salary Type</TableCell>
                      <TableCell align="right">Overtime Hours</TableCell>
                      <TableCell align="right">Bonus Amount</TableCell>
                      <TableCell align="center">Status</TableCell>
                      {isAdmin && <TableCell align="center">Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOvertime.map((r: any) => (
                      <TableRow key={r._id} hover>
                        <TableCell><Typography variant="subtitle2">{r.name}</Typography></TableCell>
                        <TableCell>
                          <Chip
                            label={r.salaryType}
                            size="small"
                            variant="soft"
                            sx={{
                              bgcolor: alpha(SALARY_TYPE_COLORS[r.salaryType.toLowerCase()] || '#2065D1', 0.1),
                              color: SALARY_TYPE_COLORS[r.salaryType.toLowerCase()] || '#2065D1',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {r.overtimeHours > 0 ? `${r.overtimeHours} hrs` : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {r.bonusAmount > 0 ? (
                            <Typography variant="subtitle2" sx={{ color: '#22C55E' }}>
                              ${r.bonusAmount.toFixed(2)}
                            </Typography>
                          ) : '-'}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={r.status}
                            size="small"
                            variant="soft"
                            color={r.status === 'Calculated' ? 'success' : 'default'}
                          />
                        </TableCell>
                        {isAdmin && (
                          <TableCell align="center">
                            <Tooltip title="Edit Overtime">
                              <IconButton size="small" onClick={() => handleEditOT(r)}>
                                <Iconify icon="solar:pen-bold-duotone" width={18} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {filteredOvertime.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>No overtime records found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CHARGED EMPLOYEES */}
        {/* ============================================================ */}
        {tab === 2 && (
          <Box>
            <Stack
              direction="row"
              spacing={2}
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 3, py: 2.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}
            >
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  size="small"
                  label="Charge Type"
                  value={ceFilter}
                  onChange={(e) => setCeFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  {chargeTypes.map((ct: any) => (
                    <MenuItem key={ct._id} value={ct.name}>{ct.name}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  size="small"
                  label="Period"
                  value={cePeriod}
                  onChange={(e) => setCePeriod(e.target.value)}
                  sx={{ minWidth: 160 }}
                >
                  {PERIOD_OPTIONS.map((p) => (
                    <MenuItem key={p} value={p}>{formatPeriodLabel(p)}</MenuItem>
                  ))}
                </TextField>
              </Stack>
              {isAdmin && (
                <Button variant="soft" size="small" startIcon={<Iconify icon="solar:add-circle-bold" />} onClick={() => handleOpenCeDialog()}>
                  Add Charge
                </Button>
              )}
            </Stack>

            {ceLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Employee</TableCell>
                      <TableCell>Charge Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Note</TableCell>
                      {isAdmin && <TableCell align="center">Actions</TableCell>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCharges.map((ce: any) => (
                      <TableRow key={ce._id} hover>
                        <TableCell><Typography variant="subtitle2">{ce.employee}</Typography></TableCell>
                        <TableCell>
                          <Chip
                            label={ce.chargeType}
                            size="small"
                            variant="soft"
                            color={ce.chargeCategory === 'Deduction' ? 'error' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ color: ce.chargeCategory === 'Deduction' ? '#FF5630' : '#FFAB00' }}>
                            ${ce.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </Typography>
                        </TableCell>
                        <TableCell>{ce.date}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {ce.note || '-'}
                          </Typography>
                        </TableCell>
                        {isAdmin && (
                        <TableCell align="center">
                          <Stack direction="row" justifyContent="center" spacing={0.5}>
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => handleOpenCeDialog(ce)}>
                                <Iconify icon="solar:pen-bold-duotone" width={18} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => deleteCE.mutate(ce._id)}>
                                <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {filteredCharges.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>No charges found for this period</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Card>

      {/* ============================================================ */}
      {/* DIALOGS */}
      {/* ============================================================ */}

      {/* Salary Edit Dialog */}
      <Dialog open={salaryEditDialog} onClose={() => setSalaryEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Salary</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Base Salary ($)"
                type="number"
                value={salaryEditForm.baseSalary}
                onChange={(e) => setSalaryEditForm((p) => ({ ...p, baseSalary: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Rate ($)"
                type="number"
                value={salaryEditForm.rate}
                onChange={(e) => setSalaryEditForm((p) => ({ ...p, rate: e.target.value }))}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Bonus ($)"
                type="number"
                value={salaryEditForm.bonus}
                onChange={(e) => setSalaryEditForm((p) => ({ ...p, bonus: e.target.value }))}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Overtime ($)"
                type="number"
                value={salaryEditForm.overtime}
                onChange={(e) => setSalaryEditForm((p) => ({ ...p, overtime: e.target.value }))}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Charge ($)"
                type="number"
                value={salaryEditForm.charge}
                onChange={(e) => setSalaryEditForm((p) => ({ ...p, charge: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ p: 2, bgcolor: alpha('#2065D1', 0.04), border: `1px solid ${alpha('#2065D1', 0.12)}` }}>
                <Typography variant="subtitle2">
                  Total Payroll: $
                  {(
                    Number(salaryEditForm.baseSalary || 0) +
                    Number(salaryEditForm.bonus || 0) +
                    Number(salaryEditForm.overtime || 0) -
                    Number(salaryEditForm.charge || 0)
                  ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Base + Bonus + Overtime - Charge
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSalaryEditDialog(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSaveSalary} disabled={updateSalary.isPending}>
            {updateSalary.isPending ? 'Saving...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Overtime Edit Dialog */}
      <Dialog open={otEditDialog} onClose={() => setOtEditDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Overtime</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Overtime Hours"
                type="number"
                value={otEditForm.overtimeHours}
                onChange={(e) => setOtEditForm((p) => ({ ...p, overtimeHours: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Bonus Amount ($)"
                type="number"
                value={otEditForm.bonusAmount}
                onChange={(e) => setOtEditForm((p) => ({ ...p, bonusAmount: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOtEditDialog(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSaveOT}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* Add/Edit Charge Dialog */}
      <Dialog open={ceDialog} onClose={() => setCeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{ceEditId ? 'Edit Charge' : 'Add Charge'}</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Employee"
                value={ceForm.workerId}
                onChange={(e) => setCeForm((p) => ({ ...p, workerId: e.target.value }))}
              >
                {workers.map((w: any) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Charge Type"
                value={ceForm.chargeType}
                onChange={(e) => {
                  const ct = chargeTypes.find((c: any) => c.name === e.target.value);
                  setCeForm((p) => ({
                    ...p,
                    chargeType: e.target.value,
                    amount: ct?.defaultAmount ? String(ct.defaultAmount) : p.amount,
                  }));
                }}
              >
                {chargeTypes.filter((ct: any) => ct.status === 'active').map((ct: any) => (
                  <MenuItem key={ct._id} value={ct.name}>{ct.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount ($)"
                type="number"
                value={ceForm.amount}
                onChange={(e) => setCeForm((p) => ({ ...p, amount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={ceForm.date}
                onChange={(e) => setCeForm((p) => ({ ...p, date: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Note"
                value={ceForm.note}
                onChange={(e) => setCeForm((p) => ({ ...p, note: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCeDialog(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveCE}
            disabled={!ceForm.workerId || !ceForm.chargeType || !ceForm.amount}
          >
            {ceEditId ? 'Update' : 'Add Charge'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
