import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
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
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useNavigate } from 'react-router-dom';

import { useWorkers, useCreateWorker, useUpdateWorker } from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

function getSalaryTypeColor(salaryType: string): 'info' | 'secondary' | 'warning' {
  if (salaryType === 'Hourly') return 'info';
  if (salaryType === 'Percentage') return 'secondary';
  return 'warning';
}

function formatRate(salaryType: string, rate: number): string {
  if (salaryType === 'Flat') return `$${rate.toLocaleString()}/mo`;
  if (salaryType === 'Percentage') return `${rate}%`;
  return `$${rate}/hr`;
}

function getEfficiencyColor(eff: number): string {
  if (eff >= 80) return '#22C55E';
  if (eff >= 50) return '#FFAB00';
  return '#FF5630';
}

const DEPARTMENTS = ['Shop', 'Fleet', 'Office', 'Warehouse', 'Dispatch'];

function getRateLabel(salaryType: string): string {
  if (salaryType === 'Hourly') return 'Hourly Rate';
  if (salaryType === 'Percentage') return 'Rate (%)';
  return 'Monthly Salary';
}

function getRateAdornment(salaryType: string): { start?: string; end?: string } {
  if (salaryType === 'Hourly') return { start: '$', end: '/hr' };
  if (salaryType === 'Percentage') return { end: '%' };
  return { start: '$', end: '/mo' };
}

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  phone: '',
  position: '',
  language: 'English',
  salaryType: 'Hourly',
  rate: '',
  department: '',
  shiftStart: '',
  shiftEnd: '',
};

export default function WorkersPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const [editingWorkerId, setEditingWorkerId] = useState<string | null>(null);

  const { data: workers = [], isLoading } = useWorkers();
  const createWorker = useCreateWorker();
  const updateWorker = useUpdateWorker();

  const filtered = workers.filter((w: any) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleOpenDialog = () => {
    setFormData(INITIAL_FORM);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(INITIAL_FORM);
    setEditingWorkerId(null);
  };

  const handleEditWorker = (worker: any) => {
    const nameParts = worker.name.split(' ');
    const shiftParts = (worker.shiftPeriod || '').split('-');
    setFormData({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      phone: worker.phone || '',
      position: worker.position || '',
      language: worker.language || 'English',
      salaryType: worker.salaryType || 'Hourly',
      rate: String(worker.rate || ''),
      department: worker.department || '',
      shiftStart: shiftParts[0] || '',
      shiftEnd: shiftParts[1] || '',
    });
    setEditingWorkerId(worker._id);
    setOpenDialog(true);
  };

  const handleDownloadReport = () => {
    const headers = ['Name', 'Phone', 'Position', 'Department', 'Salary Type', 'Rate', 'Hours Worked', 'Efficiency', 'Shift Period', 'Status'];
    const rows = filtered.map((w: any) => [
      w.name,
      w.phone,
      w.position,
      w.department || '',
      w.salaryType,
      formatRate(w.salaryType, w.rate),
      w.hours != null ? Number(w.hours).toFixed(2) : 'N/A',
      w.efficiency != null ? `${w.efficiency}%` : 'N/A',
      w.shiftPeriod || '',
      w.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c: string) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workers-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    const workerData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone,
      position: formData.position,
      language: formData.language,
      salaryType: formData.salaryType,
      rate: Number(formData.rate),
      department: formData.department,
      shiftPeriod: `${formData.shiftStart}-${formData.shiftEnd}`,
    };
    try {
      if (editingWorkerId) {
        await updateWorker.mutateAsync({ id: editingWorkerId, body: workerData });
      } else {
        await createWorker.mutateAsync(workerData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save worker:', error);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Workers Management</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          {workers.length} workers registered
        </Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Workers', value: workers.length, color: '#2065D1', icon: 'solar:users-group-rounded-bold-duotone' },
          { label: 'Active', value: workers.filter((w: any) => w.status === 'active').length, color: '#22C55E', icon: 'solar:check-circle-bold-duotone' },
          { label: 'Hourly', value: workers.filter((w: any) => w.salaryType === 'Hourly').length, color: '#FFAB00', icon: 'solar:clock-circle-bold-duotone' },
          { label: 'Percentage', value: workers.filter((w: any) => w.salaryType === 'Percentage').length, color: '#7635DC', icon: 'solar:graph-up-bold-duotone' },
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

      {/* Table */}
      <Card sx={{ borderRadius: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 3, py: 2 }}
        >
          <Typography variant="h6">Workers</Typography>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Export CSV">
              <IconButton onClick={handleDownloadReport} size="small" sx={{ color: 'text.secondary' }}>
                <Iconify icon="solar:download-minimalistic-bold-duotone" width={22} />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              size="small"
              startIcon={<Iconify icon="solar:add-circle-bold" />}
              onClick={handleOpenDialog}
              sx={{ borderRadius: 1.5 }}
            >
              Add Worker
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            px: 3,
            pb: 2,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          }}
        >
          <TextField
            placeholder="Search workers..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="solar:magnifer-bold-duotone" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Worker</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Salary Type</TableCell>
                <TableCell align="right">Rate</TableCell>
                <TableCell align="right">Hours Worked</TableCell>
                <TableCell align="center">Efficiency</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((worker: any) => (
                <TableRow key={worker._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {worker.name.split(' ').map((n: string) => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">{worker.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{worker.phone}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{worker.position}</TableCell>
                  <TableCell>
                    <Chip
                      label={worker.salaryType}
                      size="small"
                      variant="soft"
                      color={getSalaryTypeColor(worker.salaryType)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {formatRate(worker.salaryType, worker.rate)}
                  </TableCell>
                  <TableCell align="right">
                    {worker.hours != null ? (
                      `${Number(worker.hours).toFixed(2)} hrs`
                    ) : (
                      <Typography component="span" variant="caption" sx={{ color: 'text.disabled' }}>N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {worker.efficiency != null ? (
                      <Chip
                        label={`${worker.efficiency}%`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: alpha(getEfficiencyColor(worker.efficiency), 0.12),
                          color: getEfficiencyColor(worker.efficiency),
                        }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={worker.status === 'active' ? 'Active' : 'Inactive'}
                      size="small"
                      color={worker.status === 'active' ? 'success' : 'default'}
                      variant="soft"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleEditWorker(worker)}>
                        <Iconify icon="solar:pen-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details">
                      <IconButton size="small" onClick={() => navigate(`/dashboard/workers/${worker._id}`)}>
                        <Iconify icon="solar:eye-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Worker Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingWorkerId ? 'Edit Worker' : 'Add New Worker'}</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="First Name" value={formData.firstName} onChange={handleChange('firstName')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Last Name" value={formData.lastName} onChange={handleChange('lastName')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone" value={formData.phone} onChange={handleChange('phone')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Position" value={formData.position} onChange={handleChange('position')} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Language" value={formData.language} onChange={handleChange('language')}>
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="Uzbek">Uzbek</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Department" value={formData.department} onChange={handleChange('department')}>
                {DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Salary Type" value={formData.salaryType} onChange={handleChange('salaryType')}>
                <MenuItem value="Hourly">Hourly</MenuItem>
                <MenuItem value="Percentage">Percentage</MenuItem>
                <MenuItem value="Flat">Flat Rate</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={getRateLabel(formData.salaryType)}
                type="number"
                value={formData.rate}
                onChange={handleChange('rate')}
                InputProps={{
                  startAdornment: getRateAdornment(formData.salaryType).start ? (
                    <InputAdornment position="start">{getRateAdornment(formData.salaryType).start}</InputAdornment>
                  ) : undefined,
                  endAdornment: getRateAdornment(formData.salaryType).end ? (
                    <InputAdornment position="end">{getRateAdornment(formData.salaryType).end}</InputAdornment>
                  ) : undefined,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Shift Start" type="time" value={formData.shiftStart} onChange={handleChange('shiftStart')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Shift End" type="time" value={formData.shiftEnd} onChange={handleChange('shiftEnd')} InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': { borderColor: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.04) },
                }}
              >
                <Iconify icon="solar:camera-bold-duotone" width={48} sx={{ color: 'text.disabled', mb: 1 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Upload worker photo
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={(createWorker.isPending || updateWorker.isPending) || !formData.firstName || !formData.lastName || !formData.phone}
          >
            {(() => {
              if (createWorker.isPending || updateWorker.isPending) return 'Saving...';
              if (editingWorkerId) return 'Save Changes';
              return 'Add Worker';
            })()}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
