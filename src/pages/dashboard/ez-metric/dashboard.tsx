import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { useWorkers, useDashboardSummary } from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

function getEffBg(eff: number): string {
  if (eff >= 105) return '#22C55E';
  if (eff >= 100) return '#00B8D9';
  return '#FFAB00';
}

// ---------- mock chart data (no dedicated API yet) ----------
const BILLED = [52, 58, 62, 55, 68, 42];
const CLOCKED = [48, 55, 58, 50, 64, 38];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const EFF = DAYS.map((_, i) => (CLOCKED[i] ? Math.round((BILLED[i] / CLOCKED[i]) * 100) : 0));

const WEEKLY_HOURS = {
  categories: DAYS,
  series: [
    { name: 'Billed Hours', data: BILLED },
    { name: 'Clocked Hours', data: CLOCKED },
  ],
};

export default function EZMetricDashboard() {
  const theme = useTheme();

  const {
    data: summary,
    isLoading: loadingSummary,
    refetch: refetchSummary,
  } = useDashboardSummary();
  const { data: workers, isLoading: loadingWorkers, refetch: refetchWorkers } = useWorkers();

  const handleRefresh = () => {
    refetchSummary();
    refetchWorkers();
  };

  // ---------- derive summary cards from API ----------
  const summaryCards = useMemo(() => {
    if (!summary) return [];
    return [
      {
        title: 'Total Workers',
        value: String(summary.totalWorkers ?? 0),
        icon: 'solar:users-group-rounded-bold-duotone',
        color: '#2065D1',
        change: `${summary.todayClockedIn ?? 0} clocked in today`,
      },
      {
        title: 'On Shift Now',
        value: String(summary.onShift ?? 0),
        icon: 'solar:clock-circle-bold-duotone',
        color: '#00B8D9',
        change: summary.totalWorkers
          ? `${Math.round(((summary.onShift ?? 0) / summary.totalWorkers) * 100)}% active`
          : '0% active',
      },
      {
        title: 'Avg Efficiency',
        value: `${summary.avgEfficiency ?? 0}%`,
        icon: 'solar:chart-2-bold-duotone',
        color: '#22C55E',
        change: `${summary.todayCompleted ?? 0} completed today`,
      },
      {
        title: 'Total Billed Hours',
        value: String(summary.totalBilledHours ?? 0),
        icon: 'solar:stopwatch-bold-duotone',
        color: '#FFAB00',
        change: `${summary.totalJobs ?? 0} jobs`,
      },
    ];
  }, [summary]);

  // ---------- derive attendance donut from API ----------
  const onShiftCount = summary?.onShift ?? 0;
  const totalWorkers = summary?.totalWorkers ?? 0;
  const _offShiftCount = totalWorkers - onShiftCount;

  // ---------- derive active count for workers section ----------
  const activeWorkerCount = useMemo(() => {
    if (!workers) return 0;
    return workers.filter((w: any) => w.status === 'active' || w.status === 'on-shift').length;
  }, [workers]);

  // ---------- loading state ----------
  if (loadingSummary || loadingWorkers) {
    return (
      <Box
        sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            EZ Metric - Workforce Overview
          </Typography>
        </Box>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: theme.customShadows?.card,
                background: `linear-gradient(135deg, ${alpha(card.color, 0.08)} 0%, ${alpha(card.color, 0.02)} 100%)`,
                border: `1px solid ${alpha(card.color, 0.12)}`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(card.color, 0.12),
                  }}
                >
                  <Iconify icon={card.icon} width={32} sx={{ color: card.color }} />
                </Box>
                <Box>
                  <Typography variant="h3">{card.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {card.title}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="caption"
                sx={{ color: 'text.disabled', mt: 1.5, display: 'block' }}
              >
                {card.change}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid item xs={12} md={8} width="100%">
        <Card sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Weekly Hours Overview
          </Typography>
          <Chart
            type="bar"
            series={WEEKLY_HOURS.series}
            options={{
              chart: { stacked: false, toolbar: { show: false } },
              plotOptions: {
                bar: { columnWidth: '40%', borderRadius: 4 },
              },
              xaxis: { categories: WEEKLY_HOURS.categories },
              colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.3)],
              legend: { position: 'top', horizontalAlign: 'right' },
              grid: { strokeDashArray: 3 },
              tooltip: { y: { formatter: (val: number) => `${val} hrs` } },
              annotations: {
                points: DAYS.map((day, i) => ({
                  x: day,
                  y: Math.max(BILLED[i], CLOCKED[i]) + 3,
                  seriesIndex: 0,
                  marker: { size: 0 },
                  label: {
                    text: `${EFF[i]}%`,
                    borderWidth: 0,
                    style: {
                      background: getEffBg(EFF[i]),
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: { left: 8, right: 8, top: 4, bottom: 4 },
                    },
                    borderRadius: 6,
                  },
                })),
              },
            }}
            height={320}
          />
        </Card>

        {/* Worker Status Cards */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, borderRadius: 2 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6">Worker Status</Typography>
              <Chip
                label={`${activeWorkerCount} Active`}
                color="success"
                size="small"
                variant="soft"
              />
            </Stack>

            <Grid container spacing={2}>
              {(workers ?? []).map((worker: any) => {
                const isActive = worker.status === 'active' || worker.status === 'on-shift';
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={worker._id}>
                    <Card
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        borderColor: isActive ? alpha('#22C55E', 0.3) : alpha('#FF5630', 0.2),
                        bgcolor: isActive ? alpha('#22C55E', 0.04) : alpha('#FF5630', 0.02),
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: isActive ? alpha('#22C55E', 0.12) : alpha('#FF5630', 0.12),
                            color: isActive ? '#22C55E' : '#FF5630',
                            fontSize: 14,
                            fontWeight: 700,
                          }}
                        >
                          {(worker.name || '')
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle2" noWrap>
                            {worker.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {worker.position || '—'}
                          </Typography>
                        </Box>
                        <Chip
                          label={isActive ? 'Active' : 'Off'}
                          size="small"
                          color={isActive ? 'success' : 'error'}
                          variant="soft"
                          sx={{ fontSize: 11 }}
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{
                          mt: 1.5,
                          px: 1.5,
                          py: 0.75,
                          borderRadius: 1.5,
                          bgcolor: alpha(theme.palette.text.primary, 0.04),
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify
                            icon="solar:login-3-bold-duotone"
                            width={14}
                            sx={{ color: worker.clockIn ? '#22C55E' : 'text.disabled' }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            In:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: worker.clockIn ? 'text.primary' : 'text.disabled',
                            }}
                          >
                            {worker.clockIn
                              ? new Date(worker.clockIn).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.text.disabled, 0.4),
                          }}
                        />

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Iconify
                            icon="solar:logout-3-bold-duotone"
                            width={14}
                            sx={{ color: worker.clockOut ? '#FF5630' : 'text.disabled' }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Out:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 600,
                              color: worker.clockOut ? 'text.primary' : 'text.disabled',
                            }}
                          >
                            {worker.clockOut
                              ? new Date(worker.clockOut).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
