import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
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
import FormControlLabel from '@mui/material/FormControlLabel';

import { useShifts, useCreateShift, useDeleteShift } from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

const INITIAL_FORM = {
  name: '',
  startTime: '07:00',
  endTime: '16:00',
  breakMinutes: 30,
  color: '#2065D1',
};

const COLOR_OPTIONS = [
  { label: 'Blue', value: '#2065D1' },
  { label: 'Amber', value: '#FFAB00' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Purple', value: '#7635DC' },
  { label: 'Cyan', value: '#00B8D9' },
  { label: 'Red', value: '#FF5630' },
];

function calcHours(start: string, end: string, breakMin: number): number {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const total = (eh * 60 + em - (sh * 60 + sm) - breakMin) / 60;
  return Math.max(0, Math.round(total * 100) / 100);
}

export default function ShiftsPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: shifts = [], isLoading } = useShifts();
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleOpenDialog = () => {
    setFormData(INITIAL_FORM);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      await createShift.mutateAsync({
        ...formData,
        breakMinutes: Number(formData.breakMinutes),
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create shift:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteShift.mutateAsync(id);
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete shift:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const activeShifts = shifts.filter((s: any) => s.active);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Shift Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure and manage work shifts
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 1.5 }}
        >
          Add Shift
        </Button>
      </Stack>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Shifts', value: shifts.length, color: '#2065D1', icon: 'solar:calendar-bold-duotone' },
          { label: 'Active Shifts', value: activeShifts.length, color: '#22C55E', icon: 'solar:check-circle-bold-duotone' },
          { label: 'Inactive Shifts', value: shifts.length - activeShifts.length, color: '#FF5630', icon: 'solar:close-circle-bold-duotone' },
          {
            label: 'Avg Hours',
            value: shifts.length > 0
              ? `${(shifts.reduce((s: number, sh: any) => s + (sh.totalHours || 0), 0) / shifts.length).toFixed(1)}h`
              : '0h',
            color: '#FFAB00',
            icon: 'solar:clock-circle-bold-duotone',
          },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${alpha(stat.color, 0.2)}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(stat.color, 0.1) }}>
                  <Iconify icon={stat.icon} width={24} sx={{ color: stat.color }} />
                </Box>
                <Box>
                  <Typography variant="h5">{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Shifts Table */}
      <Card sx={{ borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
          <Typography variant="h6">Shift List</Typography>
          <Box sx={{ flex: 1 }} />
          <Chip label={`${shifts.length} shifts`} size="small" variant="soft" />
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shift Name</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell align="right">Break (min)</TableCell>
                <TableCell align="right">Total Hours</TableCell>
                <TableCell align="center">Color</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shifts.map((shift: any) => (
                <TableRow key={shift._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: shift.color || '#2065D1',
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="subtitle2">{shift.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{shift.startTime}</TableCell>
                  <TableCell>{shift.endTime}</TableCell>
                  <TableCell align="right">{shift.breakMinutes} min</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${shift.totalHours}h`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: alpha(shift.color || '#2065D1', 0.12),
                        color: shift.color || '#2065D1',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: shift.color || '#2065D1',
                        mx: 'auto',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <FormControlLabel
                      control={<Switch checked={shift.active} size="small" />}
                      label=""
                      sx={{ m: 0 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <Iconify icon="solar:pen-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(shift._id)}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Shift Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Shift</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Shift Name"
                placeholder="e.g. Morning Shift"
                value={formData.name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={handleChange('startTime')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={handleChange('endTime')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Break (minutes)"
                type="number"
                value={formData.breakMinutes}
                onChange={handleChange('breakMinutes')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Color"
                value={formData.color}
                onChange={handleChange('color')}
              >
                {COLOR_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: opt.value }} />
                      <span>{opt.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Card
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: 1.5,
                  bgcolor: alpha(formData.color, 0.04),
                  border: `1px solid ${alpha(formData.color, 0.2)}`,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Calculated total hours:{' '}
                  <strong style={{ color: formData.color }}>
                    {calcHours(formData.startTime, formData.endTime, Number(formData.breakMinutes))}h
                  </strong>
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createShift.isPending || !formData.name}
          >
            {createShift.isPending ? 'Adding...' : 'Add Shift'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Shift</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this shift? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteId && handleDelete(deleteId)}
            disabled={deleteShift.isPending}
          >
            {deleteShift.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
