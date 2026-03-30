import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { useEfficiencyHistory } from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';
import Iconify from 'src/components/iconify';

interface DailyRecord {
  workerId: string;
  workerName: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut: string;
  efficiency: number;
  actualHours: number;
  billedHours: number;
}

function getEffColor(eff: number): string {
  if (eff >= 100) return '#22C55E';
  if (eff >= 90) return '#FFAB00';
  return '#FF5630';
}

function getEffChipColor(eff: number): 'success' | 'info' | 'warning' {
  if (eff >= 100) return 'success';
  if (eff >= 80) return 'info';
  return 'warning';
}

function getEffBg(eff: number): string {
  if (eff >= 90) return '#22C55E';
  return '#FFAB00';
}

export default function EfficiencyPage() {
  const theme = useTheme();
  const [department, setDepartment] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: records = [], isLoading } = useEfficiencyHistory() as {
    data: DailyRecord[];
    isLoading: boolean;
  };

  // Departments list
  const departments = useMemo(() => {
    const set = new Set(records.map((r) => r.department));
    return ['All', ...Array.from(set).sort()];
  }, [records]);

  // Filter by department + date range
  const filtered = useMemo(() => {
    let result = records;

    if (department !== 'All') {
      result = result.filter((r) => r.department === department);
    }

    if (startDate) {
      result = result.filter((r) => r.date >= startDate);
    }

    if (endDate) {
      result = result.filter((r) => r.date <= endDate);
    }

    return result;
  }, [records, department, startDate, endDate]);

  const dates = useMemo(() => {
    const set = new Set(filtered.map((r) => r.date));
    return Array.from(set).sort();
  }, [filtered]);

  const workers = useMemo(() => {
    const map = new Map<string, { name: string; dept: string }>();
    filtered.forEach((r) => {
      if (!map.has(r.workerId)) map.set(r.workerId, { name: r.workerName, dept: r.department });
    });
    return Array.from(map.entries()).map(([id, v]) => ({ id, name: v.name, dept: v.dept }));
  }, [filtered]);

  // Per-worker aggregates
  const workerAgg = useMemo(() => {
    const map = new Map<
      string,
      { totalActual: number; totalExpected: number; effSum: number; count: number }
    >();
    filtered.forEach((r) => {
      const prev = map.get(r.workerId) || { totalActual: 0, totalExpected: 0, effSum: 0, count: 0 };
      map.set(r.workerId, {
        totalActual: prev.totalActual + r.actualHours,
        totalExpected: prev.totalExpected + r.billedHours,
        effSum: prev.effSum + r.efficiency,
        count: prev.count + 1,
      });
    });
    return map;
  }, [filtered]);

  const workerAvg = useMemo(() => {
    const result = new Map<string, number>();
    workerAgg.forEach((v, k) => result.set(k, Math.round(v.effSum / v.count)));
    return result;
  }, [workerAgg]);

  // Overall stats
  const overallAvg =
    filtered.length > 0
      ? Math.round(filtered.reduce((s, r) => s + r.efficiency, 0) / filtered.length)
      : 0;

  const topPerformer = workers.reduce(
    (best, w) => {
      const avg = workerAvg.get(w.id) || 0;
      return avg > best.avg ? { name: w.name, avg } : best;
    },
    { name: '—', avg: 0 }
  );

  // Chart data
  const chartCategories = workers.map((w) => w.name.split(' ')[0]);
  const chartActual = workers.map((w) => {
    const agg = workerAgg.get(w.id);
    return agg ? Math.round(agg.totalActual * 10) / 10 : 0;
  });
  const chartExpected = workers.map((w) => {
    const agg = workerAgg.get(w.id);
    return agg ? Math.round(agg.totalExpected * 10) / 10 : 0;
  });
  const chartEfficiency = workers.map((w) => workerAvg.get(w.id) || 0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Efficiency Tracker</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Actual vs billed hours per worker
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: 'Avg Efficiency',
            value: `${overallAvg}%`,
            color: getEffColor(overallAvg),
            icon: 'solar:chart-2-bold-duotone',
          },
          {
            label: 'Workers',
            value: String(workers.length),
            color: '#2065D1',
            icon: 'solar:users-group-rounded-bold-duotone',
          },
          {
            label: 'Days',
            value: String(dates.length),
            color: '#00B8D9',
            icon: 'solar:calendar-bold-duotone',
          },
          {
            label: 'Top Performer',
            value: topPerformer.name.split(' ')[0],
            sub: `${topPerformer.avg}%`,
            color: '#7635DC',
            icon: 'solar:star-bold-duotone',
          },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${alpha(s.color, 0.2)}`,
                background: `linear-gradient(135deg, ${alpha(s.color, 0.06)} 0%, transparent 100%)`,
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(s.color, 0.12) }}>
                  <Iconify icon={s.icon} width={24} sx={{ color: s.color }} />
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {s.label === 'Avg Efficiency' ? (
                      <Chip label={s.value} size="small" variant="soft" color={getEffChipColor(overallAvg)} />
                    ) : (
                      <Typography variant="h5">{s.value}</Typography>
                    )}
                    {(s as any).sub && (
                      <Chip label={(s as any).sub} size="small" variant="soft" color={getEffChipColor(topPerformer.avg)} />
                    )}
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {s.label}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bar Chart */}
      <Card sx={{ p: 3, borderRadius: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3, pb: 2.5, borderBottom: (t) => `1px solid ${t.palette.divider}` }}
        >
          <Box>
            <Typography variant="h6">Actual vs Billed Hours</Typography>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 0.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main,
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Actual Hours
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: alpha(theme.palette.primary.main, 0.3),
                  }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Billed Hours
                </Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                {dates.length} days &middot; {workers.length} workers
              </Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <TextField
              size="small"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <TextField
              size="small"
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <TextField
              select
              size="small"
              label="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              sx={{ minWidth: 150 }}
            >
              {departments.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
        <Chart
          type="bar"
          series={[
            { name: 'Actual Hours', data: chartActual },
            { name: 'Billed Hours', data: chartExpected },
          ]}
          options={{
            chart: { stacked: false, toolbar: { show: false } },
            plotOptions: { bar: { columnWidth: '50%', borderRadius: 4 } },
            xaxis: {
              categories: chartCategories,
              labels: { rotate: -45, style: { fontSize: '11px', colors: theme.palette.text.secondary } },
            },
            yaxis: {
              title: { text: 'Hours', style: { color: theme.palette.text.secondary } },
              labels: { style: { colors: theme.palette.text.secondary } },
            },
            colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.3)],
            legend: { show: false },
            grid: { strokeDashArray: 3, borderColor: theme.palette.divider },
            tooltip: {
              theme: theme.palette.mode,
              shared: true,
              intersect: false,
              y: { formatter: (val: number) => `${val} hrs` },
            },
            annotations: {
              points: chartCategories.map((cat: string, i: number) => ({
                x: cat,
                y: Math.max(chartActual[i], chartExpected[i]) + 0.5,
                seriesIndex: 0,
                marker: { size: 0 },
                label: {
                  text: `${chartEfficiency[i]}%`,
                  borderWidth: 0,
                  style: {
                    background: getEffBg(chartEfficiency[i]),
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
          height={400}
        />
      </Card>
    </Box>
  );
}
