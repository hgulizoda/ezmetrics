import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

import { exportCsv } from 'src/utils/exportCsv';

import { useWorkers, useClockRecords, useUpdateClockRecord } from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

function getEffChipColor(eff: number | null): 'success' | 'info' | 'warning' | 'default' {
  if (eff === null) return 'default';
  if (eff >= 100) return 'success';
  if (eff >= 80) return 'info';
  return 'warning';
}

function getEffBg(eff: number): string {
  if (eff >= 90) return '#22C55E';
  return '#FFAB00';
}

const today = new Date().toISOString().split('T')[0];

function formatTime(value: string | null | undefined): string | null {
  if (!value) return null;
  return new Date(value).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Quick period presets
type PeriodPreset = 'today' | 'yesterday' | 'last3' | 'last7' | 'custom';

function daysAgoDate(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export default function ClockPage() {
  const [tab, setTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [editClockIn, setEditClockIn] = useState('');
  const [editClockOut, setEditClockOut] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editBilledHours, setEditBilledHours] = useState('');
  const [editNote, setEditNote] = useState('');
  const [origValues, setOrigValues] = useState({ clockIn: '', clockOut: '', date: '', billedHours: '' });

  // Filters
  const [todayDeptFilter, setTodayDeptFilter] = useState('all');
  const [allDeptFilter, setAllDeptFilter] = useState('all');
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('last7');
  const [customFrom, setCustomFrom] = useState(daysAgoDate(7));
  const [customTo, setCustomTo] = useState(today);
  const [searchQuery, setSearchQuery] = useState('');

  // Detail modal state
  const [detailRecord, setDetailRecord] = useState<any>(null);

  const theme = useTheme();
  const { data: records = [], isLoading } = useClockRecords();
  const { data: workers = [] } = useWorkers();
  const updateClockRecord = useUpdateClockRecord();

  // Unique departments from all records
  const departments = useMemo(() => {
    const set = new Set<string>();
    records.forEach((r: any) => { if (r.department) set.add(r.department); });
    return Array.from(set).sort();
  }, [records]);

  const allTodayRecords = records.filter((r: any) => {
    const recordDate = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
    return recordDate === today;
  });
  const todayRecords = useMemo(() => {
    if (todayDeptFilter === 'all') return allTodayRecords;
    return allTodayRecords.filter((r: any) => r.department === todayDeptFilter);
  }, [allTodayRecords, todayDeptFilter]);
  const activeWorkers = allTodayRecords.filter((r: any) => !r.clockOut);

  // Compute date range based on preset
  const dateRange = useMemo(() => {
    switch (periodPreset) {
      case 'today': return { from: today, to: today };
      case 'yesterday': return { from: daysAgoDate(1), to: daysAgoDate(1) };
      case 'last3': return { from: daysAgoDate(2), to: today };
      case 'last7': return { from: daysAgoDate(6), to: today };
      case 'custom': return { from: customFrom, to: customTo };
      default: return { from: daysAgoDate(6), to: today };
    }
  }, [periodPreset, customFrom, customTo]);

  // Filter records for "All Records" tab
  const filteredRecords = useMemo(() => {
    let list = records.filter((r: any) => {
      const d = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
      return d >= dateRange.from && d <= dateRange.to;
    });
    if (allDeptFilter !== 'all') {
      list = list.filter((r: any) => r.department === allDeptFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r: any) => (r.worker?.name || '').toLowerCase().includes(q));
    }
    // Sort by date descending, then by name
    list.sort((a: any, b: any) => {
      const da = a.date || '';
      const db = b.date || '';
      if (da !== db) return db.localeCompare(da);
      return (a.worker?.name || '').localeCompare(b.worker?.name || '');
    });
    return list;
  }, [records, dateRange, allDeptFilter, searchQuery]);

  // Aggregate stats for the selected period
  const periodStats = useMemo(() => {
    const completed = filteredRecords.filter((r: any) => r.clockOut);
    const totalHours = completed.reduce((s: number, r: any) => s + (r.totalHours || 0), 0);
    const withEff = completed.filter((r: any) => r.efficiency != null);
    const avgEff = withEff.length > 0
      ? Math.round(withEff.reduce((s: number, r: any) => s + r.efficiency, 0) / withEff.length)
      : 0;
    const uniqueDates = new Set(filteredRecords.map((r: any) =>
      r.date ? new Date(r.date).toISOString().split('T')[0] : ''
    ));
    return {
      totalRecords: filteredRecords.length,
      completedShifts: completed.length,
      totalHours: totalHours.toFixed(1),
      avgEfficiency: avgEff,
      daysCount: uniqueDates.size,
    };
  }, [filteredRecords]);

  // Per-worker chart data (actual vs required hours + efficiency)
  const chartData = useMemo(() => {
    const map = new Map<string, { name: string; actual: number; billed: number; effSum: number; effCount: number }>();
    filteredRecords.forEach((r: any) => {
      const name = r.worker?.name || 'Unknown';
      const prev = map.get(name) || { name, actual: 0, billed: 0, effSum: 0, effCount: 0 };
      map.set(name, {
        name,
        actual: prev.actual + (r.totalHours || 0),
        billed: prev.billed + (r.billedHours || 0),
        effSum: prev.effSum + (r.efficiency != null ? r.efficiency : 0),
        effCount: prev.effCount + (r.efficiency != null ? 1 : 0),
      });
    });
    const entries = Array.from(map.values());
    return {
      categories: entries.map((e) => e.name.split(' ')[0]),
      actual: entries.map((e) => Math.round(e.actual * 10) / 10),
      billed: entries.map((e) => Math.round(e.billed * 10) / 10),
      efficiency: entries.map((e) => e.effCount > 0 ? Math.round(e.effSum / e.effCount) : 0),
    };
  }, [filteredRecords]);

  // Group records by date for display
  const groupedByDate = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredRecords.forEach((r: any) => {
      const d = r.date ? new Date(r.date).toISOString().split('T')[0] : 'unknown';
      if (!groups[d]) groups[d] = [];
      groups[d].push(r);
    });
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filteredRecords]);

  // Per-worker chart data for today (actual vs required hours + efficiency)
  const todayChartData = useMemo(() => {
    const map = new Map<string, { name: string; actual: number; billed: number; effSum: number; effCount: number }>();
    todayRecords.forEach((r: any) => {
      const name = r.worker?.name || 'Unknown';
      const prev = map.get(name) || { name, actual: 0, billed: 0, effSum: 0, effCount: 0 };
      map.set(name, {
        name,
        actual: prev.actual + (r.totalHours || 0),
        billed: prev.billed + (r.billedHours || 0),
        effSum: prev.effSum + (r.efficiency != null ? r.efficiency : 0),
        effCount: prev.effCount + (r.efficiency != null ? 1 : 0),
      });
    });
    const entries = Array.from(map.values());
    return {
      categories: entries.map((e) => e.name.split(' ')[0]),
      actual: entries.map((e) => Math.round(e.actual * 10) / 10),
      billed: entries.map((e) => Math.round(e.billed * 10) / 10),
      efficiency: entries.map((e) => e.effCount > 0 ? Math.round(e.effSum / e.effCount) : 0),
    };
  }, [todayRecords]);

  const _displayedRecords = tab === 0 ? todayRecords : filteredRecords;

  const clockCsvHeaders = ['Name', 'Date', 'Clock In', 'Clock Out', 'Total Hours', 'Billed Hours', 'Efficiency', 'Shift Period', 'Type', 'Department', 'Status'];
  const clockCsvRow = (r: any) => [
    r.worker?.name || '', r.date ? new Date(r.date).toISOString().split('T')[0] : '',
    formatTime(r.clockIn) || '', r.clockOut ? formatTime(r.clockOut) : '',
    r.totalHours ?? '', r.billedHours ?? '',
    r.efficiency != null ? `${r.efficiency}%` : '',
    r.shiftPeriod || '', r.type || '', r.department || '', r.status || '',
  ];
  const exportToday = () => exportCsv('clock-today', clockCsvHeaders, todayRecords.map(clockCsvRow));
  const exportAllRecords = () => exportCsv('clock-records', clockCsvHeaders, filteredRecords.map(clockCsvRow));

  const handleOpenEdit = useCallback((record: any) => {
    const clockInVal = record.clockIn ? new Date(record.clockIn).toTimeString().slice(0, 5) : '';
    const clockOutVal = record.clockOut ? new Date(record.clockOut).toTimeString().slice(0, 5) : '';
    const dateVal = record.date ? new Date(record.date).toISOString().split('T')[0] : today;

    const billedVal = record.billedHours != null ? String(record.billedHours) : '';

    setEditRecord(record);
    setEditClockIn(clockInVal);
    setEditClockOut(clockOutVal);
    setEditDate(dateVal);
    setEditBilledHours(billedVal);
    setEditNote('');
    setOrigValues({ clockIn: clockInVal, clockOut: clockOutVal, date: dateVal, billedHours: billedVal });
    setEditDialog(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditDialog(false);
    setEditRecord(null);
  }, []);

  const hasChanges =
    editClockIn !== origValues.clockIn ||
    editClockOut !== origValues.clockOut ||
    editDate !== origValues.date ||
    editBilledHours !== origValues.billedHours;

  const canSave = !hasChanges || editNote.trim().length > 0;

  const handleSaveEdit = useCallback(() => {
    if (!editRecord) return;

    const body: any = {
      note: editNote,
      status: 'manual',
      date: `${editDate}T00:00:00Z`,
    };

    if (editClockIn) {
      body.clockIn = `${editDate}T${editClockIn}:00Z`;
    }
    if (editClockOut) {
      body.clockOut = `${editDate}T${editClockOut}:00Z`;
    }
    if (editBilledHours) {
      body.billedHours = Number(editBilledHours);
    }

    updateClockRecord.mutate(
      { id: editRecord._id, body },
      { onSuccess: () => handleCloseEdit() }
    );
  }, [editRecord, editClockIn, editClockOut, editDate, editBilledHours, editNote, updateClockRecord, handleCloseEdit]);

  // Table row renderer (shared between both tabs)
  const renderRow = (record: any, index: number, showDate: boolean) => {
    const eff = record.efficiency;
    const initials = (record.worker?.name || '')
      .split(' ')
      .map((n: string) => n[0])
      .join('');

    return (
      <TableRow key={record._id} hover>
        <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
        <TableCell>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            onClick={() => setDetailRecord(record)}
            sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: 13,
                fontWeight: 700,
                bgcolor: alpha('#2065D1', 0.08),
                color: '#2065D1',
              }}
            >
              {initials}
            </Avatar>
            <Typography variant="subtitle2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
              {record.worker?.name || '—'}
            </Typography>
          </Stack>
        </TableCell>
        {showDate && (
          <TableCell>{record.date ? formatDateShort(record.date) : '—'}</TableCell>
        )}
        <TableCell>{formatTime(record.clockIn) || '—'}</TableCell>
        <TableCell>{record.clockOut ? formatTime(record.clockOut) : '—'}</TableCell>
        <TableCell>
          {record.billedHours != null ? `${record.billedHours} hrs` : '—'}
        </TableCell>
        <TableCell>
          {eff != null ? (
            <Chip label={`${eff}%`} size="small" variant="soft" color={getEffChipColor(eff)} />
          ) : '—'}
        </TableCell>
        <TableCell>{record.shiftPeriod ?? '—'}</TableCell>
        <TableCell>
          {record.status === 'manual' ? (
            <Tooltip title={record.note || 'Corrected'} arrow>
              <Chip label="Corrected" size="small" variant="soft" color="warning" />
            </Tooltip>
          ) : (
            <Chip label="Normal" size="small" variant="soft" color="success" />
          )}
        </TableCell>
        <TableCell>{record.department ?? '—'}</TableCell>
        <TableCell align="center">
          <Tooltip title="Edit Record">
            <IconButton size="small" onClick={() => handleOpenEdit(record)}>
              <Iconify icon="solar:pen-bold" width={18} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Clock In / Out</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage worker time records
          </Typography>
        </Box>
      </Stack>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Clocked In Today', value: todayRecords.length, color: '#2065D1', icon: 'solar:login-3-bold-duotone' },
          { label: 'Currently Active', value: activeWorkers.length, color: '#22C55E', icon: 'solar:play-circle-bold-duotone' },
          { label: 'Completed Shifts', value: todayRecords.filter((r: any) => r.clockOut).length, color: '#FFAB00', icon: 'solar:check-circle-bold-duotone' },
          { label: 'Manual Entries', value: records.filter((r: any) => r.status === 'manual').length, color: '#7635DC', icon: 'solar:pen-new-square-bold-duotone' },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ p: 2.5, borderRadius: 2 }}>
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

      <Card sx={{ borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ pr: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2.5, pt: 1 }}>
            <Tab label="Today" />
            <Tab label="All Records" />
          </Tabs>
          <Tooltip title="Export CSV">
            <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={tab === 0 ? exportToday : exportAllRecords}>
              <Iconify icon="solar:download-minimalistic-bold-duotone" width={22} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* ============================================================ */}
        {/* TAB 0: TODAY - no date filter, just the table */}
        {/* ============================================================ */}
        {tab === 0 && (
          isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
          ) : (
            <Box>
            {/* Department filter */}
            <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
              <TextField
                select
                size="small"
                label="Department"
                value={todayDeptFilter}
                onChange={(e) => setTodayDeptFilter(e.target.value)}
                sx={{ minWidth: 180 }}
              >
                <MenuItem value="all">All Departments</MenuItem>
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Actual vs Required Hours per Employee */}
            {todayChartData.categories.length > 0 && (
              <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6">Actual vs Required Hours</Typography>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Actual Hours</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.3) }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Required Hours</Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                  <Chart
                    type="bar"
                    series={[
                      { name: 'Actual Hours', data: todayChartData.actual },
                      { name: 'Required Hours', data: todayChartData.billed },
                    ]}
                    options={{
                      chart: { stacked: false, toolbar: { show: false } },
                      plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
                      xaxis: {
                        categories: todayChartData.categories,
                        labels: { style: { fontSize: '12px', colors: theme.palette.text.secondary } },
                      },
                      yaxis: {
                        title: { text: 'Hours', style: { color: theme.palette.text.secondary } },
                        labels: { formatter: (val: number) => `${val}`, style: { colors: theme.palette.text.secondary } },
                      },
                      colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.3)],
                      legend: { show: false },
                      grid: { strokeDashArray: 3, borderColor: theme.palette.divider },
                      tooltip: {
                        theme: theme.palette.mode,
                        shared: true,
                        intersect: false,
                        y: { formatter: (val: number) => `${val} hrs` },
                      },
                      annotations: {
                        points: todayChartData.categories.map((cat: string, i: number) => ({
                          x: cat,
                          y: Math.max(todayChartData.actual[i], todayChartData.billed[i]) + 0.5,
                          seriesIndex: 0,
                          marker: { size: 0 },
                          label: {
                            text: `${todayChartData.efficiency[i]}%`,
                            borderWidth: 0,
                            style: {
                              background: getEffBg(todayChartData.efficiency[i]),
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: { left: 8, right: 8, top: 4, bottom: 4 },
                            },
                            borderRadius: 6,
                          },
                        })),
                      },
                    }}
                    height={320}
                  />
                </Card>
              </Box>
            )}

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 3, width: 48 }}>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Clock in</TableCell>
                    <TableCell>Clock out</TableCell>
                    <TableCell>Billed Hours</TableCell>
                    <TableCell>Time efficiency</TableCell>
                    <TableCell>Shift Period</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell align="center">Edit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayRecords.map((record: any, index: number) => renderRow(record, index, false))}
                  {todayRecords.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>No clock records for today</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            </Box>
          )
        )}

        {/* ============================================================ */}
        {/* TAB 1: ALL RECORDS - period selection + grouped by date */}
        {/* ============================================================ */}
        {tab === 1 && (
          <Box>
            {/* Filters bar */}
            <Box sx={{ px: 3, pt: 2.5, pb: 2, borderBottom: (t) => `1px solid ${t.palette.divider}` }}>
              <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" sx={{ mb: 1.5 }}>
                <TextField
                  select
                  size="small"
                  label="Period"
                  value={periodPreset}
                  onChange={(e) => setPeriodPreset(e.target.value as PeriodPreset)}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="last3">Last 3 Days</MenuItem>
                  <MenuItem value="last7">Last 7 Days</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </TextField>

                {periodPreset === 'custom' && (
                  <>
                    <TextField
                      size="small"
                      type="date"
                      label="From"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ width: 160 }}
                    />
                    <TextField
                      size="small"
                      type="date"
                      label="To"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{ width: 160 }}
                    />
                  </>
                )}

                <TextField
                  select
                  size="small"
                  label="Department"
                  value={allDeptFilter}
                  onChange={(e) => setAllDeptFilter(e.target.value)}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  {departments.map((d) => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  size="small"
                  placeholder="Search worker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 220 }}
                />
              </Stack>

              {/* Period summary bar */}
              <Stack direction="row" spacing={3} sx={{ mb: 0, px: 1 }} alignItems="center">
                {[
                  { label: 'Days', value: periodStats.daysCount, color: '#2065D1' },
                  { label: 'Records', value: periodStats.totalRecords, color: '#7635DC' },
                  { label: 'Completed', value: periodStats.completedShifts, color: '#FFAB00' },
                  { label: 'Total Hours', value: periodStats.totalHours, color: '#22C55E' },
                ].map((stat) => (
                  <Stack key={stat.label} direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stat.color }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{stat.label}:</Typography>
                    <Typography variant="subtitle2">{stat.value}</Typography>
                  </Stack>
                ))}
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>Avg Efficiency:</Typography>
                  <Chip label={`${periodStats.avgEfficiency}%`} size="small" variant="soft" color={getEffChipColor(periodStats.avgEfficiency)} />
                </Stack>
              </Stack>
            </Box>

            {/* Actual vs Required Hours Bar Chart */}
            {!isLoading && chartData.categories.length > 0 && (
              <Box sx={{ px: 3, pt: 3 }}>
                <Card sx={{ p: 3, borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box>
                      <Typography variant="h6">Actual vs Required Hours</Typography>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Actual Hours</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.3) }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Required Hours</Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Stack>
                  <Chart
                    type="bar"
                    series={[
                      { name: 'Actual Hours', data: chartData.actual },
                      { name: 'Required Hours', data: chartData.billed },
                    ]}
                    options={{
                      chart: { stacked: false, toolbar: { show: false } },
                      plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
                      xaxis: {
                        categories: chartData.categories,
                        labels: { rotate: -45, style: { fontSize: '11px', colors: theme.palette.text.secondary } },
                      },
                      yaxis: {
                        title: { text: 'Hours', style: { color: theme.palette.text.secondary } },
                        labels: { formatter: (val: number) => `${val}`, style: { colors: theme.palette.text.secondary } },
                      },
                      colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.3)],
                      legend: { show: false },
                      grid: { strokeDashArray: 3, borderColor: theme.palette.divider },
                      tooltip: {
                        theme: theme.palette.mode,
                        shared: true,
                        intersect: false,
                        y: { formatter: (val: number) => `${val} hrs` },
                      },
                      annotations: {
                        points: chartData.categories.map((cat: string, i: number) => ({
                          x: cat,
                          y: Math.max(chartData.actual[i], chartData.billed[i]) + 0.5,
                          seriesIndex: 0,
                          marker: { size: 0 },
                          label: {
                            text: `${chartData.efficiency[i]}%`,
                            borderWidth: 0,
                            style: {
                              background: getEffBg(chartData.efficiency[i]),
                              color: '#fff',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: { left: 8, right: 8, top: 4, bottom: 4 },
                            },
                            borderRadius: 6,
                          },
                        })),
                      },
                    }}
                    height={400}
                  />
                </Card>
              </Box>
            )}

            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>
            )}
            {!isLoading && groupedByDate.length === 0 && (
                <Box sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>No records found for the selected period</Typography>
                </Box>
            )}
            {!isLoading && groupedByDate.length > 0 && (
                groupedByDate.map(([date, dateRecords]) => {
                  const dayCompleted = dateRecords.filter((r: any) => r.clockOut);
                  const dayHours = dayCompleted.reduce((s: number, r: any) => s + (r.totalHours || 0), 0);
                  const dayWithEff = dayCompleted.filter((r: any) => r.efficiency != null);
                  const dayAvgEff = dayWithEff.length > 0
                    ? Math.round(dayWithEff.reduce((s: number, r: any) => s + r.efficiency, 0) / dayWithEff.length)
                    : 0;
                  const isToday = date === today;

                  return (
                    <Box key={date}>
                      {/* Date header */}
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ px: 2.5, py: 1.5, bgcolor: alpha('#2065D1', 0.04), borderTop: '1px solid', borderColor: 'divider' }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Iconify icon="solar:calendar-bold-duotone" width={20} sx={{ color: '#2065D1' }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {isToday ? 'Today' : formatDateShort(date)}
                          </Typography>
                          <Chip label={`${dateRecords.length} records`} size="small" variant="soft" />
                        </Stack>
                        <Stack direction="row" spacing={2.5} alignItems="center">
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Hours: <strong>{dayHours.toFixed(1)}</strong>
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Avg Efficiency:</Typography>
                            <Chip label={`${dayAvgEff}%`} size="small" variant="soft" color={getEffChipColor(dayAvgEff)} />
                          </Stack>
                        </Stack>
                      </Stack>

                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ pl: 3, width: 48 }}>#</TableCell>
                              <TableCell>Name</TableCell>
                              <TableCell>Clock in</TableCell>
                              <TableCell>Clock out</TableCell>
                              <TableCell>Total Hours</TableCell>
                              <TableCell>Billed Hours</TableCell>
                              <TableCell>Time efficiency</TableCell>
                              <TableCell>Shift Period</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>Department</TableCell>
                              <TableCell align="center">Edit</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dateRecords.map((record: any, index: number) => {
                              const eff = record.efficiency;
                              const initials = (record.worker?.name || '')
                                .split(' ')
                                .map((n: string) => n[0])
                                .join('');

                              return (
                                <TableRow key={record._id} hover>
                                  <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                                  <TableCell>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1.5}
                                      onClick={() => setDetailRecord(record)}
                                      sx={{ cursor: 'pointer', '&:hover': { opacity: 0.7 } }}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 32,
                                          height: 32,
                                          fontSize: 13,
                                          fontWeight: 700,
                                          bgcolor: alpha('#2065D1', 0.08),
                                          color: '#2065D1',
                                        }}
                                      >
                                        {initials}
                                      </Avatar>
                                      <Typography variant="subtitle2" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                                        {record.worker?.name || '—'}
                                      </Typography>
                                    </Stack>
                                  </TableCell>
                                  <TableCell>{formatTime(record.clockIn) || '—'}</TableCell>
                                  <TableCell>{record.clockOut ? formatTime(record.clockOut) : '—'}</TableCell>
                                  <TableCell>
                                    {record.totalHours != null ? `${record.totalHours} hrs` : '—'}
                                  </TableCell>
                                  <TableCell>
                                    {record.billedHours != null ? `${record.billedHours} hrs` : '—'}
                                  </TableCell>
                                  <TableCell>
                                    {eff != null ? (
                                      <Chip label={`${eff}%`} size="small" variant="soft" color={getEffChipColor(eff)} />
                                    ) : '—'}
                                  </TableCell>
                                  <TableCell>{record.shiftPeriod ?? '—'}</TableCell>
                                  <TableCell>
                                    {record.status === 'manual' ? (
                                      <Tooltip title={record.note || 'Corrected'} arrow>
                                        <Chip label="Corrected" size="small" variant="soft" color="warning" />
                                      </Tooltip>
                                    ) : (
                                      <Chip label="Normal" size="small" variant="soft" color="success" />
                                    )}
                                  </TableCell>
                                  <TableCell>{record.department ?? '—'}</TableCell>
                                  <TableCell align="center">
                                    <Tooltip title="Edit Record">
                                      <IconButton size="small" onClick={() => handleOpenEdit(record)}>
                                        <Iconify icon="solar:pen-bold" width={18} />
                                      </IconButton>
                                    </Tooltip>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  );
                })
            )}
          </Box>
        )}
      </Card>

      {/* Manual Edit Dialog */}
      <Dialog open={editDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Clock Record</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Worker" value={editRecord?.worker?.name || ''} disabled />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Clock In"
                type="time"
                value={editClockIn}
                onChange={(e) => setEditClockIn(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Clock Out"
                type="time"
                value={editClockOut}
                onChange={(e) => setEditClockOut(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Billed Hours"
                type="number"
                value={editBilledHours}
                onChange={(e) => setEditBilledHours(e.target.value)}
                inputProps={{ step: 0.01, min: 0 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={hasChanges ? 'Reason for change (required)' : 'Reason for change'}
                placeholder="Explain why this record needs manual adjustment..."
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                error={hasChanges && editNote.trim().length === 0}
                helperText={
                  hasChanges && editNote.trim().length === 0
                    ? 'A reason is required when making changes'
                    : ''
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={!canSave || updateClockRecord.isPending}
          >
            {updateClockRecord.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============ CLOCK DETAIL MODAL ============ */}
      <Dialog
        open={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
      >
        {detailRecord && (() => {
          const rec = detailRecord;
          const isCorrected = rec.status === 'manual';
          const isActive = !rec.clockOut;
          const initials = (rec.worker?.name || '').split(' ').map((n: string) => n[0]).join('');

          let durationText = '—';
          let durationPct = 0;
          if (rec.clockIn && rec.clockOut) {
            const diffMs = new Date(rec.clockOut).getTime() - new Date(rec.clockIn).getTime();
            const hrs = Math.floor(diffMs / 3600000);
            const mins = Math.round((diffMs % 3600000) / 60000);
            durationText = `${hrs}h ${mins}m`;
            durationPct = Math.min((diffMs / (10 * 3600000)) * 100, 100); // 10h = full bar
          }

          const fmtDetailDate = (v: string | null | undefined) => {
            if (!v) return '—';
            const d = new Date(v);
            if (d.toISOString().split('T')[0] === today) return 'Today';
            return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
          };
          const fmtDetailTime = (v: string | null | undefined) => {
            if (!v) return '—';
            return new Date(v).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
          };
          const fmtDetailDateTime = (v: string | null | undefined) => {
            if (!v) return '—';
            return `${fmtDetailDate(v)}, ${fmtDetailTime(v)}`;
          };

          return (
            <>
              {/* Header */}
              <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: alpha('#2065D1', 0.08),
                        color: '#2065D1',
                        fontWeight: 700,
                        fontSize: 17,
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ lineHeight: 1.3 }}>{rec.worker?.name}</Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
                        <Chip label={rec.department || 'N/A'} size="small" variant="soft" sx={{ height: 22, fontSize: 11 }} />
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>&middot;</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{fmtDetailDate(rec.date)}</Typography>
                      </Stack>
                    </Box>
                  </Stack>

                  <IconButton size="small" onClick={() => setDetailRecord(null)} sx={{ color: 'text.secondary' }}>
                    <Iconify icon="mingcute:close-line" width={20} />
                  </IconButton>
                </Stack>
              </Box>

              <Divider />

              <DialogContent sx={{ p: 0 }}>
                {/* Clock In / Out timeline */}
                <Box sx={{ px: 3, py: 3 }}>
                  {/* Timeline row */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {/* Clock In */}
                    <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 90 }}>
                      <Box sx={{ p: 1.25, borderRadius: '50%', bgcolor: alpha('#22C55E', 0.08), display: 'inline-flex' }}>
                        <Iconify icon="solar:login-3-bold-duotone" width={24} sx={{ color: '#22C55E' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {fmtDetailTime(rec.clockIn)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        In
                      </Typography>
                    </Stack>

                    {/* Progress bar connector */}
                    <Box sx={{ flex: 1, position: 'relative' }}>
                      <Box sx={{ height: 6, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.08), overflow: 'hidden' }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: isActive ? '40%' : `${durationPct}%`,
                            borderRadius: 3,
                            bgcolor: isActive ? 'info.main' : 'primary.main',
                            transition: 'width 0.5s ease',
                            ...(isActive && {
                              background: `linear-gradient(90deg, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.3)})`,
                            }),
                          }}
                        />
                      </Box>
                      {/* Duration label centered */}
                      <Stack alignItems="center" sx={{ mt: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: isActive ? 'info.main' : 'text.primary' }}>
                          {isActive ? 'In progress' : durationText}
                        </Typography>
                        {rec.totalHours != null && !isActive && (
                          <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 11 }}>
                            {rec.totalHours} hrs logged
                          </Typography>
                        )}
                      </Stack>
                    </Box>

                    {/* Clock Out */}
                    <Stack alignItems="center" spacing={0.5} sx={{ minWidth: 90 }}>
                      <Box sx={{
                        p: 1.25,
                        borderRadius: '50%',
                        bgcolor: alpha(isActive ? '#919EAB' : '#FF5630', 0.08),
                        display: 'inline-flex',
                        ...(isActive && { border: '2px dashed', borderColor: alpha('#919EAB', 0.3) }),
                      }}>
                        <Iconify icon="solar:logout-3-bold-duotone" width={24} sx={{ color: isActive ? '#919EAB' : '#FF5630' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2, color: isActive ? 'text.disabled' : 'text.primary' }}>
                        {isActive ? '—' : fmtDetailTime(rec.clockOut)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        Out
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {/* Info chips row */}
                <Box sx={{ px: 3, pb: 2.5 }}>
                  <Stack direction="row" spacing={1}>
                    <Chip
                      icon={<Iconify icon="solar:clock-circle-bold" width={16} />}
                      label={rec.shiftPeriod || '—'}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: 'divider', color: 'text.secondary' }}
                    />
                    {isActive ? (
                      <Chip
                        icon={<Iconify icon="svg-spinners:pulse-3" width={14} />}
                        label="Currently Active"
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    ) : (
                      <Chip
                        icon={<Iconify icon="solar:check-circle-bold" width={16} />}
                        label="Shift Complete"
                        size="small"
                        color="success"
                        variant="soft"
                      />
                    )}
                    {isCorrected && (
                      <Chip
                        icon={<Iconify icon="solar:pen-new-round-bold" width={14} />}
                        label="Corrected"
                        size="small"
                        color="warning"
                        variant="soft"
                      />
                    )}
                  </Stack>
                </Box>

                {/* Correction details */}
                {isCorrected && (
                  <>
                    <Divider />
                    <Box sx={{ px: 3, py: 2.5 }}>
                      <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: 10, letterSpacing: 1.2, mb: 1.5, display: 'block' }}>
                        Correction Details
                      </Typography>
                      <Stack spacing={1.5}>
                        {rec.correctedBy && (
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: alpha('#FFAB00', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Iconify icon="solar:user-bold" width={16} sx={{ color: '#FFAB00' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', lineHeight: 1.2 }}>Corrected by</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{rec.correctedBy}</Typography>
                            </Box>
                          </Stack>
                        )}
                        {rec.correctedAt && (
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: alpha('#00B8D9', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Iconify icon="solar:clock-circle-bold" width={16} sx={{ color: '#00B8D9' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', lineHeight: 1.2 }}>When</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{fmtDetailDateTime(rec.correctedAt)}</Typography>
                            </Box>
                          </Stack>
                        )}
                        {rec.note && (
                          <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: alpha('#919EAB', 0.06), border: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block', mb: 0.5 }}>Note</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                              {rec.note}
                            </Typography>
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </>
                )}
              </DialogContent>

              <Divider />
              <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={() => setDetailRecord(null)} color="inherit">Close</Button>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="solar:pen-bold" width={18} />}
                  onClick={() => { handleOpenEdit(rec); setDetailRecord(null); }}
                >
                  Edit Record
                </Button>
              </DialogActions>
            </>
          );
        })()}
      </Dialog>
    </Box>
  );
}
