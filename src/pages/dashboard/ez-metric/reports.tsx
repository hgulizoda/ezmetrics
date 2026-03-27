import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useReportTotals, useReportTrends } from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

export default function ReportsPage() {
  const theme = useTheme();
  const [dateRange, setDateRange] = useState('this-month');

  const { data: reportTotals = [], isLoading: totalsLoading } = useReportTotals();
  const { data: reportTrends = [], isLoading: trendsLoading } = useReportTrends();

  const summaryStats = useMemo(() => {
    const totalJobs = reportTotals.reduce((s: number, w: any) => s + (w.jobs || 0), 0);
    const totalLaborSales = reportTotals.reduce((s: number, w: any) => {
      const val = parseFloat((w.laborSales || '$0').replace(/[$,]/g, ''));
      return s + val;
    }, 0);
    const avgEfficiency = reportTotals.length > 0
      ? Math.round(
          reportTotals.reduce((s: number, w: any) => s + parseInt(w.efficiency || '0', 10), 0) /
            reportTotals.length
        )
      : 0;
    return { totalJobs, totalLaborSales, avgEfficiency, totalWorkers: reportTotals.length };
  }, [reportTotals]);

  if (totalsLoading || trendsLoading) {
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
          <Typography variant="h4">Reports</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Labor performance and payroll trends
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <TextField
            select
            size="small"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ width: 180 }}
          >
            <MenuItem value="this-week">This Week</MenuItem>
            <MenuItem value="this-month">This Month</MenuItem>
            <MenuItem value="last-month">Last Month</MenuItem>
            <MenuItem value="this-year">This Year</MenuItem>
          </TextField>
          <Button
            variant="soft"
            color="info"
            startIcon={<Iconify icon="solar:download-minimalistic-bold-duotone" />}
          >
            Export Excel
          </Button>
        </Stack>
      </Stack>

      {/* Summary Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Workers', value: summaryStats.totalWorkers, color: '#2065D1', icon: 'solar:users-group-rounded-bold-duotone' },
          { label: 'Total Jobs', value: summaryStats.totalJobs, color: '#00B8D9', icon: 'solar:case-round-bold-duotone' },
          {
            label: 'Total Labor Sales',
            value: `$${summaryStats.totalLaborSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            color: '#22C55E',
            icon: 'solar:wallet-money-bold-duotone',
          },
          { label: 'Avg Efficiency', value: `${summaryStats.avgEfficiency}%`, color: '#FFAB00', icon: 'solar:chart-2-bold-duotone' },
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

      <Grid container spacing={3}>
        {/* Trends Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Payroll vs Labor Sales Trend</Typography>
            <Chart
              type="area"
              series={[
                { name: 'Total Payroll', data: reportTrends.map((t: any) => t.totalPayroll) },
                { name: 'Labor Sales', data: reportTrends.map((t: any) => t.laborSales) },
              ]}
              options={{
                chart: { toolbar: { show: false }, stacked: false },
                xaxis: { categories: reportTrends.map((t: any) => t.month) },
                colors: [theme.palette.primary.main, '#22C55E'],
                stroke: { width: 2, curve: 'smooth' },
                fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.0 } },
                legend: { position: 'top', horizontalAlign: 'right' },
                grid: { strokeDashArray: 3 },
                tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
              }}
              height={320}
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
                reportTotals.filter((w: any) => parseInt(w.efficiency, 10) >= 100).length,
                reportTotals.filter((w: any) => parseInt(w.efficiency, 10) >= 90 && parseInt(w.efficiency, 10) < 100).length,
                reportTotals.filter((w: any) => parseInt(w.efficiency, 10) < 90).length,
              ]}
              options={{
                labels: ['High (100%+)', 'Good (90-100%)', 'Below 90%'],
                colors: ['#22C55E', '#00B8D9', '#FF5630'],
                legend: { position: 'bottom' },
                plotOptions: { pie: { donut: { size: '70%' } } },
                stroke: { width: 0 },
              }}
              height={300}
            />
          </Card>
        </Grid>

        {/* Worker Totals Table */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
              <Typography variant="h6">Worker Performance Totals</Typography>
              <Box sx={{ flex: 1 }} />
              <Chip label={`${reportTotals.length} workers`} size="small" variant="soft" />
            </Stack>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Worker</TableCell>
                    <TableCell align="right">Jobs</TableCell>
                    <TableCell align="right">Billed Time</TableCell>
                    <TableCell align="right">Clocked Time</TableCell>
                    <TableCell align="center">Efficiency</TableCell>
                    <TableCell align="right">Labor Sales</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportTotals.map((worker: any, index: number) => {
                    const eff = parseInt(worker.efficiency || '0', 10);
                    let effColor = '#FF5630';
                    if (eff >= 100) effColor = '#22C55E';
                    else if (eff >= 90) effColor = '#00B8D9';
                    return (
                      <TableRow key={worker._id} hover>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2">{worker.name}</Typography>
                        </TableCell>
                        <TableCell align="right">{worker.jobs}</TableCell>
                        <TableCell align="right">{worker.billedTime}</TableCell>
                        <TableCell align="right">{worker.clockedTime}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={worker.efficiency}
                            size="small"
                            sx={{
                              fontWeight: 700,
                              bgcolor: alpha(effColor, 0.12),
                              color: effColor,
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ color: '#22C55E' }}>
                            {worker.laborSales}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
