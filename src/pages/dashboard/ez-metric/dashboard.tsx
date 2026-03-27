import { useMemo } from 'react';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useDashboardSummary, useWorkers } from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

// ---------- mock chart data (no dedicated API yet) ----------
const BILLED = [52, 58, 62, 55, 68, 42];
const CLOCKED = [48, 55, 58, 50, 64, 38];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WEEKLY_HOURS = {
  categories: DAYS.map((day, i) => {
    const eff = CLOCKED[i] ? Math.round((BILLED[i] / CLOCKED[i]) * 100) : 0;
    return `${day} (${eff}%)`;
  }),
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
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh}>
            <Iconify icon="solar:refresh-bold-duotone" />
          </IconButton>
        </Tooltip>
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
