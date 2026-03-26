import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { useClockRecords, useUpdateClockRecord } from 'src/modules/ez-metric/api';

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
  const [editNote, setEditNote] = useState('');

  const { data: records = [], isLoading } = useClockRecords();
  const updateClockRecord = useUpdateClockRecord();

  const todayRecords = records.filter((r: any) => {
    const recordDate = r.date ? new Date(r.date).toISOString().split('T')[0] : '';
    return recordDate === today;
  });
  const activeWorkers = todayRecords.filter((r: any) => !r.clockOut);
  const displayedRecords = tab === 0 ? todayRecords : records;

  const handleOpenEdit = useCallback((record: any) => {
    setEditRecord(record);
    setEditClockIn(record.clockIn ? new Date(record.clockIn).toTimeString().slice(0, 5) : '');
    setEditClockOut(record.clockOut ? new Date(record.clockOut).toTimeString().slice(0, 5) : '');
    setEditNote('');
    setEditDialog(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setEditDialog(false);
    setEditRecord(null);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editRecord) return;

    const recordDate = editRecord.date
      ? new Date(editRecord.date).toISOString().split('T')[0]
      : today;

    const body: any = {
      note: editNote,
      status: 'manual',
    };

    if (editClockIn) {
      body.clockIn = new Date(`${recordDate}T${editClockIn}:00`).toISOString();
    }
    if (editClockOut) {
      body.clockOut = new Date(`${recordDate}T${editClockOut}:00`).toISOString();
    }

    updateClockRecord.mutate(
      { id: editRecord._id, body },
      { onSuccess: () => handleCloseEdit() }
    );
  }, [editRecord, editClockIn, editClockOut, editNote, updateClockRecord, handleCloseEdit]);

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
                  <TableCell>Worker</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Clock In</TableCell>
                  <TableCell>Clock Out</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell align="center">Type</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRecords.map((record: any) => (
                  <TableRow key={record._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{record.worker?.name || '-'}</Typography>
                    </TableCell>
                    <TableCell>
                      {record.date ? new Date(record.date).toISOString().split('T')[0] : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatTime(record.clockIn) || '-'}
                        size="small"
                        variant="soft"
                        color="success"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      {record.clockOut ? (
                        <Chip label={formatTime(record.clockOut)} size="small" variant="soft" color="error" sx={{ fontWeight: 600 }} />
                      ) : (
                        <Chip label="In Progress" size="small" variant="soft" color="warning" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {record.totalHours != null ? `${record.totalHours}h` : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={record.status === 'auto' ? 'Auto' : 'Manual'}
                        size="small"
                        variant="soft"
                        color={record.status === 'auto' ? 'info' : 'warning'}
                        icon={<Iconify icon={record.status === 'auto' ? 'solar:clock-circle-bold' : 'solar:pen-bold'} width={14} />}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {record.note || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Edit Record">
                        <IconButton size="small" onClick={() => handleOpenEdit(record)}>
                          <Iconify icon="solar:pen-bold-duotone" width={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
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
                label="Reason for edit (required)"
                placeholder="Explain why this record needs manual adjustment..."
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveEdit}
            disabled={updateClockRecord.isPending}
          >
            {updateClockRecord.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
