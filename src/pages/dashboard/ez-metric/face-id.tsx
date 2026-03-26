import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { useWorkers, useVerifyFaceId } from 'src/modules/ez-metric/api';

function getFaceIdStatusColor(status: string): string {
  if (status === 'verified') return '#22C55E';
  if (status === 'pending') return '#FFAB00';
  return '#FF5630';
}

const statusConfig: Record<string, { label: string; color: 'success' | 'warning' | 'error'; icon: string }> = {
  verified: { label: 'Verified', color: 'success', icon: 'solar:shield-check-bold-duotone' },
  pending: { label: 'Pending', color: 'warning', icon: 'solar:clock-circle-bold-duotone' },
  not_verified: { label: 'Not Verified', color: 'error', icon: 'solar:shield-cross-bold-duotone' },
};

export default function FaceIdPage() {
  const theme = useTheme();
  const { data: workers = [], isLoading } = useWorkers();
  const verifyFaceId = useVerifyFaceId();

  const verified = workers.filter((w: any) => w.faceIdStatus === 'verified').length;
  const pending = workers.filter((w: any) => w.faceIdStatus === 'pending').length;
  const notVerified = workers.filter((w: any) => w.faceIdStatus === 'not_verified').length;

  if (isLoading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Face ID Verification</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Biometric verification status for all workers
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Iconify icon="solar:camera-bold" />}>
          Register New Face
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Verified', value: verified, color: '#22C55E' },
          { label: 'Pending', value: pending, color: '#FFAB00' },
          { label: 'Not Verified', value: notVerified, color: '#FF5630' },
        ].map((s) => (
          <Grid item xs={12} sm={4} key={s.label}>
            <Card sx={{ p: 3, borderRadius: 2, textAlign: 'center', border: `1px solid ${alpha(s.color, 0.2)}` }}>
              <Typography variant="h3" sx={{ color: s.color }}>{s.value}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{s.label}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        sx={{
          p: 4, mb: 4, borderRadius: 2, textAlign: 'center',
          border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
          bgcolor: alpha(theme.palette.primary.main, 0.02),
        }}
      >
        <Box
          sx={{
            width: 200, height: 200, mx: 'auto', mb: 3, borderRadius: '50%',
            border: `3px dashed ${alpha(theme.palette.primary.main, 0.4)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          }}
        >
          <Iconify icon="solar:face-scan-circle-bold-duotone" width={80} sx={{ color: alpha(theme.palette.primary.main, 0.4) }} />
        </Box>
        <Typography variant="h6" sx={{ mb: 1 }}>Face ID Camera Interface</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 480, mx: 'auto' }}>
          This area will connect to the biometric camera for real-time face verification.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" size="large" startIcon={<Iconify icon="solar:camera-bold" />}>Start Camera</Button>
          <Button variant="outlined" size="large" startIcon={<Iconify icon="solar:settings-bold" />}>Configure</Button>
        </Stack>
      </Card>

      <Typography variant="h6" sx={{ mb: 2 }}>Verification Status</Typography>
      <Grid container spacing={2}>
        {workers.map((worker: any) => {
          const status = worker.faceIdStatus || 'not_verified';
          const cfg = statusConfig[status] || statusConfig.not_verified;
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={worker._id}>
              <Card sx={{ p: 2.5, borderRadius: 2, borderLeft: `4px solid ${getFaceIdStatusColor(status)}` }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 44, height: 44,
                      bgcolor: alpha(getFaceIdStatusColor(status), 0.1),
                      color: getFaceIdStatusColor(status),
                      fontSize: 14, fontWeight: 700,
                    }}
                  >
                    {worker.name.split(' ').map((n: string) => n[0]).join('')}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle2" noWrap>{worker.name}</Typography>
                    <Chip label={cfg.label} size="small" color={cfg.color} variant="soft"
                      icon={<Iconify icon={cfg.icon} width={14} />} sx={{ mt: 0.5, fontSize: 11 }} />
                  </Box>
                </Stack>
                {worker.faceIdLastVerified && (
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    Last: {new Date(worker.faceIdLastVerified).toLocaleString()}
                  </Typography>
                )}
                {status !== 'verified' && (
                  <Button fullWidth variant="soft" size="small" sx={{ mt: 1.5 }}
                    startIcon={<Iconify icon="solar:face-scan-circle-bold" />}
                    onClick={() => verifyFaceId.mutateAsync(worker._id)}
                  >
                    {status === 'pending' ? 'Complete Verification' : 'Start Verification'}
                  </Button>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
