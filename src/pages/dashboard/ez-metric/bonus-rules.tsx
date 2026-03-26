import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { useBonusRules, useCreateBonusRule, useEfficiency } from 'src/modules/ez-metric/api';

// --------------- types ---------------

interface BonusRule {
  _id: string;
  type: 'formula' | 'fixed';
  minEfficiency: number;
  maxEfficiency: number;
  ratePerHour: number;
  fixedAmount: number;
  label: string;
  color: string;
}

interface EfficiencyRecord {
  _id: string;
  name: string;
  actualHours: number;
  billedHours: number;
  efficiency: number | null;
  jobs: number;
}

// --------------- helpers ---------------

function getBonusEffColor(eff: number): string {
  if (eff >= 90) return '#22C55E';
  if (eff >= 50) return '#FFAB00';
  return '#FF5630';
}

function computeFormulaBonus(eff: number, billedHours: number, formulaRules: BonusRule[]): number {
  const sorted = [...formulaRules].sort((a, b) => a.minEfficiency - b.minEfficiency);
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const rule = sorted[i];
    if (eff >= rule.minEfficiency && (eff < rule.maxEfficiency || i === sorted.length - 1)) {
      return rule.ratePerHour * billedHours;
    }
  }
  return 0;
}

function computeFixedBonus(eff: number, fixedRules: BonusRule[]): number {
  const sorted = [...fixedRules].sort((a, b) => a.minEfficiency - b.minEfficiency);
  for (let i = sorted.length - 1; i >= 0; i -= 1) {
    const rule = sorted[i];
    if (eff >= rule.minEfficiency && (eff < rule.maxEfficiency || i === sorted.length - 1)) {
      return rule.fixedAmount;
    }
  }
  return 0;
}

// --------------- initial form state ---------------

const INITIAL_FORM = {
  type: 'formula' as 'formula' | 'fixed',
  minEfficiency: '',
  maxEfficiency: '',
  ratePerHour: '',
  fixedAmount: '',
  label: '',
  color: '#2065D1',
};

// --------------- component ---------------

export default function BonusRulesPage() {
  const [openDialog, setOpenDialog] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const { data: rulesData, isLoading: rulesLoading } = useBonusRules();
  const { data: efficiencyData, isLoading: effLoading } = useEfficiency();
  const createBonusRule = useCreateBonusRule();

  const rules: BonusRule[] = rulesData ?? [];

  const formulaRules = rules.filter((r) => r.type === 'formula');
  const fixedRules = rules.filter((r) => r.type === 'fixed');

  const workerBonuses = useMemo(
    () => {
      const records: EfficiencyRecord[] = efficiencyData ?? [];
      return records.map((w) => {
        const eff = w.efficiency;
        const formulaBonus = eff != null ? computeFormulaBonus(eff, w.billedHours, formulaRules) : 0;
        const fixedBonus = eff != null ? computeFixedBonus(eff, fixedRules) : 0;
        return {
          ...w,
          formulaBonus,
          fixedBonus,
          total: formulaBonus + fixedBonus,
        };
      });
    },
    [efficiencyData, formulaRules, fixedRules]
  );

  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRule = async () => {
    await createBonusRule.mutateAsync({
      type: form.type,
      minEfficiency: Number(form.minEfficiency),
      maxEfficiency: Number(form.maxEfficiency),
      ratePerHour: Number(form.ratePerHour) || 0,
      fixedAmount: Number(form.fixedAmount) || 0,
      label: form.label,
      color: form.color,
    });
    setForm(INITIAL_FORM);
    setOpenDialog(false);
  };

  // --------------- loading state ---------------

  if (rulesLoading || effLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  // --------------- render ---------------

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Bonus Rules</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Configure efficiency-based bonus formulas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:add-circle-bold" />}
          onClick={() => setOpenDialog(true)}
        >
          Add Rule
        </Button>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Formula-Based Rules */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, bgcolor: alpha('#2065D1', 0.08) }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:calculator-bold-duotone" width={24} sx={{ color: '#2065D1' }} />
                <Typography variant="h6">Formula-Based Bonus</Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Rate per billed hour based on efficiency tier
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Efficiency Range</TableCell>
                    <TableCell>Rate</TableCell>
                    <TableCell>Formula</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formulaRules.map((rule) => (
                    <TableRow key={rule._id} hover>
                      <TableCell>
                        <Chip
                          label={rule.label}
                          size="small"
                          sx={{ bgcolor: alpha(rule.color, 0.12), color: rule.color, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">${rule.ratePerHour} x Billed Hours</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary' }}>
                          =D*{rule.ratePerHour}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small"><Iconify icon="solar:pen-bold" width={16} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* Fixed Bonus Rules */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, bgcolor: alpha('#22C55E', 0.08) }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:money-bag-bold-duotone" width={24} sx={{ color: '#22C55E' }} />
                <Typography variant="h6">Fixed Bonus Amount</Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Flat bonus amount based on efficiency tier
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Efficiency Range</TableCell>
                    <TableCell>Bonus Amount</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fixedRules.map((rule) => (
                    <TableRow key={rule._id} hover>
                      <TableCell>
                        <Chip
                          label={rule.label}
                          size="small"
                          sx={{ bgcolor: alpha(rule.color, 0.12), color: rule.color, fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 700, color: rule.fixedAmount === 0 ? 'text.disabled' : 'text.primary' }}
                        >
                          ${rule.fixedAmount.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton size="small"><Iconify icon="solar:pen-bold" width={16} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      {/* Worker Bonus Calculation */}
      <Card sx={{ borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6">Worker Bonus Calculation</Typography>
          <Chip
            label={`Total: $${workerBonuses.reduce((s, w) => s + w.total, 0).toLocaleString()}`}
            color="success"
            variant="soft"
            sx={{ fontWeight: 700 }}
          />
        </Stack>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Worker</TableCell>
                <TableCell align="center">Efficiency</TableCell>
                <TableCell align="right">Billed Hours</TableCell>
                <TableCell align="right">Formula Bonus</TableCell>
                <TableCell align="right">Fixed Bonus</TableCell>
                <TableCell align="right">Total Bonus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workerBonuses.map((w) => (
                <TableRow key={w._id} hover>
                  <TableCell><Typography variant="subtitle2">{w.name}</Typography></TableCell>
                  <TableCell align="center">
                    {w.efficiency != null ? (
                      <Chip
                        label={`${w.efficiency}%`}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          bgcolor: alpha(getBonusEffColor(w.efficiency), 0.12),
                          color: getBonusEffColor(w.efficiency),
                        }}
                      />
                    ) : (
                      <Typography variant="caption" sx={{ color: 'text.disabled' }}>N/A</Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{w.billedHours.toFixed(2)}h</TableCell>
                  <TableCell align="right">${w.formulaBonus.toFixed(2)}</TableCell>
                  <TableCell align="right">${w.fixedBonus.toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: w.total > 0 ? '#22C55E' : 'text.disabled' }}>
                      ${w.total.toFixed(2)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Rule Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Bonus Rule</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Rule Type"
                value={form.type}
                onChange={(e) => handleFieldChange('type', e.target.value)}
              >
                <MenuItem value="formula">Formula-Based</MenuItem>
                <MenuItem value="fixed">Fixed Amount</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Label"
                value={form.label}
                onChange={(e) => handleFieldChange('label', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Min Efficiency (%)"
                type="number"
                value={form.minEfficiency}
                onChange={(e) => handleFieldChange('minEfficiency', e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Max Efficiency (%)"
                type="number"
                value={form.maxEfficiency}
                onChange={(e) => handleFieldChange('maxEfficiency', e.target.value)}
              />
            </Grid>
            {form.type === 'formula' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Rate per Billed Hour ($)"
                  type="number"
                  value={form.ratePerHour}
                  onChange={(e) => handleFieldChange('ratePerHour', e.target.value)}
                />
              </Grid>
            )}
            {form.type === 'fixed' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fixed Bonus Amount ($)"
                  type="number"
                  value={form.fixedAmount}
                  onChange={(e) => handleFieldChange('fixedAmount', e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Color"
                type="color"
                value={form.color}
                onChange={(e) => handleFieldChange('color', e.target.value)}
                InputProps={{ sx: { height: 56 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddRule}
            disabled={createBonusRule.isPending}
          >
            {createBonusRule.isPending ? 'Adding...' : 'Add Rule'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
