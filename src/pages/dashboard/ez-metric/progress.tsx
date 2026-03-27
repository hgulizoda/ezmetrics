import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useBonusRules, useEfficiency } from 'src/modules/ez-metric/api';

import Chart from 'src/components/chart';

function getEffColor(eff: number | null): string {
  if (eff === null) return '#919EAB';
  if (eff >= 90) return '#22C55E';
  if (eff >= 70) return '#00B8D9';
  if (eff >= 50) return '#FFAB00';
  return '#FF5630';
}

function getBonusTiers() {
  return [
    { min: 0, max: 90, label: 'No Bonus', color: '#FF5630' },
    { min: 90, max: 100, label: '$3/hr', color: '#FFAB00' },
    { min: 100, max: 110, label: '$3.5/hr', color: '#00B8D9' },
    { min: 110, max: 125, label: '$4/hr', color: '#22C55E' },
    { min: 125, max: 150, label: '$5/hr', color: '#7635DC' },
  ];
}

export default function ProgressPage() {
  const theme = useTheme();
  const tiers = getBonusTiers();
  const { data: efficiencyData = [], isLoading } = useEfficiency();
  const { data: bonusRules = [] } = useBonusRules();

  if (isLoading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  const workersProgress = efficiencyData.map((w: any) => {
    const eff = w.efficiency || 0;
    let bonusTier = 'None';
    let nextTier = '90%';
    let nextBonus = '$3/hr';
    let bonus = 0;

    const formulaRules = bonusRules.filter((r: any) => r.type === 'formula');
    formulaRules.forEach((rule: any) => {
      if (eff >= rule.minEfficiency && eff < rule.maxEfficiency && rule.ratePerHour > 0) {
        bonusTier = `$${rule.ratePerHour}/hr`;
        bonus = rule.ratePerHour * w.billedHours;
      }
    });

    tiers.some((tier) => {
      if (eff < tier.min + (tier.max - tier.min)) {
        nextTier = `${tier.max}%`;
        nextBonus = tier.label;
        return true;
      }
      return false;
    });

    return {
      ...w, bonus: +bonus.toFixed(2), bonusTier, nextTier, nextBonus, hoursTarget: 50,
    };
  });

  const radarWorkers = workersProgress.filter((w: any) => w.efficiency !== null);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Worker Progress</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Efficiency progress and bonus tracking
          </Typography>
        </Box>
      </Stack>

      <Card sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Bonus Tiers</Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap">
          {tiers.map((tier) => (
            <Chip key={tier.label} label={`${tier.min}%-${tier.max}%: ${tier.label}`} size="small"
              sx={{ bgcolor: alpha(tier.color, 0.12), color: tier.color, fontWeight: 600 }} />
          ))}
        </Stack>
      </Card>

      <Grid container spacing={3}>
        {workersProgress.map((worker: any) => {
          const effValue = worker.efficiency ?? 0;
          const effColor = getEffColor(worker.efficiency);
          const hoursProgress = Math.min((worker.actualHours / worker.hoursTarget) * 100, 100);

          return (
            <Grid item xs={12} sm={6} md={4} key={worker._id}>
              <Card sx={{ p: 3, borderRadius: 2, height: '100%', border: `1px solid ${alpha(effColor, 0.2)}`,
                '&:hover': { boxShadow: theme.customShadows?.z8 }, transition: 'box-shadow 0.2s' }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: alpha(effColor, 0.1), color: effColor, fontSize: 16, fontWeight: 700 }}>
                    {worker.name.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{worker.name}</Typography>
                    {worker.bonus > 0 && (
                      <Chip label={`Bonus: $${worker.bonus}`} size="small" color="success" variant="soft" sx={{ mt: 0.5, fontWeight: 700 }} />
                    )}
                  </Box>
                </Stack>

                <Box sx={{ mb: 2.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Efficiency</Typography>
                    <Typography variant="subtitle2" sx={{ color: effColor }}>
                      {worker.efficiency !== null ? `${worker.efficiency}%` : 'N/A'}
                    </Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={Math.min(effValue, 100)}
                    sx={{ height: 12, borderRadius: 1.5, bgcolor: alpha(effColor, 0.12),
                      '& .MuiLinearProgress-bar': { borderRadius: 1.5, bgcolor: effColor } }} />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Worked Hours</Typography>
                    <Typography variant="subtitle2">{worker.actualHours.toFixed(1)}h / {worker.hoursTarget}h</Typography>
                  </Stack>
                  <LinearProgress variant="determinate" value={hoursProgress}
                    sx={{ height: 8, borderRadius: 1, bgcolor: alpha('#2065D1', 0.12),
                      '& .MuiLinearProgress-bar': { borderRadius: 1, bgcolor: '#2065D1' } }} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, p: 1.5, borderRadius: 1.5,
                  bgcolor: alpha(theme.palette.grey[500], 0.04) }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>Billed Hours</Typography>
                    <Typography variant="subtitle2">{worker.billedHours}h</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>Current Tier</Typography>
                    <Typography variant="subtitle2">{worker.bonusTier}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>Next Tier At</Typography>
                    <Typography variant="subtitle2">{worker.nextTier}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>Jobs</Typography>
                    <Typography variant="subtitle2">{worker.jobs}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {radarWorkers.length > 0 && (
        <Card sx={{ p: 3, mt: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Team Efficiency Overview</Typography>
          <Chart type="radar"
            series={[{ name: 'Efficiency %', data: radarWorkers.map((w: any) => w.efficiency || 0) }]}
            options={{
              chart: { toolbar: { show: false } },
              xaxis: { categories: radarWorkers.map((w: any) => w.name.split(' ')[0]) },
              colors: [theme.palette.primary.main],
              fill: { opacity: 0.2 }, stroke: { width: 2 },
              yaxis: { show: false }, markers: { size: 4 },
            }}
            height={360}
          />
        </Card>
      )}
    </Box>
  );
}
