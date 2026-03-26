import { useState, useMemo } from 'react';
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
import MenuItem from '@mui/material/MenuItem';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import Chart from 'src/components/chart';
import { useReportTotals, useReportTrends } from 'src/modules/ez-metric/api';

export default function ReportsPage() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const { data: workers = [], isLoading: loadingTotals } = useReportTotals();
  const { data: trends = [], isLoading: loadingTrends } = useReportTrends();

  const totalJobs = useMemo(
    () => workers.reduce((s: number, w: any) => s + (w.jobs || 0), 0),
    [workers]
  );

  const totalLaborSales = useMemo(
    () =>
      workers.reduce(
        (s: number, w: any) =>
          s + parseFloat((w.laborSales || '$0').replace(/[$,]/g, '')),
        0
      ),
    [workers]
  );

  const totalBilledHours = useMemo(
    () =>
      workers
        .reduce(
          (s: number, w: any) =>
            s + parseFloat((w.billedTime || '0').replace(/[^0-9.]/g, '')),
          0
        )
        .toFixed(2),
    [workers]
  );

  const trendCategories = useMemo(() => trends.map((t: any) => t.month), [trends]);

  const trendSeries = useMemo(
    () => [
      { name: 'Total Payroll', data: trends.map((t: any) => t.totalPayroll || 0) },
      {
        name: 'Labor Sales',
        data: trends.map((t: any) => {
          if (typeof t.laborSales === 'number') return t.laborSales;
          return parseFloat((t.laborSales || '0').replace(/[$,]/g, ''));
        }),
      },
    ],
    [trends]
  );

  const isLoading = loadingTotals || loadingTrends;

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
          <Typography variant="h4">Reports</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Financial, employee, and performance reports
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="soft" color="info" startIcon={<Iconify icon="solar:download-minimalistic-bold-duotone" />}>
            Export Excel
          </Button>
          <Button variant="soft" color="warning" startIcon={<Iconify icon="solar:letter-bold-duotone" />}>
            Send Weekly Statement
          </Button>
        </Stack>
      </Stack>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Jobs', value: `${totalJobs}`, color: '#2065D1', icon: 'solar:case-round-bold-duotone' },
          { label: 'Total Billed Hours', value: `${totalBilledHours} hrs`, color: '#00B8D9', icon: 'solar:stopwatch-bold-duotone' },
          { label: 'Total Labor Sales', value: `$${totalLaborSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#22C55E', icon: 'solar:dollar-minimalistic-bold-duotone' },
          { label: 'Workers', value: `${workers.length}`, color: '#FFAB00', icon: 'solar:users-group-rounded-bold-duotone' },
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

      {/* Filters */}
      <Card sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
          <TextField size="small" type="date" label="From" defaultValue="2026-01-25" InputLabelProps={{ shrink: true }} sx={{ width: 160 }} />
          <TextField size="small" type="date" label="To" defaultValue="2026-01-31" InputLabelProps={{ shrink: true }} sx={{ width: 160 }} />
          <TextField size="small" select label="Category" defaultValue="all" sx={{ width: 160 }}>
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="technician">Technician</MenuItem>
            <MenuItem value="fleet">Fleet Department</MenuItem>
          </TextField>
          <TextField size="small" select label="Technician" defaultValue="all" sx={{ width: 180 }}>
            <MenuItem value="all">All Technicians</MenuItem>
            {workers.map((w: any) => <MenuItem key={w._id || w.name} value={w.name}>{w.name}</MenuItem>)}
          </TextField>
          <Button variant="contained" startIcon={<Iconify icon="solar:magnifer-bold" />}>Filter</Button>
        </Stack>
      </Card>

      <Card sx={{ borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2.5, pt: 1 }}>
          <Tab label="Financial Reports" />
          <Tab label="Employee Reports" />
          <Tab label="Trends" />
        </Tabs>

        {tab === 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell align="right">Jobs</TableCell>
                  <TableCell align="right">Billed Time</TableCell>
                  <TableCell align="right">Clocked Time</TableCell>
                  <TableCell align="center">Efficiency</TableCell>
                  <TableCell align="right">Labor Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                  <TableCell><Typography variant="subtitle1" sx={{ fontWeight: 700 }}>TOTAL</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{totalJobs} jobs</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{totalBilledHours} hrs</Typography></TableCell>
                  <TableCell align="right"><Typography variant="subtitle2" sx={{ fontWeight: 700 }}>0.00 hrs</Typography></TableCell>
                  <TableCell align="center"><Chip label="N/A" size="small" variant="soft" /></TableCell>
                  <TableCell align="right"><Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#22C55E' }}>${totalLaborSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography></TableCell>
                </TableRow>
                {workers.map((w: any) => (
                  <TableRow key={w._id || w.name} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        {w.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">{w.jobs}</TableCell>
                    <TableCell align="right">{w.billedTime}</TableCell>
                    <TableCell align="right">{w.clockedTime}</TableCell>
                    <TableCell align="center">
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>{w.efficiency}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">{w.laborSales}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
              Click on a worker name in the Financial Reports tab to view detailed per-worker breakdown including clock-in times, worked hours, billed hours, efficiency, and salary.
            </Typography>
            <Grid container spacing={2}>
              {workers.slice(0, 6).map((w: any) => (
                <Grid item xs={12} sm={6} md={4} key={w._id || w.name}>
                  <Card variant="outlined" sx={{ p: 2.5, borderRadius: 2, cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>{w.name}</Typography>
                    <Stack spacing={0.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Jobs</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{w.jobs}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Billed Hours</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>{w.billedTime}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Labor Sales</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#22C55E' }}>{w.laborSales}</Typography>
                      </Stack>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {tab === 2 && (
          <Box sx={{ p: 3 }}>
            <Chart
              type="area"
              series={trendSeries}
              options={{
                chart: { toolbar: { show: false } },
                xaxis: { categories: trendCategories },
                colors: [theme.palette.primary.main, '#22C55E'],
                fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.1 } },
                stroke: { width: 2.5, curve: 'smooth' },
                legend: { position: 'top', horizontalAlign: 'right' },
                grid: { strokeDashArray: 3 },
                tooltip: { y: { formatter: (val: number) => `$${val.toLocaleString()}` } },
              }}
              height={360}
            />
          </Box>
        )}
      </Card>
    </Box>
  );
}
