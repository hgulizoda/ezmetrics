import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { useShifts, useCreateShift, useDeleteShift } from 'src/modules/ez-metric/api';

function getProgressColor(pct: number): string {
  if (pct >= 100) return '#22C55E';
  if (pct >= 75) return '#FFAB00';
  return '#FF5630';
}

const WORKER_HOURS = [
  { worker: 'Justin Naranjo', shift: 'Day Shift', scheduled: 8.0, worked: 8.55, overtime: 0.55, breakTaken: 60, net: 7.55 },
  { worker: 'Emilio Rivera', shift: 'Morning Shift', scheduled: 7.5, worked: 8.28, overtime: 0.78, breakTaken: 30, net: 7.78 },
  { worker: 'Jeffrey Alvarez', shift: 'Day Shift', scheduled: 8.0, worked: 8.75, overtime: 0.75, breakTaken: 60, net: 7.75 },
  { worker: 'Miguel Retana', shift: 'Full Day', scheduled: 11.0, worked: 9.75, overtime: 0, breakTaken: 60, net: 8.75 },
  { worker: 'Bernardo Grossi', shift: 'Morning Shift', scheduled: 7.5, worked: 5.3, overtime: 0, breakTaken: 30, net: 4.8 },
  { worker: 'Islam A', shift: 'Day Shift', scheduled: 8.0, worked: 8.0, overtime: 0, breakTaken: 60, net: 7.0 },
];

const DEFAULT_COLORS = ['#FFAB00', '#2065D1', '#7635DC', '#22C55E', '#FF5630', '#00B8D9'];

export default function ShiftsPage() {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formStartTime, setFormStartTime] = useState('07:00');
  const [formEndTime, setFormEndTime] = useState('16:00');
  const [formBreakMinutes, setFormBreakMinutes] = useState(60);
  const [formColor, setFormColor] = useState('#2065D1');

  // API hooks
  const { data: shifts = [], isLoading } = useShifts();
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();

  const resetForm = () => {
    setFormName('');
    setFormStartTime('07:00');
    setFormEndTime('16:00');
    setFormBreakMinutes(60);
    setFormColor('#2065D1');
  };

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCreate = async () => {
    try {
      await createShift.mutateAsync({
        name: formName,
        startTime: formStartTime,
        endTime: formEndTime,
        breakMinutes: formBreakMinutes,
        color: formColor,
      });
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to create shift:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShift.mutateAsync(id);
    } catch (error) {
      console.error('Failed to delete shift:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Shift Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Define shifts and track working hours
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
          onClick={handleOpenDialog}
        >
          Create Shift
        </Button>
      </Stack>

      {/* Shift Cards */}
      {isLoading ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {shifts.map((shift: any, index: number) => {
            const color = shift.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
            return (
              <Grid item xs={12} sm={6} md={3} key={shift._id}>
                <Card
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    borderTop: `4px solid ${color}`,
                    '&:hover': { boxShadow: theme.customShadows?.z16 },
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {shift.name}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Edit">
                        <IconButton size="small"><Iconify icon="solar:pen-bold" width={16} /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(shift._id)}
                          disabled={deleteShift.isPending}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:clock-circle-bold" width={18} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {shift.startTime} - {shift.endTime}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:cup-hot-bold" width={18} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{shift.breakMinutes} min break</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:stopwatch-bold" width={18} sx={{ color: 'text.secondary' }} />
                      <Typography variant="body2">{shift.totalHours}h net hours</Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ mt: 2, pt: 2, borderTop: `1px dashed ${alpha(color, 0.3)}` }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Shift
                      </Typography>
                      <Chip
                        label={shift.active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: alpha(color, 0.12),
                          color,
                          fontWeight: 600,
                          fontSize: 11,
                        }}
                      />
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Daily Worked Hours */}
      <Card sx={{ borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6">Daily Worked Hours Breakdown</Typography>
          <TextField size="small" type="date" defaultValue="2026-03-24" InputLabelProps={{ shrink: true }} sx={{ width: 180 }} />
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Worker</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell align="right">Scheduled</TableCell>
                <TableCell align="right">Worked</TableCell>
                <TableCell align="right">Break</TableCell>
                <TableCell align="right">Net Hours</TableCell>
                <TableCell align="right">Overtime</TableCell>
                <TableCell>Progress</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {WORKER_HOURS.map((wh) => {
                const pct = Math.min((wh.net / wh.scheduled) * 100, 120);
                return (
                  <TableRow key={wh.worker} hover>
                    <TableCell><Typography variant="subtitle2">{wh.worker}</Typography></TableCell>
                    <TableCell><Chip label={wh.shift} size="small" variant="soft" /></TableCell>
                    <TableCell align="right">{wh.scheduled}h</TableCell>
                    <TableCell align="right">{wh.worked}h</TableCell>
                    <TableCell align="right">{wh.breakTaken}min</TableCell>
                    <TableCell align="right"><Typography variant="subtitle2">{wh.net}h</Typography></TableCell>
                    <TableCell align="right">
                      {wh.overtime > 0 ? (
                        <Chip label={`+${wh.overtime}h`} size="small" color="warning" variant="soft" sx={{ fontWeight: 700 }} />
                      ) : (
                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>-</Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ width: 160 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(pct, 100)}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: alpha(getProgressColor(pct), 0.16),
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 1,
                            bgcolor: getProgressColor(pct),
                          },
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create Shift Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Shift</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shift Name"
                placeholder="e.g. Morning Shift"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={formStartTime}
                onChange={(e) => setFormStartTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={formEndTime}
                onChange={(e) => setFormEndTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Break Duration"
                value={formBreakMinutes}
                onChange={(e) => setFormBreakMinutes(Number(e.target.value))}
              >
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={45}>45 minutes</MenuItem>
                <MenuItem value={60}>60 minutes</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Color"
                value={formColor}
                onChange={(e) => setFormColor(e.target.value)}
              >
                {DEFAULT_COLORS.map((c) => (
                  <MenuItem key={c} value={c}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: c }} />
                      <span>{c}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!formName || createShift.isPending}
          >
            {createShift.isPending ? 'Creating...' : 'Create Shift'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
