import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';

import {
  useBonusRules,
  useCreateBonusRule,
  useUpdateBonusRule,
  useDeleteBonusRule,
  useGracePeriodRules,
  useCreateGracePeriodRule,
  useUpdateGracePeriodRule,
  useDeleteGracePeriodRule,
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from 'src/modules/ez-metric/api';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type BonusRule = {
  _id: string;
  type: 'fixed' | 'formula';
  minEfficiency: number;
  maxEfficiency: number;
  ratePerHour: number;
  fixedAmount: number;
  label: string;
  color: string;
};

type GracePeriodRule = {
  _id: string;
  gracePeriod: number;
  perMinuteRate: number;
  maxPenaltyMinutes: number;
  label: string;
};

type Department = {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
};

const DEFAULT_BONUS: Omit<BonusRule, '_id'> = {
  type: 'fixed',
  minEfficiency: 90,
  maxEfficiency: 100,
  ratePerHour: 0,
  fixedAmount: 100,
  label: '',
  color: '#00B8D9',
};

const DEFAULT_GRACE: Omit<GracePeriodRule, '_id'> = {
  gracePeriod: 5,
  perMinuteRate: 0,
  label: '',
};

const RULE_COLORS = ['#FF5630', '#FFAB00', '#00B8D9', '#22C55E', '#7635DC', '#2065D1'];

// ----------------------------------------------------------------------

export default function SettingsPage() {
  const { data: bonusRules, isLoading: loadingRules } = useBonusRules();
  const createBonusRule = useCreateBonusRule();
  const updateBonusRule = useUpdateBonusRule();
  const deleteBonusRule = useDeleteBonusRule();

  const { data: gracePeriodRules, isLoading: loadingGrace } = useGracePeriodRules();
  const createGracePeriodRule = useCreateGracePeriodRule();
  const updateGracePeriodRule = useUpdateGracePeriodRule();
  const deleteGracePeriodRule = useDeleteGracePeriodRule();

  const { data: departments, isLoading: loadingDeps } = useDepartments();
  const createDepartment = useCreateDepartment();
  const updateDepartment = useUpdateDepartment();
  const deleteDepartment = useDeleteDepartment();

  // Bonus rule dialog state
  const [bonusDialog, setBonusDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<BonusRule | null>(null);
  const [ruleForm, setRuleForm] = useState(DEFAULT_BONUS);

  // Grace period dialog state
  const [graceDialog, setGraceDialog] = useState(false);
  const [editingGrace, setEditingGrace] = useState<GracePeriodRule | null>(null);
  const [graceForm, setGraceForm] = useState(DEFAULT_GRACE);

  // Department dialog state
  const [depDialog, setDepDialog] = useState(false);
  const [editingDep, setEditingDep] = useState<Department | null>(null);
  const [depForm, setDepForm] = useState({ name: '', description: '' });

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'rule' | 'grace' | 'department'; id: string; name: string } | null>(null);

  const isLoading = loadingRules || loadingGrace || loadingDeps;

  // --- Bonus rule handlers ---
  const openAddRule = () => {
    setEditingRule(null);
    setRuleForm(DEFAULT_BONUS);
    setBonusDialog(true);
  };

  const openEditRule = (rule: BonusRule) => {
    setEditingRule(rule);
    setRuleForm({
      type: rule.type,
      minEfficiency: rule.minEfficiency,
      maxEfficiency: rule.maxEfficiency,
      ratePerHour: rule.ratePerHour,
      fixedAmount: rule.fixedAmount,
      label: rule.label,
      color: rule.color,
    });
    setBonusDialog(true);
  };

  const handleSaveRule = () => {
    const label = ruleForm.label || `${ruleForm.minEfficiency}%-${ruleForm.maxEfficiency}%`;
    const payload = { ...ruleForm, label };

    if (editingRule) {
      updateBonusRule.mutate({ id: editingRule._id, body: payload });
    } else {
      createBonusRule.mutate(payload);
    }
    setBonusDialog(false);
  };

  const handleDeleteRule = () => {
    if (deleteDialog?.type === 'rule') {
      deleteBonusRule.mutate(deleteDialog.id);
    }
    setDeleteDialog(null);
  };

  // --- Grace period handlers ---
  const openAddGrace = () => {
    setEditingGrace(null);
    setGraceForm(DEFAULT_GRACE);
    setGraceDialog(true);
  };

  const openEditGrace = (rule: GracePeriodRule) => {
    setEditingGrace(rule);
    setGraceForm({
      gracePeriod: rule.gracePeriod,
      perMinuteRate: rule.perMinuteRate,
      label: rule.label,
    });
    setGraceDialog(true);
  };

  const handleSaveGrace = () => {
    const label = graceForm.label || `${graceForm.gracePeriod} min grace`;
    const payload = { ...graceForm, label };

    if (editingGrace) {
      updateGracePeriodRule.mutate({ id: editingGrace._id, body: payload });
    } else {
      createGracePeriodRule.mutate(payload);
    }
    setGraceDialog(false);
  };

  const handleDeleteGrace = () => {
    if (deleteDialog?.type === 'grace') {
      deleteGracePeriodRule.mutate(deleteDialog.id);
    }
    setDeleteDialog(null);
  };

  // --- Department handlers ---
  const openAddDep = () => {
    setEditingDep(null);
    setDepForm({ name: '', description: '' });
    setDepDialog(true);
  };

  const openEditDep = (dep: Department) => {
    setEditingDep(dep);
    setDepForm({ name: dep.name, description: dep.description });
    setDepDialog(true);
  };

  const handleSaveDep = () => {
    if (editingDep) {
      updateDepartment.mutate({ id: editingDep._id, body: depForm });
    } else {
      createDepartment.mutate(depForm);
    }
    setDepDialog(false);
  };

  const handleDeleteDep = () => {
    if (deleteDialog?.type === 'department') {
      deleteDepartment.mutate(deleteDialog.id);
    }
    setDeleteDialog(null);
  };

  if (isLoading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  const allRules = (bonusRules || []).filter((r: BonusRule) => r.type === 'fixed');

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Settings</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Bonus rules and department management
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        {/* ============ BONUS RULES - Flat Amount ============ */}
        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 2.5, bgcolor: alpha('#7635DC', 0.04) }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:dollar-bold-duotone" width={24} sx={{ color: '#7635DC' }} />
                <Typography variant="h6">Bonus Rules</Typography>
              </Stack>
              <Button
                size="small"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={openAddRule}
              >
                Add Rule
              </Button>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Fixed bonus amount based on efficiency threshold
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>Min Efficiency</TableCell>
                  <TableCell>Max Efficiency</TableCell>
                  <TableCell>Bonus Amount</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allRules.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                      No bonus rules configured
                    </TableCell>
                  </TableRow>
                )}
                {allRules.map((rule: BonusRule) => (
                  <TableRow key={rule._id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: rule.color, flexShrink: 0 }} />
                        <Typography variant="body2">{rule.label}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{rule.minEfficiency}%</TableCell>
                    <TableCell>{rule.maxEfficiency}%</TableCell>
                    <TableCell>
                      <Chip
                        label={rule.fixedAmount > 0 ? `$${rule.fixedAmount}` : 'No bonus'}
                        size="small"
                        sx={{
                          bgcolor: alpha(rule.color, 0.1),
                          color: rule.color,
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditRule(rule)}>
                          <Iconify icon="solar:pen-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ type: 'rule', id: rule._id, name: rule.label })}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* ============ GRACE PERIOD RULES ============ */}
        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 2.5, bgcolor: alpha('#00B8D9', 0.04) }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:clock-circle-bold-duotone" width={24} sx={{ color: '#00B8D9' }} />
                <Typography variant="h6">Grace Period Rules</Typography>
              </Stack>
              <Button
                size="small"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={openAddGrace}
              >
                Add Rule
              </Button>
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              Grace period duration and per-minute penalty rate for late clock-ins
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>Grace Period</TableCell>
                  <TableCell>Per Minute Rate</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(gracePeriodRules || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                      No grace period rules configured
                    </TableCell>
                  </TableRow>
                )}
                {(gracePeriodRules || []).map((rule: GracePeriodRule) => (
                  <TableRow key={rule._id} hover>
                    <TableCell>
                      <Typography variant="body2">{rule.label}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${rule.gracePeriod} min`}
                        size="small"
                        sx={{
                          bgcolor: alpha('#00B8D9', 0.1),
                          color: '#00B8D9',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.perMinuteRate > 0 ? `$${rule.perMinuteRate}/min` : 'No penalty'}
                        size="small"
                        sx={{
                          bgcolor: alpha(rule.perMinuteRate > 0 ? '#FF5630' : '#22C55E', 0.1),
                          color: rule.perMinuteRate > 0 ? '#FF5630' : '#22C55E',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditGrace(rule)}>
                          <Iconify icon="solar:pen-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ type: 'grace', id: rule._id, name: rule.label })}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* ============ DEPARTMENTS ============ */}
        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ p: 2.5, bgcolor: alpha('#2065D1', 0.04) }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:buildings-bold-duotone" width={24} sx={{ color: '#2065D1' }} />
                <Typography variant="h6">Departments</Typography>
              </Stack>
              <Button
                size="small"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={openAddDep}
              >
                Add Department
              </Button>
            </Stack>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(departments || []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                      No departments configured
                    </TableCell>
                  </TableRow>
                )}
                {(departments || []).map((dep: Department) => (
                  <TableRow key={dep._id} hover>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ p: 0.5, borderRadius: 0.75, bgcolor: alpha('#2065D1', 0.1), display: 'flex' }}>
                          <Iconify icon="solar:buildings-bold" width={16} sx={{ color: '#2065D1' }} />
                        </Box>
                        <Typography variant="subtitle2">{dep.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {dep.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEditDep(dep)}>
                          <Iconify icon="solar:pen-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ type: 'department', id: dep._id, name: dep.name })}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Stack>

      {/* ============ BONUS RULE DIALOG ============ */}
      <Dialog open={bonusDialog} onClose={() => setBonusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRule ? 'Edit Bonus Rule' : 'Add Bonus Rule'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Min Efficiency (%)"
                type="number"
                value={ruleForm.minEfficiency}
                onChange={(e) => setRuleForm({ ...ruleForm, minEfficiency: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              <TextField
                fullWidth
                label="Max Efficiency (%)"
                type="number"
                value={ruleForm.maxEfficiency}
                onChange={(e) => setRuleForm({ ...ruleForm, maxEfficiency: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Stack>

            <TextField
              fullWidth
              label="Fixed Bonus Amount"
              type="number"
              value={ruleForm.fixedAmount}
              onChange={(e) => setRuleForm({ ...ruleForm, fixedAmount: Number(e.target.value) })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              helperText="Fixed bonus paid when efficiency is in this range"
            />

            <TextField
              fullWidth
              label="Label (optional)"
              value={ruleForm.label}
              onChange={(e) => setRuleForm({ ...ruleForm, label: e.target.value })}
              placeholder={`${ruleForm.minEfficiency}%-${ruleForm.maxEfficiency}%`}
            />

            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
                Color
              </Typography>
              <Stack direction="row" spacing={1}>
                {RULE_COLORS.map((c) => (
                  <Box
                    key={c}
                    onClick={() => setRuleForm({ ...ruleForm, color: c })}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: c,
                      cursor: 'pointer',
                      border: ruleForm.color === c ? '3px solid' : '3px solid transparent',
                      borderColor: ruleForm.color === c ? 'text.primary' : 'transparent',
                      transition: 'all 0.15s',
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBonusDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSaveRule} variant="contained">
            {editingRule ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============ GRACE PERIOD DIALOG ============ */}
      <Dialog open={graceDialog} onClose={() => setGraceDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingGrace ? 'Edit Grace Period Rule' : 'Add Grace Period Rule'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Grace Period"
              type="number"
              value={graceForm.gracePeriod}
              onChange={(e) => setGraceForm({ ...graceForm, gracePeriod: Number(e.target.value) })}
              InputProps={{
                endAdornment: <InputAdornment position="end">min</InputAdornment>,
              }}
              helperText="Number of minutes allowed before penalty applies"
            />

            <TextField
              fullWidth
              label="Per Minute Rate"
              type="number"
              value={graceForm.perMinuteRate}
              onChange={(e) => setGraceForm({ ...graceForm, perMinuteRate: Number(e.target.value) })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                endAdornment: <InputAdornment position="end">/min</InputAdornment>,
              }}
              helperText="Deduction per minute after grace period expires"
            />

            <TextField
              fullWidth
              label="Label (optional)"
              value={graceForm.label}
              onChange={(e) => setGraceForm({ ...graceForm, label: e.target.value })}
              placeholder={`${graceForm.gracePeriod} min grace`}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGraceDialog(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSaveGrace} variant="contained">
            {editingGrace ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============ DEPARTMENT DIALOG ============ */}
      <Dialog open={depDialog} onClose={() => setDepDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingDep ? 'Edit Department' : 'Add Department'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Department Name"
              value={depForm.name}
              onChange={(e) => setDepForm({ ...depForm, name: e.target.value })}
              placeholder="e.g. Shop, Fleet, Office"
            />
            <TextField
              fullWidth
              label="Description"
              value={depForm.description}
              onChange={(e) => setDepForm({ ...depForm, description: e.target.value })}
              placeholder="Brief description of this department"
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepDialog(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleSaveDep}
            variant="contained"
            disabled={!depForm.name.trim()}
          >
            {editingDep ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ============ DELETE CONFIRMATION ============ */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteDialog?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)} color="inherit">Cancel</Button>
          <Button
            onClick={deleteDialog?.type === 'rule' ? handleDeleteRule : deleteDialog?.type === 'grace' ? handleDeleteGrace : handleDeleteDep}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
