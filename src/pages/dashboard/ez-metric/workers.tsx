import { useState } from 'react';
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
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { useWorkers, useCreateWorker } from 'src/modules/ez-metric/api';

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

const INITIAL_FORM = {
  name: '',
  phone: '',
  position: '',
  language: 'English',
  salaryType: 'Hourly',
  rate: '',
};

export default function WorkersPage() {
  const theme = useTheme();
  const [search, setSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { data: workers = [], isLoading } = useWorkers();
  const createWorker = useCreateWorker();

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
  };

  const handleSubmit = async () => {
    try {
      await createWorker.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        position: formData.position,
        language: formData.language,
        salaryType: formData.salaryType,
        rate: Number(formData.rate),
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create worker:', error);
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
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Workers Management</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {workers.length} workers registered
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 1.5 }}
        >
          Add Worker
        </Button>
      </Stack>

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
        <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
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
                      <IconButton size="small">
                        <Iconify icon="solar:pen-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View Details">
                      <IconButton size="small">
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
        <DialogTitle>Add New Worker</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" value={formData.name} onChange={handleChange('name')} />
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
              <TextField fullWidth select label="Salary Type" value={formData.salaryType} onChange={handleChange('salaryType')}>
                <MenuItem value="Hourly">Hourly</MenuItem>
                <MenuItem value="Percentage">Percentage</MenuItem>
                <MenuItem value="Flat">Flat Rate</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Rate" type="number" value={formData.rate} onChange={handleChange('rate')} />
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
            disabled={createWorker.isPending || !formData.name || !formData.phone}
          >
            {createWorker.isPending ? 'Adding...' : 'Add Worker'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
