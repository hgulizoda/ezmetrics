import { useNavigate } from 'react-router-dom';
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
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { exportCsv } from 'src/utils/exportCsv';

import { useWorkers, useClockRecords, useUpdateClockRecord } from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

function getEffColor(eff: number | null): string {
  if (eff === null) return 'text.disabled';
  if (eff >= 100) return '#22C55E';
  if (eff >= 90) return '#FFAB00';
  return '#FF5630';
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
  const [editNote, setEditNote] = useState('');
  const [origValues, setOrigValues] = useState({ clockIn: '', clockOut: '', date: '' });

  // All Records filters
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>('last7');
  const [customFrom, setCustomFrom] = useState(daysAgoDate(7));
  const [customTo, setCustomTo] = useState(today);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { data: records = [], isLoading } = useClockRecords();
  const { data: workers = [] } = useWorkers();
  const updateClockRecord = useUpdateClockRecord();

  const todayRecords = records.filter((r: any) => {
    const recordDate = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
    return recordDate === today;
  });
  const activeWorkers = todayRecords.filter((r: any) => !r.clockOut);

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
  }, [records, dateRange, searchQuery]);

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

  const _displayedRecords = tab === 0 ? todayRecords : filteredRecords;

  const clockCsvHeaders = ['Name', 'Date', 'Clock In', 'Clock Out', 'Total Hours', 'Efficiency', 'Shift Period', 'Type', 'Department', 'Status'];
  const clockCsvRow = (r: any) => [
    r.worker?.name || '', r.date ? new Date(r.date).toISOString().split('T')[0] : '',
    formatTime(r.clockIn) || '', r.clockOut ? formatTime(r.clockOut) : '',
    r.totalHours ?? '', r.efficiency != null ? `${r.efficiency}%` : '',
    r.shiftPeriod || '', r.type || '', r.department || '', r.status || '',
  ];
  const exportToday = () => exportCsv('clock-today', clockCsvHeaders, todayRecords.map(clockCsvRow));
  const exportAllRecords = () => exportCsv('clock-records', clockCsvHeaders, filteredRecords.map(clockCsvRow));

  const handleOpenEdit = useCallback((record: any) => {
    const clockInVal = record.clockIn ? new Date(record.clockIn).toTimeString().slice(0, 5) : '';
    const clockOutVal = record.clockOut ? new Date(record.clockOut).toTimeString().slice(0, 5) : '';
    const dateVal = record.date ? new Date(record.date).toISOString().split('T')[0] : today;

    setEditRecord(record);
    setEditClockIn(clockInVal);
    setEditClockOut(clockOutVal);
    setEditDate(dateVal);
    setEditNote('');
    setOrigValues({ clockIn: clockInVal, clockOut: clockOutVal, date: dateVal });
    setEditDialog(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditDialog(false);
    setEditRecord(null);
  }, []);

  const hasChanges =
    editClockIn !== origValues.clockIn ||
    editClockOut !== origValues.clockOut ||
    editDate !== origValues.date;

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

    updateClockRecord.mutate(
      { id: editRecord._id, body },
      { onSuccess: () => handleCloseEdit() }
    );
  }, [editRecord, editClockIn, editClockOut, editDate, editNote, updateClockRecord, handleCloseEdit]);

  // Table row renderer (shared between both tabs)
  const renderRow = (record: any, index: number, showDate: boolean) => {
    const eff = record.efficiency;
    const effColor = getEffColor(eff);
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
            onClick={() => {
              const matched = (workers as any[]).find((w) => w.name === record.worker?.name);
              if (matched) navigate(`/dashboard/clock/${matched._id}`);
            }}
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
          <Typography variant="body2" sx={{ fontWeight: 600, color: effColor }}>
            {eff != null ? `${eff}%` : '—'}
          </Typography>
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ pl: 3, width: 48 }}>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Clock in</TableCell>
                    <TableCell>Clock out</TableCell>
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
                      <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
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
                  size="small"
                  placeholder="Search worker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ minWidth: 220 }}
                />
              </Stack>

              {/* Period summary bar */}
              <Stack direction="row" spacing={3} sx={{ mb: 0, px: 1 }}>
                {[
                  { label: 'Days', value: periodStats.daysCount, color: '#2065D1' },
                  { label: 'Records', value: periodStats.totalRecords, color: '#7635DC' },
                  { label: 'Completed', value: periodStats.completedShifts, color: '#FFAB00' },
                  { label: 'Total Hours', value: periodStats.totalHours, color: '#22C55E' },
                  { label: 'Avg Efficiency', value: `${periodStats.avgEfficiency}%`, color: getEffColor(periodStats.avgEfficiency) },
                ].map((stat) => (
                  <Stack key={stat.label} direction="row" spacing={0.75} alignItems="center">
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: stat.color }} />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{stat.label}:</Typography>
                    <Typography variant="subtitle2">{stat.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>

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
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Avg Efficiency:{' '}
                            <Typography component="span" variant="caption" sx={{ fontWeight: 700, color: getEffColor(dayAvgEff) }}>
                              {dayAvgEff}%
                            </Typography>
                          </Typography>
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
                              const effColor = getEffColor(eff);
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
                                      onClick={() => {
                                        const matched = (workers as any[]).find((w) => w.name === record.worker?.name);
                                        if (matched) navigate(`/dashboard/clock/${matched._id}`);
                                      }}
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
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: effColor }}>
                                      {eff != null ? `${eff}%` : '—'}
                                    </Typography>
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
    </Box>
  );
}
