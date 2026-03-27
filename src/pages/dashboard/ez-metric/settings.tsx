import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useSettings, useUpdateSetting } from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

export default function SettingsPage() {
  const theme = useTheme();
  const [saved, setSaved] = useState(false);
  const { data: _settings, isLoading } = useSettings();
  const _updateSetting = useUpdateSetting();

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (isLoading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Settings</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            System configuration and admin preferences
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button variant="outlined" color="inherit">Reset to Defaults</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<Iconify icon={saved ? 'solar:check-circle-bold' : 'solar:diskette-bold'} />}
            color={saved ? 'success' : 'primary'}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:settings-bold-duotone" width={24} sx={{ color: 'primary.main' }} />
                <Typography variant="h6">General Settings</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Company Name" defaultValue="EZ Metric" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth select label="Currency" defaultValue="USD">
                    <MenuItem value="USD">USD ($)</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth select label="Language" defaultValue="en">
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Spanish</MenuItem>
                    <MenuItem value="uz">Uzbek</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth select label="Timezone" defaultValue="America/New_York">
                    <MenuItem value="America/New_York">Eastern (EST/EDT)</MenuItem>
                    <MenuItem value="America/Chicago">Central (CST/CDT)</MenuItem>
                    <MenuItem value="America/Los_Angeles">Pacific (PST/PDT)</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
            <Stack spacing={1.5}>
              {[
                { label: 'Manage Shifts', icon: 'solar:calendar-bold-duotone', color: '#FFAB00', path: '/dashboard/shifts' },
                { label: 'Bonus Rules', icon: 'solar:gift-bold-duotone', color: '#7635DC', path: '/dashboard/bonus-rules' },
                { label: 'Salary Config', icon: 'solar:wallet-money-bold-duotone', color: '#22C55E', path: '/dashboard/salary' },
                { label: 'View Reports', icon: 'solar:document-bold-duotone', color: '#2065D1', path: '/dashboard/reports' },
              ].map((action) => (
                <Card
                  key={action.label}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    '&:hover': { borderColor: action.color, bgcolor: alpha(action.color, 0.04) },
                    transition: 'all 0.2s',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha(action.color, 0.1) }}>
                      <Iconify icon={action.icon} width={20} sx={{ color: action.color }} />
                    </Box>
                    <Typography variant="subtitle2">{action.label}</Typography>
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Card>
        </Grid>

        {/* Clock Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2.5, bgcolor: alpha('#00B8D9', 0.04) }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:clock-circle-bold-duotone" width={24} sx={{ color: '#00B8D9' }} />
                <Typography variant="h6">Clock-In Settings</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <TextField fullWidth label="Grace Period (minutes)" type="number" defaultValue={5} helperText="Time allowed after shift start before marking as late" />
                <TextField fullWidth label="Auto Clock-Out After (hours)" type="number" defaultValue={12} helperText="Automatically clock out workers after this many hours" />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Allow manual clock edits (admin only)"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Send clock-in notification to admin"
                />
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Salary Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2.5, bgcolor: alpha('#22C55E', 0.04) }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:wallet-money-bold-duotone" width={24} sx={{ color: '#22C55E' }} />
                <Typography variant="h6">Salary Settings</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <TextField fullWidth label="Late Penalty ($/minute)" type="number" defaultValue={1} />
                <TextField fullWidth label="Overtime Multiplier" type="number" defaultValue={1.5} helperText="Overtime rate = base rate x multiplier" />
                <TextField fullWidth select label="Pay Period" defaultValue="weekly">
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="biweekly">Bi-Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                </TextField>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Auto-calculate overtime"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Deduct breaks from worked hours"
                />
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2.5, bgcolor: alpha('#FFAB00', 0.04) }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:bell-bold-duotone" width={24} sx={{ color: '#FFAB00' }} />
                <Typography variant="h6">Notifications</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <FormControlLabel control={<Switch defaultChecked />} label="Weekly statement email to admins" />
                <FormControlLabel control={<Switch defaultChecked />} label="Clock-in/out alerts" />
                <FormControlLabel control={<Switch />} label="Low efficiency warnings" />
                <FormControlLabel control={<Switch defaultChecked />} label="Loan payment reminders" />
                <Divider sx={{ my: 1 }} />
                <TextField fullWidth label="Admin Email" defaultValue="admin@eztruckrepair.com" type="email" />
              </Stack>
            </Box>
          </Card>
        </Grid>

        {/* Integration Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2.5, bgcolor: alpha('#7635DC', 0.04) }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:plug-circle-bold-duotone" width={24} sx={{ color: '#7635DC' }} />
                <Typography variant="h6">Integrations</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha('#2065D1', 0.1) }}>
                        <Iconify icon="solar:link-bold" width={20} sx={{ color: '#2065D1' }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Tekmetric</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Shop management integration</Typography>
                      </Box>
                    </Stack>
                    <Switch defaultChecked />
                  </Stack>
                </Card>
                <Card variant="outlined" sx={{ p: 2, borderRadius: 1.5 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box sx={{ p: 1, borderRadius: 1, bgcolor: alpha('#00B8D9', 0.1) }}>
                        <Iconify icon="solar:chat-round-dots-bold" width={20} sx={{ color: '#00B8D9' }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Telegram Bot</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>Worker notifications & vacation requests</Typography>
                      </Box>
                    </Stack>
                    <Switch />
                  </Stack>
                </Card>
                <TextField fullWidth label="Telegram Bot Token" placeholder="Enter bot token..." type="password" />
                <TextField fullWidth label="Tekmetric API Key" placeholder="Enter API key..." type="password" />
              </Stack>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
