import { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha } from '@mui/material/styles';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { useWorkers, useClockRecords, useUpdateClockRecord } from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const today = new Date().toISOString().split('T')[0];

function formatTime(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  if (d.toISOString().split('T')[0] === today) return 'Today';
  return d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—';
  return `${formatDate(value)}, ${formatTime(value)}`;
}

// ----------------------------------------------------------------------

export default function ClockDetailPage() {
  const { workerId, recordId } = useParams();
  const navigate = useNavigate();

  const [editDialog, setEditDialog] = useState(false);
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

  const record = useMemo(
    () => (records as any[]).find((r) => r._id === recordId),
    [records, recordId]
  );

  const handleOpenEdit = useCallback(() => {
    if (!record) return;
    const clockInVal = record.clockIn ? new Date(record.clockIn).toTimeString().slice(0, 5) : '';
    const clockOutVal = record.clockOut ? new Date(record.clockOut).toTimeString().slice(0, 5) : '';
    const dateVal = record.date ? new Date(record.date).toISOString().split('T')[0] : today;

    setEditClockIn(clockInVal);
    setEditClockOut(clockOutVal);
    setEditDate(dateVal);
    setEditNote('');
    setOrigValues({ clockIn: clockInVal, clockOut: clockOutVal, date: dateVal });
    setEditDialog(true);
  }, [record]);

  const handleCloseEdit = useCallback(() => setEditDialog(false), []);

  const hasChanges =
    editClockIn !== origValues.clockIn ||
    editClockOut !== origValues.clockOut ||
    editDate !== origValues.date;

  const canSave = !hasChanges || editNote.trim().length > 0;

  const handleSaveEdit = useCallback(() => {
    if (!record) return;
    const body: any = {
      note: editNote,
      status: 'manual',
      date: `${editDate}T00:00:00Z`,
    };
    if (editClockIn) body.clockIn = `${editDate}T${editClockIn}:00Z`;
    if (editClockOut) body.clockOut = `${editDate}T${editClockOut}:00Z`;

    updateClockRecord.mutate(
      { id: record._id, body },
      { onSuccess: () => handleCloseEdit() }
    );
  }, [record, editClockIn, editClockOut, editDate, editNote, updateClockRecord, handleCloseEdit]);

  // Loading
  if (loadingWorkers || loadingRecords) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Not found
  if (!worker || !record) {
    return (
      <Box sx={{ p: 3 }}>
        <IconButton onClick={() => navigate('/dashboard/clock')} sx={{ mb: 2 }}>
          <Iconify icon="solar:arrow-left-bold" />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Record not found.
        </Typography>
      </Box>
    );
  }

  const initials = (worker.name || '').split(' ').map((n: string) => n[0]).join('');
  const isCorrected = record.status === 'manual';
  const isActive = !record.clockOut;

  // Calculate duration
  let durationText = '—';
  if (record.clockIn && record.clockOut) {
    const diffMs = new Date(record.clockOut).getTime() - new Date(record.clockIn).getTime();
    const hrs = Math.floor(diffMs / 3600000);
    const mins = Math.round((diffMs % 3600000) / 60000);
    durationText = `${hrs}h ${mins}m`;
  }

  return (
    <Box sx={{ p: 3, maxWidth: 720, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard/clock')}>
          <Iconify icon="solar:arrow-left-bold" />
        </IconButton>
        <Typography variant="h5" sx={{ flex: 1 }}>Clock Detail</Typography>
        <Chip
          label={formatDate(record.date)}
          size="small"
          variant="soft"
          color="default"
          icon={<Iconify icon="solar:calendar-bold" width={16} />}
        />
      </Stack>

      {/* Worker card */}
      <Card sx={{ p: 2.5, borderRadius: 2, mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: alpha('#2065D1', 0.1),
              color: '#2065D1',
              fontWeight: 700,
              fontSize: 17,
            }}
          >
            {initials}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">{worker.name}</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {worker.position} &middot; {worker.department ?? 'N/A'}
            </Typography>
          </Box>
          {isActive ? (
            <Chip label="Currently Active" color="info" variant="soft" size="small" icon={<Iconify icon="svg-spinners:pulse-3" width={14} />} />
          ) : (
            <Chip label="Completed" color="success" variant="soft" size="small" />
          )}
        </Stack>
      </Card>

      {/* Clock In / Out visual */}
      <Card sx={{ borderRadius: 2, mb: 2, overflow: 'visible' }}>
        <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} sx={{ minHeight: 130 }}>
          {/* Clock In */}
          <Box sx={{ flex: 1, p: 3, textAlign: 'center' }}>
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: alpha('#22C55E', 0.1), display: 'inline-flex' }}>
                <Iconify icon="solar:login-3-bold-duotone" width={28} sx={{ color: '#22C55E' }} />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Clock In
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {formatTime(record.clockIn)}
              </Typography>
            </Stack>
          </Box>

          {/* Duration */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, minWidth: 120 }}>
            <Iconify icon="solar:arrow-right-bold" width={20} sx={{ color: 'text.disabled', mb: 0.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {isActive ? '—' : durationText}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {record.totalHours != null ? `${record.totalHours} hrs logged` : 'In progress'}
            </Typography>
          </Box>

          {/* Clock Out */}
          <Box sx={{ flex: 1, p: 3, textAlign: 'center' }}>
            <Stack alignItems="center" spacing={1}>
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: alpha(isActive ? '#919EAB' : '#FF5630', 0.1), display: 'inline-flex' }}>
                <Iconify icon="solar:logout-3-bold-duotone" width={28} sx={{ color: isActive ? '#919EAB' : '#FF5630' }} />
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Clock Out
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: isActive ? 'text.disabled' : 'text.primary' }}>
                {isActive ? '—' : formatTime(record.clockOut)}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        {/* Shift info strip */}
        <Box sx={{ px: 3, py: 1.5, bgcolor: 'background.neutral', borderTop: '1px dashed', borderColor: 'divider' }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Shift: <strong>{record.shiftPeriod || '—'}</strong>
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Department: <strong>{record.department || '—'}</strong>
            </Typography>
          </Stack>
        </Box>
      </Card>

      {/* Correction banner */}
      {isCorrected && (
        <Card sx={{ borderRadius: 2, mb: 2, border: '1px solid', borderColor: alpha('#FFAB00', 0.3), bgcolor: alpha('#FFAB00', 0.04) }}>
          <Box sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="flex-start" spacing={1.5}>
              <Box sx={{ p: 1, borderRadius: '50%', bgcolor: alpha('#FFAB00', 0.12), display: 'inline-flex', flexShrink: 0, mt: 0.2 }}>
                <Iconify icon="solar:pen-new-round-bold-duotone" width={20} sx={{ color: '#FFAB00' }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ color: 'warning.dark', mb: 0.5 }}>
                  This record was manually corrected
                </Typography>

                <Stack spacing={1}>
                  {record.correctedBy && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:user-bold" width={16} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>Corrected by:</strong> {record.correctedBy}
                      </Typography>
                    </Stack>
                  )}

                  {record.correctedAt && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:clock-circle-bold" width={16} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">
                        <strong>When:</strong> {formatDateTime(record.correctedAt)}
                      </Typography>
                    </Stack>
                  )}

                  {record.note && (
                    <Stack direction="row" alignItems="flex-start" spacing={1}>
                      <Iconify icon="solar:document-text-bold" width={16} sx={{ color: 'text.secondary', mt: 0.3 }} />
                      <Typography variant="body2">
                        <strong>Note:</strong> {record.note}
                      </Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Card>
      )}

      {/* Edit button */}
      <Box sx={{ textAlign: 'right' }}>
        <Button
          variant="soft"
          color="primary"
          startIcon={<Iconify icon="solar:pen-bold" width={18} />}
          onClick={handleOpenEdit}
        >
          Edit Record
        </Button>
      </Box>

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
