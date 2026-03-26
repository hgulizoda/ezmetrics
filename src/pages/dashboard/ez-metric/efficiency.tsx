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
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import Chart from 'src/components/chart';
import { useEfficiency } from 'src/modules/ez-metric/api';

interface WorkerEff {
  _id: string;
  name: string;
  jobs: number;
  actualHours: number;
  billedHours: number;
  efficiency: number | null;
}

function getEffColor(eff: number | null): string {
  if (eff === null) return '#919EAB';
  if (eff >= 90) return '#22C55E';
  if (eff >= 70) return '#00B8D9';
  if (eff >= 50) return '#FFAB00';
  return '#FF5630';
}

export default function EfficiencyPage() {
  const [dateRange, setDateRange] = useState('this-week');

  const { data: efficiencyData = [], isLoading } = useEfficiency() as { data: WorkerEff[] | undefined; isLoading: boolean };

  const totalBilledHours = efficiencyData.reduce((s, w) => s + (w.billedHours || 0), 0);
  const totalActualHours = efficiencyData.reduce((s, w) => s + (w.actualHours || 0), 0);
  const avgEff = efficiencyData.filter((w) => w.efficiency !== null);
  const avgEfficiency = avgEff.length > 0
    ? Math.round(avgEff.reduce((s, w) => s + (w.efficiency || 0), 0) / avgEff.length)
    : 0;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Efficiency Calculator</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Worker performance tracking
          </Typography>
        </Box>
        <TextField
          select
          size="small"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="today">Today</MenuItem>
          <MenuItem value="this-week">This Week</MenuItem>
          <MenuItem value="this-month">This Month</MenuItem>
          <MenuItem value="custom">Custom Range</MenuItem>
        </TextField>
      </Stack>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Billed Hours', value: `${totalBilledHours.toFixed(1)}h`, color: '#2065D1', icon: 'solar:stopwatch-bold-duotone' },
          { label: 'Total Actual Hours', value: `${totalActualHours.toFixed(1)}h`, color: '#00B8D9', icon: 'solar:clock-circle-bold-duotone' },
          { label: 'Avg Efficiency', value: `${avgEfficiency}%`, color: '#22C55E', icon: 'solar:chart-2-bold-duotone' },
          { label: 'Total Jobs', value: efficiencyData.reduce((s, w) => s + (w.jobs || 0), 0).toString(), color: '#FFAB00', icon: 'solar:case-round-bold-duotone' },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${alpha(s.color, 0.2)}` }}>
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

      <Grid container spacing={3}>
        {/* Bar Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Billed Hours by Technician</Typography>
            <Chart
              type="bar"
              series={[
                { name: 'Billed Hours', data: efficiencyData.map((w) => w.billedHours || 0) },
              ]}
              options={{
                chart: { toolbar: { show: false } },
                plotOptions: { bar: { columnWidth: '50%', borderRadius: 4, distributed: true } },
                xaxis: {
                  categories: efficiencyData.map((w) => (w.name || '').split(' ')[0]),
                  labels: { rotate: -45, style: { fontSize: '11px' } },
                },
                colors: efficiencyData.map((w) => getEffColor(w.efficiency)),
                legend: { show: false },
                tooltip: { y: { formatter: (val: number) => `${val} hrs` } },
                grid: { strokeDashArray: 3 },
              }}
              height={340}
            />
          </Card>
        </Grid>

        {/* Efficiency Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Efficiency Distribution</Typography>
            <Chart
              type="donut"
              series={[
                efficiencyData.filter((w) => w.efficiency !== null && w.efficiency >= 80).length,
                efficiencyData.filter((w) => w.efficiency !== null && w.efficiency >= 50 && w.efficiency < 80).length,
                efficiencyData.filter((w) => w.efficiency !== null && w.efficiency < 50).length,
                efficiencyData.filter((w) => w.efficiency === null).length,
              ]}
              options={{
                labels: ['High (80%+)', 'Medium (50-80%)', 'Low (<50%)', 'N/A'],
                colors: ['#22C55E', '#FFAB00', '#FF5630', '#919EAB'],
                legend: { position: 'bottom' },
                plotOptions: { pie: { donut: { size: '70%' } } },
                stroke: { width: 0 },
              }}
              height={300}
            />
          </Card>
        </Grid>

        {/* Efficiency Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
              <Typography variant="h6">Worker Efficiency Table</Typography>
              <Chip label={`${efficiencyData.length} workers`} size="small" variant="soft" />
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Jobs</TableCell>
                    <TableCell align="right">Actual Hours</TableCell>
                    <TableCell align="right">Billed Hours</TableCell>
                    <TableCell align="center">Efficiency</TableCell>
                    <TableCell sx={{ width: 200 }}>Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {efficiencyData.map((worker, index) => (
                    <TableRow key={worker._id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell><Typography variant="subtitle2">{worker.name}</Typography></TableCell>
                      <TableCell align="right">{worker.jobs}</TableCell>
                      <TableCell align="right">{(worker.actualHours || 0).toFixed(2)} hrs</TableCell>
                      <TableCell align="right">{(worker.billedHours || 0).toFixed(2)} hrs</TableCell>
                      <TableCell align="center">
                        {worker.efficiency !== null ? (
                          <Chip
                            label={`${worker.efficiency}%`}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: alpha(getEffColor(worker.efficiency), 0.12),
                              color: getEffColor(worker.efficiency),
                            }}
                          />
                        ) : (
                          <Typography variant="caption" sx={{ color: 'text.disabled' }}>N/A</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {worker.efficiency !== null ? (
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(worker.efficiency, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 1,
                              bgcolor: alpha(getEffColor(worker.efficiency), 0.16),
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 1,
                                bgcolor: getEffColor(worker.efficiency),
                              },
                            }}
                          />
                        ) : (
                          <LinearProgress
                            variant="determinate"
                            value={0}
                            sx={{ height: 8, borderRadius: 1, bgcolor: alpha('#919EAB', 0.12) }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
