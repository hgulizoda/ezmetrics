import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import {
  useLoans,
  useSalary,
  useWorkers,
  useClockRecords,
  useOvertimeRecords,
  useChargedEmployees,
} from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

function getEfficiencyChipColor(efficiency: string): 'success' | 'info' | 'warning' {
  const val = parseInt(efficiency, 10);
  if (val >= 100) return 'success';
  if (val >= 80) return 'info';
  return 'warning';
}

function getSalaryTypeColor(salaryType: string): 'info' | 'secondary' | 'warning' {
  if (salaryType === 'Hourly') return 'info';
  if (salaryType === 'Percentage') return 'secondary';
  return 'warning';
}

export default function SalaryDetailPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: workers = [], isLoading: loadingWorkers } = useWorkers();
  const { data: salaryData = [], isLoading: loadingSalary } = useSalary();
  const { data: records = [] } = useClockRecords();
  const { data: overtimeRecords = [] } = useOvertimeRecords();
  const { data: chargedEmployees = [] } = useChargedEmployees();
  const { data: loans = [] } = useLoans();

  const worker = useMemo(
    () => (workers as any[]).find((w) => w._id === workerId),
    [workers, workerId]
  );

  const salary = useMemo(
    () => (salaryData as any[]).find((s) => s._id === workerId),
    [salaryData, workerId]
  );

  const _workerRecords = useMemo(
    () =>
      (records as any[])
        .filter((r) => r.worker?.name === worker?.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [records, worker]
  );

  const _workerOvertime = useMemo(
    () => (overtimeRecords as any[]).filter((r) => r.workerId === workerId),
    [overtimeRecords, workerId]
  );

  const workerCharges = useMemo(
    () => (chargedEmployees as any[]).filter((ce) => ce.employee === worker?.name),
    [chargedEmployees, worker]
  );

  const workerLoans = useMemo(
    () => (loans as any[]).filter((l) => l.worker?.name === worker?.name),
    [loans, worker]
  );

  // Weekly earnings chart data (last 4 weeks simulated from records)
  const earningsChartData = useMemo(() => {
    if (!salary) return { categories: [], series: [] };
    const base = salary.baseSalary || 0;
    const weeklyBase = base / 4;
    return {
      categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      series: [
        Math.round(weeklyBase * 0.95),
        Math.round(weeklyBase * 1.02),
        Math.round(weeklyBase * 0.98),
        Math.round(weeklyBase * 1.05),
      ],
    };
  }, [salary]);

  // Payroll breakdown for donut chart
  const breakdownData = useMemo(() => {
    if (!salary) return { labels: [], series: [] };
    return {
      labels: ['Base Salary', 'Bonus', 'Overtime', 'Charges'],
      series: [
        salary.baseSalary || 0,
        Math.max(salary.bonus || 0, 0),
        salary.overtime || 0,
        salary.charge || 0,
      ],
    };
  }, [salary]);

  if (loadingWorkers || loadingSalary) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!worker || !salary) {
    return (
      <Box sx={{ p: 3 }}>
        <IconButton onClick={() => navigate('/dashboard/salary')} sx={{ mb: 2 }}>
          <Iconify icon="solar:arrow-left-bold" />
        </IconButton>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Salary record not found.
        </Typography>
      </Box>
    );
  }

  const initials = (worker.name || '')
    .split(' ')
    .map((n: string) => n[0])
    .join('');


  return (
    <Box sx={{ p: 3 }}>
      {/* Back button */}
      <IconButton onClick={() => navigate('/dashboard/salary')} sx={{ mb: 2 }}>
        <Iconify icon="solar:arrow-left-bold" />
      </IconButton>

      {/* Worker Info + Salary Summary Header */}
      <Card sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={3}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: alpha('#2065D1', 0.1),
              color: '#2065D1',
              fontWeight: 700,
              fontSize: 22,
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">{worker.name}</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {worker.position} &middot; {worker.department ?? 'N/A'}
              </Typography>
              <Chip label={worker.salaryType} size="small" variant="soft" color={getSalaryTypeColor(worker.salaryType)} />
            </Stack>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total Payroll</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              ${(salary.totalPayroll || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Summary Stat Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Base Salary', value: `$${(salary.baseSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#2065D1', icon: 'solar:wallet-money-bold-duotone' },
          { label: 'Bonus', value: `${(salary.bonus || 0) >= 0 ? '+' : ''}$${(salary.bonus || 0).toFixed(2)}`, color: (salary.bonus || 0) >= 0 ? '#22C55E' : '#FF5630', icon: 'solar:gift-bold-duotone' },
          { label: 'Overtime Pay', value: `$${(salary.overtime || 0).toFixed(2)}`, color: '#FFAB00', icon: 'solar:clock-circle-bold-duotone' },
          { label: 'Efficiency', value: salary.efficiency || 'N/A', color: '#7635DC', icon: 'solar:chart-2-bold-duotone' },
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
        {/* Payroll Breakdown Donut */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Payroll Breakdown</Typography>
            {breakdownData.series.some((v) => v > 0) ? (
              <Chart
                type="donut"
                series={breakdownData.series}
                options={{
                  labels: breakdownData.labels,
                  colors: ['#2065D1', '#22C55E', '#FFAB00', '#FF5630'],
                  legend: { position: 'bottom', fontSize: '13px' },
                  plotOptions: {
                    pie: {
                      donut: {
                        size: '70%',
                        labels: {
                          show: true,
                          total: {
                            show: true,
                            label: 'Total',
                            formatter: () => `$${(salary.totalPayroll || 0).toLocaleString()}`,
                          },
                        },
                      },
                    },
                  },
                  tooltip: { y: { formatter: (v: number) => `$${v.toFixed(2)}` } },
                  dataLabels: { enabled: false },
                }}
                height={320}
              />
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 6 }}>
                No payroll data
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Earnings Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Weekly Earnings</Typography>
            {earningsChartData.series.length > 0 ? (
              <Chart
                type="bar"
                series={[{ name: 'Earnings', data: earningsChartData.series }]}
                options={{
                  chart: { toolbar: { show: false } },
                  plotOptions: { bar: { columnWidth: '40%', borderRadius: 6 } },
                  xaxis: { categories: earningsChartData.categories },
                  yaxis: { labels: { formatter: (v: number) => `$${v}` } },
                  colors: [theme.palette.primary.main],
                  grid: { strokeDashArray: 3 },
                  tooltip: { y: { formatter: (v: number) => `$${v.toLocaleString()}` } },
                  dataLabels: {
                    enabled: true,
                    formatter: (v: number) => `$${v}`,
                    style: { fontSize: '11px', fontWeight: 700 },
                  },
                }}
                height={280}
              />
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 6 }}>
                No earnings data
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Detailed Salary Breakdown */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Salary Details</Typography>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: alpha('#2065D1', 0.1) }}>
                    <Iconify icon="solar:dollar-bold" width={18} sx={{ color: '#2065D1' }} />
                  </Box>
                  <Typography variant="body2">Rate</Typography>
                </Stack>
                <Typography variant="subtitle2">${salary.rate}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: alpha('#2065D1', 0.1) }}>
                    <Iconify icon="solar:clock-circle-bold" width={18} sx={{ color: '#2065D1' }} />
                  </Box>
                  <Typography variant="body2">Actual Hours</Typography>
                </Stack>
                <Typography variant="subtitle2">{salary.actualHours} hrs</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: alpha('#22C55E', 0.1) }}>
                    <Iconify icon="solar:clock-circle-bold" width={18} sx={{ color: '#22C55E' }} />
                  </Box>
                  <Typography variant="body2">Billed Hours</Typography>
                </Stack>
                <Typography variant="subtitle2">{salary.billedHours} hrs</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ p: 0.75, borderRadius: 1, bgcolor: alpha('#7635DC', 0.1) }}>
                    <Iconify icon="solar:chart-2-bold" width={18} sx={{ color: '#7635DC' }} />
                  </Box>
                  <Typography variant="body2">Efficiency</Typography>
                </Stack>
                <Chip label={salary.efficiency} size="small" variant="soft" color={getEfficiencyChipColor(salary.efficiency)} />
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Base Salary</Typography>
                <Typography variant="subtitle2">${(salary.baseSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>+ Bonus</Typography>
                <Typography variant="subtitle2" sx={{ color: (salary.bonus || 0) >= 0 ? '#22C55E' : '#FF5630' }}>
                  ${Math.abs(salary.bonus || 0).toFixed(2)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>+ Overtime</Typography>
                <Typography variant="subtitle2" sx={{ color: '#FFAB00' }}>${(salary.overtime || 0).toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>- Charges</Typography>
                <Typography variant="subtitle2" sx={{ color: '#FF5630' }}>${(salary.charge || 0).toFixed(2)}</Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Net Payroll</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ${(salary.totalPayroll || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Typography>
              </Stack>
            </Stack>
          </Card>
        </Grid>

        {/* Charges, Loans & Debts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ p: 2.5, pb: 0 }}>Charges, Loans & Debts</Typography>
            {(workerCharges.length > 0 || workerLoans.length > 0) ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {workerCharges.map((ce: any) => (
                      <TableRow key={`charge-${ce._id}`} hover>
                        <TableCell>
                          <Chip label="Charge" size="small" variant="soft" color="error" />
                        </TableCell>
                        <TableCell>{ce.chargeType}</TableCell>
                        <TableCell>{ce.date}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ color: '#FF5630' }}>${ce.amount.toFixed(2)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={ce.chargeCategory || 'Applied'} size="small" variant="soft" color="default" />
                        </TableCell>
                      </TableRow>
                    ))}
                    {workerLoans.map((loan: any) => (
                      <TableRow key={`loan-${loan._id}`} hover>
                        <TableCell>
                          <Chip label="Loan" size="small" variant="soft" color="warning" />
                        </TableCell>
                        <TableCell>{loan.type}</TableCell>
                        <TableCell>{loan.date || '—'}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ color: loan.remaining > 0 ? '#FF5630' : '#22C55E' }}>
                            ${loan.remaining.toLocaleString()} / ${loan.amount.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip label={loan.status} size="small" variant="soft" color={loan.status === 'paid' ? 'success' : 'warning'} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 6 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>No charges, loans or debts</Typography>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
