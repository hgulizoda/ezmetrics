import { useMemo, useState } from 'react';
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
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import CircularProgress from '@mui/material/CircularProgress';

import {
  useWorkers,
  useSalary,
  useClockRecords,
  useOvertimeRecords,
  useChargedEmployees,
  useLoans,
} from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

function getEffColor(eff: number | null): string {
  if (eff == null) return 'text.disabled';
  if (eff >= 100) return '#22C55E';
  if (eff >= 90) return '#FFAB00';
  return '#FF5630';
}

function formatTime(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return d.toLocaleDateString('en', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatRate(salaryType: string, rate: number): string {
  if (salaryType === 'Flat') return `$${rate.toLocaleString()}/mo`;
  if (salaryType === 'Percentage') return `${rate}%`;
  return `$${rate}/hr`;
}

function getSalaryTypeColor(salaryType: string): 'info' | 'secondary' | 'warning' {
  if (salaryType === 'Hourly') return 'info';
  if (salaryType === 'Percentage') return 'secondary';
  return 'warning';
}

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export default function WorkerDetailPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { data: workers = [], isLoading: loadingWorkers } = useWorkers();
  const { data: records = [], isLoading: loadingRecords } = useClockRecords();
  const { data: salaryData = [] } = useSalary();
  const { data: overtimeRecords = [] } = useOvertimeRecords();
  const { data: chargedEmployees = [] } = useChargedEmployees();
  const { data: loans = [] } = useLoans();

  const worker = useMemo(
    () => (workers as any[]).find((w) => w._id === workerId),
    [workers, workerId]
  );

  const workerSalary = useMemo(
    () => (salaryData as any[]).find((s) => s._id === workerId),
    [salaryData, workerId]
  );

  const workerRecords = useMemo(
    () =>
      (records as any[])
        .filter((r) => r.worker?.name === worker?.name)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [records, worker]
  );

  const workerOvertime = useMemo(
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

  const paginatedRecords = useMemo(
    () => workerRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [workerRecords, page, rowsPerPage]
  );

  const chartData = useMemo(() => {
    const rows = [...workerRecords].reverse().slice(-10);
    return {
      categories: rows.map((r) => formatDate(r.date)),
      series: rows.map((r) => r.efficiency ?? 0),
    };
  }, [workerRecords]);

  const withEfficiency = workerRecords.filter((r: any) => r.efficiency != null);
  const avgEfficiency = withEfficiency.length
    ? Math.round(withEfficiency.reduce((sum: number, r: any) => sum + r.efficiency, 0) / withEfficiency.length)
    : 0;

  const totalHoursWorked = workerRecords.reduce((sum: number, r: any) => sum + (r.totalHours || 0), 0);

  if (loadingWorkers || loadingRecords) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!worker) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Worker not found.
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
      <IconButton onClick={() => navigate('/dashboard/workers')} sx={{ mb: 2 }}>
        <Iconify icon="solar:arrow-left-bold" />
      </IconButton>

      {/* Worker Profile Card */}
      <Card sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} spacing={3}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: alpha('#2065D1', 0.1),
              color: '#2065D1',
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.5 }}>
              <Typography variant="h4">{worker.name}</Typography>
              <Chip
                label={worker.status === 'active' ? 'Active' : 'Inactive'}
                size="small"
                color={worker.status === 'active' ? 'success' : 'default'}
                variant="soft"
              />
            </Stack>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {worker.position} &middot; {worker.department ?? 'N/A'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {worker.phone} &middot; {worker.language}
            </Typography>
          </Box>

          <Stack direction="row" spacing={3} flexWrap="wrap">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Salary Type</Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip label={worker.salaryType} size="small" variant="soft" color={getSalaryTypeColor(worker.salaryType)} />
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Rate</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {formatRate(worker.salaryType, worker.rate)}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Shift</Typography>
              <Typography variant="subtitle2">{worker.shiftPeriod ?? '—'}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>Type</Typography>
              <Typography variant="subtitle2">{worker.type ?? '—'}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Card>

      {/* Stats Row */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Avg Efficiency', value: `${avgEfficiency}%`, color: getEffColor(avgEfficiency), icon: 'solar:chart-2-bold-duotone' },
          { label: 'Total Hours', value: `${totalHoursWorked.toFixed(1)} hrs`, color: '#2065D1', icon: 'solar:clock-circle-bold-duotone' },
          { label: 'Total Records', value: workerRecords.length, color: '#7635DC', icon: 'solar:document-bold-duotone' },
          { label: 'Total Payroll', value: workerSalary ? `$${(workerSalary.totalPayroll || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'N/A', color: '#22C55E', icon: 'solar:wallet-money-bold-duotone' },
        ].map((stat) => (
          <Grid item xs={6} md={3} key={stat.label}>
            <Card sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${alpha(typeof stat.color === 'string' ? stat.color : '#2065D1', 0.2)}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(typeof stat.color === 'string' ? stat.color : '#2065D1', 0.1) }}>
                  <Iconify icon={stat.icon} width={24} sx={{ color: typeof stat.color === 'string' ? stat.color : '#2065D1' }} />
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
        {/* Salary Summary */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Salary Summary</Typography>
            {workerSalary ? (
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Base Salary</Typography>
                  <Typography variant="subtitle2">${(workerSalary.baseSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Bonus</Typography>
                  <Typography variant="subtitle2" sx={{ color: (workerSalary.bonus || 0) >= 0 ? '#22C55E' : '#FF5630' }}>
                    {(workerSalary.bonus || 0) >= 0 ? '+' : '-'}${Math.abs(workerSalary.bonus || 0).toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Overtime</Typography>
                  <Typography variant="subtitle2" sx={{ color: '#FFAB00' }}>
                    ${(workerSalary.overtime || 0).toFixed(2)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Charges</Typography>
                  <Typography variant="subtitle2" sx={{ color: '#FF5630' }}>
                    -${(workerSalary.charge || 0).toFixed(2)}
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Total Payroll</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    ${(workerSalary.totalPayroll || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </Stack>
                {workerSalary.debtLeft > 0 && (
                  <>
                    <Divider />
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2" sx={{ color: '#FF5630' }}>Debt Remaining</Typography>
                      <Typography variant="subtitle2" sx={{ color: '#FF5630' }}>
                        ${workerSalary.debtLeft.toFixed(2)}
                      </Typography>
                    </Stack>
                  </>
                )}
              </Stack>
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
                No salary data
              </Typography>
            )}
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

        {/* Efficiency Chart */}
        <Grid item xs={12}>
          <Card sx={{ p: 2.5, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Efficiency Trend</Typography>
            {chartData.series.length > 0 ? (
              <Chart
                type="area"
                series={[{ name: 'Efficiency', data: chartData.series }]}
                options={{
                  chart: { toolbar: { show: false }, sparkline: { enabled: false } },
                  xaxis: { categories: chartData.categories },
                  yaxis: { max: 150, labels: { formatter: (v: number) => `${v}%` } },
                  colors: [theme.palette.primary.main],
                  grid: { strokeDashArray: 3 },
                  tooltip: { y: { formatter: (v: number) => `${v}%` } },
                  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1 } },
                  stroke: { curve: 'smooth', width: 3 },
                  dataLabels: { enabled: false },
                }}
                height={280}
              />
            ) : (
              <Typography variant="body2" sx={{ color: 'text.secondary', py: 4, textAlign: 'center' }}>
                No efficiency data
              </Typography>
            )}
          </Card>
        </Grid>

        {/* Clock Records Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <Typography variant="h6" sx={{ p: 2.5, pb: 0 }}>Clock Records</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Clock In</TableCell>
                    <TableCell>Clock Out</TableCell>
                    <TableCell align="center">Efficiency</TableCell>
                    <TableCell align="right">Worked Hours</TableCell>
                    <TableCell align="center">Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedRecords.map((record: any) => {
                      const eff = record.efficiency;
                      const effColor = getEffColor(eff);
                      return (
                        <TableRow key={record._id} hover>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>{formatTime(record.clockIn)}</TableCell>
                          <TableCell>{formatTime(record.clockOut)}</TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: effColor }}>
                              {eff != null ? `${eff}%` : '—'}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {record.totalHours != null ? `${record.totalHours} hrs` : '—'}
                          </TableCell>
                          <TableCell align="center">
                            {record.status === 'manual' ? (
                              <Tooltip title={record.note || 'Corrected'} arrow>
                                <Chip label="Corrected" size="small" variant="soft" color="warning" />
                              </Tooltip>
                            ) : (
                              <Chip label="Normal" size="small" variant="soft" color="success" />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={workerRecords.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
