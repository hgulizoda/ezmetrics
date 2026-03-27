import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useBonusRules, useEfficiency, useCreateBonusRule } from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

const INITIAL_FORM = {
  type: 'formula' as 'formula' | 'fixed',
  minEfficiency: 90,
  maxEfficiency: 100,
  ratePerHour: 3,
  fixedAmount: 0,
  label: '',
  color: '#22C55E',
};

const COLOR_OPTIONS = [
  { label: 'Green', value: '#22C55E' },
  { label: 'Blue', value: '#2065D1' },
  { label: 'Amber', value: '#FFAB00' },
  { label: 'Cyan', value: '#00B8D9' },
  { label: 'Purple', value: '#7635DC' },
  { label: 'Red', value: '#FF5630' },
];


export default function BonusRulesPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const { data: bonusRules = [], isLoading: rulesLoading } = useBonusRules();
  const { data: efficiencyData = [], isLoading: effLoading } = useEfficiency();
  const createBonusRule = useCreateBonusRule();

  const formulaRules = useMemo(
    () => bonusRules.filter((r: any) => r.type === 'formula'),
    [bonusRules]
  );

  const fixedRules = useMemo(
    () => bonusRules.filter((r: any) => r.type === 'fixed'),
    [bonusRules]
  );

  const totalEstimatedBonus = useMemo(() => {
    if (!efficiencyData.length || !bonusRules.length) return 0;
    return efficiencyData.reduce((total: number, worker: any) => {
      const eff = worker.efficiency || 0;
      const matchingRule = formulaRules.find(
        (r: any) => eff >= r.minEfficiency && eff < r.maxEfficiency && r.ratePerHour > 0
      );
      if (matchingRule) {
        return total + matchingRule.ratePerHour * (worker.billedHours || 0);
      }
      return total;
    }, 0);
  }, [efficiencyData, bonusRules, formulaRules]);

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleOpenDialog = () => {
    setFormData(INITIAL_FORM);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      await createBonusRule.mutateAsync({
        ...formData,
        minEfficiency: Number(formData.minEfficiency),
        maxEfficiency: Number(formData.maxEfficiency),
        ratePerHour: Number(formData.ratePerHour),
        fixedAmount: Number(formData.fixedAmount),
      });
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to create bonus rule:', error);
    }
  };

  if (rulesLoading || effLoading) {
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
          <Typography variant="h4">Bonus Rules</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure efficiency-based bonus tiers
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
          onClick={handleOpenDialog}
          sx={{ borderRadius: 1.5 }}
        >
          Add Rule
        </Button>
      </Stack>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Rules', value: bonusRules.length, color: '#2065D1', icon: 'solar:document-bold-duotone' },
          { label: 'Formula Rules', value: formulaRules.length, color: '#00B8D9', icon: 'solar:graph-up-bold-duotone' },
          { label: 'Fixed Rules', value: fixedRules.length, color: '#22C55E', icon: 'solar:wallet-money-bold-duotone' },
          {
            label: 'Est. Total Bonus',
            value: `$${totalEstimatedBonus.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            color: '#FFAB00',
            icon: 'solar:gift-bold-duotone',
          },
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

      {/* Formula-Based Rules */}
      <Card sx={{ borderRadius: 2, mb: 3 }}>
        <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
          <Typography variant="h6">Formula-Based Bonus Rules</Typography>
          <Box sx={{ flex: 1 }} />
          <Chip label={`${formulaRules.length} rules`} size="small" variant="soft" color="info" />
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell align="right">Min Efficiency</TableCell>
                <TableCell align="right">Max Efficiency</TableCell>
                <TableCell align="right">Rate / Hour</TableCell>
                <TableCell align="center">Color</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formulaRules.map((rule: any) => (
                <TableRow key={rule._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: rule.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="subtitle2">{rule.label}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${rule.minEfficiency}%`}
                      size="small"
                      sx={{ bgcolor: alpha(rule.color, 0.12), color: rule.color, fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${rule.maxEfficiency}%`}
                      size="small"
                      sx={{ bgcolor: alpha(rule.color, 0.12), color: rule.color, fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" sx={{ color: rule.color }}>
                      ${rule.ratePerHour}/hr
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: rule.color, mx: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <Iconify icon="solar:pen-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Fixed-Amount Rules */}
      <Card sx={{ borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" sx={{ p: 2.5 }}>
          <Typography variant="h6">Fixed-Amount Bonus Rules</Typography>
          <Box sx={{ flex: 1 }} />
          <Chip label={`${fixedRules.length} rules`} size="small" variant="soft" color="success" />
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell align="right">Min Efficiency</TableCell>
                <TableCell align="right">Max Efficiency</TableCell>
                <TableCell align="right">Fixed Amount</TableCell>
                <TableCell align="center">Color</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixedRules.map((rule: any) => (
                <TableRow key={rule._id} hover>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: rule.color,
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="subtitle2">{rule.label}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${rule.minEfficiency}%`}
                      size="small"
                      sx={{ bgcolor: alpha(rule.color, 0.12), color: rule.color, fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${rule.maxEfficiency}%`}
                      size="small"
                      sx={{ bgcolor: alpha(rule.color, 0.12), color: rule.color, fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2" sx={{ color: rule.color }}>
                      ${rule.fixedAmount}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ width: 24, height: 24, borderRadius: 1, bgcolor: rule.color, mx: 'auto' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <Iconify icon="solar:pen-bold-duotone" width={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Bonus Rule</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Rule Type"
                value={formData.type}
                onChange={handleChange('type')}
              >
                <MenuItem value="formula">Formula (Rate per Hour)</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Label"
                placeholder="e.g. 90%-100%"
                value={formData.label}
                onChange={handleChange('label')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Min Efficiency (%)"
                type="number"
                value={formData.minEfficiency}
                onChange={handleChange('minEfficiency')}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Efficiency (%)"
                type="number"
                value={formData.maxEfficiency}
                onChange={handleChange('maxEfficiency')}
              />
            </Grid>
            {formData.type === 'formula' ? (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rate per Hour ($)"
                  type="number"
                  value={formData.ratePerHour}
                  onChange={handleChange('ratePerHour')}
                />
              </Grid>
            ) : (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fixed Amount ($)"
                  type="number"
                  value={formData.fixedAmount}
                  onChange={handleChange('fixedAmount')}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Color"
                value={formData.color}
                onChange={handleChange('color')}
              >
                {COLOR_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box sx={{ width: 16, height: 16, borderRadius: 0.5, bgcolor: opt.value }} />
                      <span>{opt.label}</span>
                    </Stack>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createBonusRule.isPending || !formData.label}
          >
            {createBonusRule.isPending ? 'Adding...' : 'Add Rule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
