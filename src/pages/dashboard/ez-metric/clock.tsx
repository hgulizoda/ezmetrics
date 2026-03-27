import { useCallback, useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

import { useClockRecords, useUpdateClockRecord } from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

const today = new Date().toISOString().split('T')[0];

function formatTime(value: string | null | undefined): string | null {
  if (!value) return null;
  return new Date(value).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

export default function ClockPage() {
  const [tab, setTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [editClockIn, setEditClockIn] = useState('');
  const [editClockOut, setEditClockOut] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editShiftPeriod, setEditShiftPeriod] = useState('');
  const [editNote, setEditNote] = useState('');
  const [origValues, setOrigValues] = useState({ clockIn: '', clockOut: '', date: '', shiftPeriod: '' });

  const { data: records = [], isLoading } = useClockRecords();
  const updateClockRecord = useUpdateClockRecord();

  const todayRecords = records.filter((r: any) => {
    const recordDate = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
    return recordDate === today;
  });
  const activeWorkers = todayRecords.filter((r: any) => !r.clockOut);
  const displayedRecords = tab === 0 ? todayRecords : records;

  const handleOpenEdit = useCallback((record: any) => {
    const clockInVal = record.clockIn ? new Date(record.clockIn).toTimeString().slice(0, 5) : '';
    const clockOutVal = record.clockOut ? new Date(record.clockOut).toTimeString().slice(0, 5) : '';
    const dateVal = record.date ? new Date(record.date).toISOString().split('T')[0] : today;
    const shiftVal = record.shiftPeriod || '';

    setEditRecord(record);
    setEditClockIn(clockInVal);
    setEditClockOut(clockOutVal);
    setEditDate(dateVal);
    setEditShiftPeriod(shiftVal);
    setEditNote('');
    setOrigValues({ clockIn: clockInVal, clockOut: clockOutVal, date: dateVal, shiftPeriod: shiftVal });
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
    editShiftPeriod !== origValues.shiftPeriod;

  const canSave = !hasChanges || editNote.trim().length > 0;

  const handleSaveEdit = useCallback(() => {
    if (!editRecord) return;

    const body: any = {
      note: editNote,
      status: 'manual',
      shiftPeriod: editShiftPeriod,
      date: new Date(`${editDate}T00:00:00`).toISOString(),
    };

    if (editClockIn) {
      body.clockIn = new Date(`${editDate}T${editClockIn}:00`).toISOString();
    }
    if (editClockOut) {
      body.clockOut = new Date(`${editDate}T${editClockOut}:00`).toISOString();
    }

    updateClockRecord.mutate(
      { id: editRecord._id, body },
      { onSuccess: () => handleCloseEdit() }
    );
  }, [editRecord, editClockIn, editClockOut, editDate, editShiftPeriod, editNote, updateClockRecord, handleCloseEdit]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Clock In / Out</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage worker time records
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="soft"
            color="info"
            startIcon={<Iconify icon="solar:download-minimalistic-bold-duotone" />}
          >
            Export Excel
          </Button>
        </Stack>
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
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2.5, pt: 1 }}>
          <Tab label="Today" />
          <Tab label="All Records" />
        </Tabs>

        <Box sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <TextField
              size="small"
              type="date"
              defaultValue={today}
              label="Date"
              InputLabelProps={{ shrink: true }}
              sx={{ width: 180 }}
            />
            <TextField size="small" placeholder="Search worker..." sx={{ width: 240 }} />
          </Stack>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
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
                {displayedRecords.map((record: any, index: number) => {
                  const eff = record.efficiency;
                  const effColor =
                    eff === null
                      ? 'text.disabled'
                      : eff >= 100
                        ? '#22C55E'
                        : eff >= 90
                          ? '#FFAB00'
                          : '#FF5630';
                  const initials = (record.worker?.name || '')
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('');

                  return (
                    <TableRow key={record._id} hover>
                      <TableCell sx={{ pl: 3 }}>{index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
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
                          <Typography variant="subtitle2">
                            {record.worker?.name || '—'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {formatTime(record.clockIn) || '—'}
                      </TableCell>
                      <TableCell>
                        {record.clockOut ? formatTime(record.clockOut) : '—'}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: effColor }}
                        >
                          {eff != null ? `${eff}%` : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>{record.shiftPeriod ?? '—'}</TableCell>
                      <TableCell>{record.type ?? '—'}</TableCell>
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Shift Period"
                placeholder="e.g. 7AM-4PM"
                value={editShiftPeriod}
                onChange={(e) => setEditShiftPeriod(e.target.value)}
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
