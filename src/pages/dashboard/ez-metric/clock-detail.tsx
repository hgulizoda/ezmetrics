import { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

import { useWorkers, useClockRecords, useUpdateClockRecord } from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

function getEffColor(eff: number | null): string {
  if (eff == null) return 'text.disabled';
  if (eff >= 100) return '#22C55E';
  if (eff >= 90) return '#FFAB00';
  return '#FF5630';
}

function getEffChipColor(eff: number | null): 'success' | 'info' | 'warning' | 'default' {
  if (eff === null) return 'default';
  if (eff >= 100) return 'success';
  if (eff >= 80) return 'info';
  return 'warning';
}

const today = new Date().toISOString().split('T')[0];

function formatTime(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  const isToday = d.toISOString().split('T')[0] === today;
  if (isToday) return 'Today';
  return d.toLocaleDateString('en', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export default function ClockDetailPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editDialog, setEditDialog] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [editClockIn, setEditClockIn] = useState('');
  const [editClockOut, setEditClockOut] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editNote, setEditNote] = useState('');
  const [origValues, setOrigValues] = useState({ clockIn: '', clockOut: '', date: '' });

  const { data: workers = [], isLoading: loadingWorkers } = useWorkers();
  const { data: records = [], isLoading: loadingRecords } = useClockRecords();
  const updateClockRecord = useUpdateClockRecord();

  const worker = useMemo(
    () => (workers as any[]).find((w) => w._id === workerId),
    [workers, workerId]
  );

  const workerRecords = useMemo(
    () =>
      (records as any[])
        .filter((r) => r.worker?.name === worker?.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [records, worker]
  );

  // Paginated rows
  const paginatedRecords = useMemo(
    () => workerRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [workerRecords, page, rowsPerPage]
  );

  // Chart data synced to current page rows (reversed so oldest is left)
  const chartData = useMemo(() => {
    const rows = [...paginatedRecords].reverse();
    return {
      categories: rows.map((r) => formatDate(r.date)),
      series: rows.map((r) => r.efficiency ?? 0),
    };
  }, [paginatedRecords]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

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

    if (editClockIn) body.clockIn = `${editDate}T${editClockIn}:00Z`;
    if (editClockOut) body.clockOut = `${editDate}T${editClockOut}:00Z`;

    updateClockRecord.mutate(
      { id: editRecord._id, body },
      { onSuccess: () => handleCloseEdit() }
    );
  }, [editRecord, editClockIn, editClockOut, editDate, editNote, updateClockRecord, handleCloseEdit]);

  if (loadingWorkers || loadingRecords) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!worker) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Worker not found.
        </Typography>
      </Box>
    );
  }

  const initials = (worker.name || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('');

  const withEfficiency = workerRecords.filter((r: any) => r.efficiency != null);
  const avgEfficiency = withEfficiency.length
    ? Math.round(withEfficiency.reduce((sum: number, r: any) => sum + r.efficiency, 0) / withEfficiency.length)
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Back button */}
      <IconButton onClick={() => navigate('/dashboard/clock')} sx={{ mb: 2 }}>
        <Iconify icon="solar:arrow-left-bold" />
      </IconButton>

      {/* Employee Info — full width card at top */}
      <Card sx={{ p: 2.5, borderRadius: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: alpha('#2065D1', 0.1),
              color: '#2065D1',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 160 }}>
            <Typography variant="h5">{worker.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {worker.position} &middot; {worker.department ?? 'N/A'}
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} flexWrap="wrap" sx={{ ml: 'auto' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Shift Period
              </Typography>
              <Typography variant="subtitle2">{worker.shiftPeriod ?? '—'}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Type
              </Typography>
              <Typography variant="subtitle2">{worker.type ?? '—'}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                Avg Efficiency
              </Typography>
              <Chip label={`${avgEfficiency}%`} size="small" variant="soft" color={getEffChipColor(avgEfficiency)} />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Total Records
              </Typography>
              <Typography variant="subtitle2">{workerRecords.length}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* Clock Records Table — full width */}
      <Card sx={{ borderRadius: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2.5, pb: 0 }}>
          Clock Records
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Clock In</TableCell>
                <TableCell>Clock Out</TableCell>
                <TableCell align="center">Efficiency</TableCell>
                <TableCell align="right">Worked Hours</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRecords.map((record: any) => {
                  const eff = record.efficiency;

                  return (
                    <TableRow key={record._id} hover>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{formatTime(record.clockIn)}</TableCell>
                      <TableCell>{formatTime(record.clockOut)}</TableCell>
                      <TableCell align="center">
                        {eff != null ? (
                          <Chip label={`${eff}%`} size="small" variant="soft" color={getEffChipColor(eff)} />
                        ) : '—'}
                      </TableCell>
                      <TableCell align="right">
                        {record.totalHours != null ? `${record.totalHours} hrs` : '—'}
                      </TableCell>
                      <TableCell align="center">
                        {record.status === 'manual' ? (
                          <Tooltip title={record.note || 'Corrected'} arrow>
                            <Chip label="Corrected" size="small" variant="soft" color="warning" />
                          </Tooltip>
                        ) : (
                          <Chip label="Normal" size="small" variant="soft" color="success" />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Record">
                          <IconButton size="small" onClick={() => handleOpenEdit(record)}>
                            <Iconify icon="solar:pen-bold" width={18} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={workerRecords.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        />
      </Card>

      {/* Efficiency Chart — full width at bottom, synced to current table page */}
      <Card sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Efficiency
        </Typography>
        {chartData.series.length > 0 ? (
          <Chart
            type="bar"
            series={[{ name: 'Efficiency', data: chartData.series }]}
            options={{
              chart: { toolbar: { show: false }, sparkline: { enabled: false } },
              plotOptions: {
                bar: { columnWidth: '35%', borderRadius: 6 },
              },
              xaxis: { categories: chartData.categories },
              yaxis: { max: 150, labels: { formatter: (v: number) => `${v}%` } },
              colors: [theme.palette.primary.main],
              grid: { strokeDashArray: 3 },
              tooltip: { y: { formatter: (v: number) => `${v}%` } },
              dataLabels: {
                enabled: true,
                formatter: (v: number) => `${v}%`,
                style: { fontSize: '12px', fontWeight: 700 },
              },
            }}
            height={280}
          />
        ) : (
          <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
            No efficiency data
          </Typography>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Clock Record</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="Clock In"
                type="time"
                value={editClockIn}
                onChange={(e) => setEditClockIn(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={3}>
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
