import { useState } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Accordion from '@mui/material/Accordion';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import CircularProgress from '@mui/material/CircularProgress';

import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

import {
  useManagers,
  useBonusRules,
  useDepartments,
  useCreateManager,
  useUpdateManager,
  useDeleteManager,
  useCreateBonusRule,
  useUpdateBonusRule,
  useDeleteBonusRule,
  useGracePeriodRules,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useCreateGracePeriodRule,
  useUpdateGracePeriodRule,
  useDeleteGracePeriodRule,
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
  freeMinutes: number;
  perMinuteRate: number;
  billingStopMinutes: number;
  label: string;
};

type Department = {
  _id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
};

type Manager = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'admin' | 'manager';
  status: 'active' | 'inactive';
};

const DEFAULT_MANAGER = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'manager' as 'admin' | 'manager',
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
  freeMinutes: 5,
  perMinuteRate: 1.0,
  billingStopMinutes: 60,
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

  const { data: managers, isLoading: loadingManagers } = useManagers();
  const createManager = useCreateManager();
  const updateManager = useUpdateManager();
  const deleteManager = useDeleteManager();

  // Bonus rule dialog state
  const [bonusDialog, setBonusDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<BonusRule | null>(null);
  const [ruleForm, setRuleForm] = useState(DEFAULT_BONUS);

  // Grace period form state (single rule, inline edit)
  const [graceForm, setGraceForm] = useState(DEFAULT_GRACE);
  const [graceInitialized, setGraceInitialized] = useState(false);
  const [editingLateBilling, setEditingLateBilling] = useState(false);

  // Department dialog state
  const [depDialog, setDepDialog] = useState(false);
  const [editingDep, setEditingDep] = useState<Department | null>(null);
  const [depForm, setDepForm] = useState({ name: '', description: '' });

  // Manager dialog state
  const [mgrDialog, setMgrDialog] = useState(false);
  const [editingMgr, setEditingMgr] = useState<Manager | null>(null);
  const [mgrForm, setMgrForm] = useState(DEFAULT_MANAGER);
  const [showPassword, setShowPassword] = useState(false);

  // Delete confirmation
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'rule' | 'grace' | 'department' | 'manager'; id: string; name: string } | null>(null);

  const isLoading = loadingRules || loadingGrace || loadingDeps || loadingManagers;

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

  // --- Manager handlers ---
  const openAddMgr = () => {
    setEditingMgr(null);
    setMgrForm(DEFAULT_MANAGER);
    setMgrDialog(true);
  };

  const openEditMgr = (mgr: Manager) => {
    setEditingMgr(mgr);
    setMgrForm({ name: mgr.name, email: mgr.email, phone: mgr.phone, password: mgr.password, role: mgr.role });
    setMgrDialog(true);
  };

  const handleSaveMgr = () => {
    if (editingMgr) {
      updateManager.mutate({ id: editingMgr._id, body: mgrForm });
    } else {
      createManager.mutate(mgrForm);
    }
    setMgrDialog(false);
  };

  const handleDeleteMgr = () => {
    if (deleteDialog?.type === 'manager') {
      deleteManager.mutate(deleteDialog.id);
    }
    setDeleteDialog(null);
  };

  // Sync grace form with loaded data once
  if (!graceInitialized && gracePeriodRules && (gracePeriodRules as GracePeriodRule[]).length > 0) {
    const rule = (gracePeriodRules as GracePeriodRule[])[0];
    setGraceForm({ freeMinutes: rule.freeMinutes, perMinuteRate: rule.perMinuteRate, billingStopMinutes: rule.billingStopMinutes, label: rule.label });
    setGraceInitialized(true);
  }

  if (isLoading) return <Box sx={{ p: 5, textAlign: 'center' }}><CircularProgress /></Box>;

  const allRules = (bonusRules || []).filter((r: BonusRule) => r.type === 'fixed');

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Settings</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Bonus rules, departments, and manager management
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={3}>
        {/* ============ BONUS RULES - Flat Amount ============ */}
        <Accordion defaultExpanded disableGutters sx={{ borderRadius: '16px !important', overflow: 'hidden', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{ bgcolor: alpha('#7635DC', 0.04), px: 2.5 }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
              <Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:dollar-bold-duotone" width={24} sx={{ color: '#7635DC' }} />
                  <Typography variant="h6">Bonus Rules</Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Fixed bonus amount based on efficiency threshold
                </Typography>
              </Stack>
              <Button
                size="small"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={(e) => { e.stopPropagation(); openAddRule(); }}
              >
                Add Rule
              </Button>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
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
          </AccordionDetails>
        </Accordion>

        {/* ============ LATE BILLING ============ */}
        <Accordion disableGutters sx={{ borderRadius: '16px !important', overflow: 'hidden', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{ bgcolor: alpha('#00B8D9', 0.04), px: 2.5 }}
          >
            <Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:clock-circle-bold-duotone" width={24} sx={{ color: '#00B8D9' }} />
                <Typography variant="h6">Late Billing</Typography>
              </Stack>
              <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                Configure the grace period and per-minute penalty for late clock-ins
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 3 }}>
            {(() => {
              const rule = (gracePeriodRules || [])[0] as GracePeriodRule | undefined;
              const current = rule
                ? { freeMinutes: rule.freeMinutes, perMinuteRate: rule.perMinuteRate, billingStopMinutes: rule.billingStopMinutes }
                : { freeMinutes: DEFAULT_GRACE.freeMinutes, perMinuteRate: DEFAULT_GRACE.perMinuteRate, billingStopMinutes: DEFAULT_GRACE.billingStopMinutes };

              const freeErr = graceForm.freeMinutes < 1;
              const rateErr = graceForm.perMinuteRate <= 0;
              const stopErr = graceForm.billingStopMinutes <= graceForm.freeMinutes;
              const hasError = freeErr || rateErr || stopErr;

              const maxPenalty = current.perMinuteRate * (current.billingStopMinutes - current.freeMinutes);

              const stepIcon = (icon: string, color: string) => (
                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: alpha(color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Iconify icon={icon} width={20} sx={{ color }} />
                </Box>
              );

              const connector = (
                <Box sx={{ width: 40, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                  <Box sx={{ width: 2, height: 24, bgcolor: 'divider' }} />
                </Box>
              );

              if (editingLateBilling) {
                return (
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label="Free Period"
                        type="number"
                        value={graceForm.freeMinutes}
                        onChange={(e) => setGraceForm({ ...graceForm, freeMinutes: Number(e.target.value) })}
                        InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                        error={freeErr}
                        helperText={freeErr ? 'Must be at least 1 minute' : 'No penalty during this time'}
                      />
                      <TextField
                        fullWidth
                        label="Rate per Minute"
                        type="number"
                        value={graceForm.perMinuteRate}
                        onChange={(e) => setGraceForm({ ...graceForm, perMinuteRate: Number(e.target.value) })}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          endAdornment: <InputAdornment position="end">/min</InputAdornment>,
                        }}
                        error={rateErr}
                        helperText={rateErr ? 'Rate must be greater than 0' : 'Charge per minute after free period'}
                      />
                      <TextField
                        fullWidth
                        label="Billing Stops At"
                        type="number"
                        value={graceForm.billingStopMinutes}
                        onChange={(e) => setGraceForm({ ...graceForm, billingStopMinutes: Number(e.target.value) })}
                        InputProps={{ endAdornment: <InputAdornment position="end">min</InputAdornment> }}
                        error={stopErr}
                        helperText={stopErr ? 'Must be greater than free period' : 'Max minutes to bill'}
                      />
                    </Stack>

                    {!hasError && (
                      <Box sx={{ px: 2, py: 1.5, borderRadius: 1.5, bgcolor: alpha('#00B8D9', 0.06), border: `1px dashed ${alpha('#00B8D9', 0.2)}` }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Preview: First <strong>{graceForm.freeMinutes} min</strong> free, then <strong>${graceForm.perMinuteRate}/min</strong> until <strong>{graceForm.billingStopMinutes} min</strong> (max penalty: <strong>${(graceForm.perMinuteRate * (graceForm.billingStopMinutes - graceForm.freeMinutes)).toFixed(2)}</strong>)
                        </Typography>
                      </Box>
                    )}

                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        color="inherit"
                        onClick={() => {
                          setGraceForm({
                            freeMinutes: current.freeMinutes,
                            perMinuteRate: current.perMinuteRate,
                            billingStopMinutes: current.billingStopMinutes,
                            label: rule?.label || '',
                          });
                          setEditingLateBilling(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        disabled={hasError || updateGracePeriodRule.isPending || createGracePeriodRule.isPending}
                        onClick={() => {
                          const payload = { freeMinutes: graceForm.freeMinutes, perMinuteRate: graceForm.perMinuteRate, billingStopMinutes: graceForm.billingStopMinutes, label: `${graceForm.freeMinutes} min free` };
                          if (rule) {
                            updateGracePeriodRule.mutate({ id: rule._id, body: payload }, { onSuccess: () => setEditingLateBilling(false) });
                          } else {
                            createGracePeriodRule.mutate(payload, { onSuccess: () => setEditingLateBilling(false) });
                          }
                        }}
                      >
                        {updateGracePeriodRule.isPending || createGracePeriodRule.isPending ? 'Saving...' : 'Save'}
                      </Button>
                    </Stack>
                  </Stack>
                );
              }

              return (
                <Stack spacing={0}>
                  {/* Step 1 — Grace period */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {stepIcon('solar:shield-check-bold-duotone', '#22C55E')}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">Grace Period</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        First <strong>{current.freeMinutes} minutes</strong> are free — no penalty
                      </Typography>
                    </Box>
                    <Chip label={`${current.freeMinutes} min`} size="small" sx={{ bgcolor: alpha('#22C55E', 0.1), color: '#22C55E', fontWeight: 700 }} />
                  </Stack>

                  {connector}

                  {/* Step 2 — Billing active */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {stepIcon('solar:dollar-minimalistic-bold-duotone', '#FF5630')}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">Billing Active</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Charged <strong>${current.perMinuteRate}</strong> per minute after grace period
                      </Typography>
                    </Box>
                    <Chip label={`$${current.perMinuteRate}/min`} size="small" sx={{ bgcolor: alpha('#FF5630', 0.1), color: '#FF5630', fontWeight: 700 }} />
                  </Stack>

                  {connector}

                  {/* Step 3 — Billing stops */}
                  <Stack direction="row" alignItems="center" spacing={2}>
                    {stepIcon('solar:stop-circle-bold-duotone', '#7635DC')}
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2">Billing Stops</Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        No further charges after <strong>{current.billingStopMinutes} minutes</strong> — max penalty <strong>${maxPenalty.toFixed(2)}</strong>
                      </Typography>
                    </Box>
                    <Chip label={`${current.billingStopMinutes} min`} size="small" sx={{ bgcolor: alpha('#7635DC', 0.1), color: '#7635DC', fontWeight: 700 }} />
                  </Stack>

                  {/* Edit button */}
                  <Box sx={{ textAlign: 'right', mt: 2 }}>
                    <Button
                      size="small"
                      startIcon={<Iconify icon="solar:pen-bold" width={16} />}
                      onClick={() => {
                        setGraceForm({
                          freeMinutes: current.freeMinutes,
                          perMinuteRate: current.perMinuteRate,
                          billingStopMinutes: current.billingStopMinutes,
                          label: rule?.label || '',
                        });
                        setEditingLateBilling(true);
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                </Stack>
              );
            })()}
          </AccordionDetails>
        </Accordion>

        {/* ============ DEPARTMENTS ============ */}
        <Accordion disableGutters sx={{ borderRadius: '16px !important', overflow: 'hidden', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{ bgcolor: alpha('#2065D1', 0.04), px: 2.5 }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Iconify icon="solar:buildings-bold-duotone" width={24} sx={{ color: '#2065D1' }} />
                <Typography variant="h6">Departments</Typography>
              </Stack>
              <Button
                size="small"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={(e) => { e.stopPropagation(); openAddDep(); }}
              >
                Add Department
              </Button>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
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
          </AccordionDetails>
        </Accordion>

        {/* ============ MANAGERS ============ */}
        <Accordion disableGutters sx={{ borderRadius: '16px !important', overflow: 'hidden', '&:before': { display: 'none' } }}>
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{ bgcolor: alpha('#FF5630', 0.04), px: 2.5 }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', pr: 1 }}>
              <Stack>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:users-group-rounded-bold-duotone" width={24} sx={{ color: '#FF5630' }} />
                  <Typography variant="h6">Managers</Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Admin and manager accounts with system access
                </Typography>
              </Stack>
              <Button
                size="small"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={(e) => { e.stopPropagation(); openAddMgr(); }}
              >
                Add Manager
              </Button>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(managers || []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.disabled' }}>
                        No managers configured
                      </TableCell>
                    </TableRow>
                  )}
                  {(managers || []).map((mgr: Manager) => (
                    <TableRow key={mgr._id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: alpha('#FF5630', 0.08), color: '#FF5630', fontSize: 13, fontWeight: 700 }}>
                            {mgr.name.split(' ').map((n) => n[0]).join('')}
                          </Avatar>
                          <Typography variant="subtitle2">{mgr.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{mgr.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{mgr.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mgr.role === 'admin' ? 'Admin' : 'Manager'}
                          size="small"
                          sx={{
                            bgcolor: alpha(mgr.role === 'admin' ? '#7635DC' : '#2065D1', 0.1),
                            color: mgr.role === 'admin' ? '#7635DC' : '#2065D1',
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={mgr.status === 'active' ? 'Active' : 'Inactive'}
                          size="small"
                          color={mgr.status === 'active' ? 'success' : 'default'}
                          variant="soft"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEditMgr(mgr)}>
                            <Iconify icon="solar:pen-bold" width={18} />
                          </IconButton>
                        </Tooltip>
                        {mgr.role !== 'admin' && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => setDeleteDialog({ type: 'manager', id: mgr._id, name: mgr.name })}
                            >
                              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
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

      {/* ============ MANAGER DIALOG ============ */}
      <Dialog open={mgrDialog} onClose={() => setMgrDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingMgr ? 'Edit Manager' : 'Add Manager'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              label="Full Name"
              value={mgrForm.name}
              onChange={(e) => setMgrForm({ ...mgrForm, name: e.target.value })}
              placeholder="e.g. John Smith"
            />
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={mgrForm.email}
                onChange={(e) => setMgrForm({ ...mgrForm, email: e.target.value })}
                placeholder="john@ezmetric.com"
              />
              <TextField
                fullWidth
                label="Phone"
                value={mgrForm.phone}
                onChange={(e) => setMgrForm({ ...mgrForm, phone: e.target.value })}
                placeholder="(555) 000-0000"
              />
            </Stack>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={mgrForm.password}
              onChange={(e) => setMgrForm({ ...mgrForm, password: e.target.value })}
              placeholder="Enter password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} width={18} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              select
              fullWidth
              label="Role"
              value={mgrForm.role}
              onChange={(e) => setMgrForm({ ...mgrForm, role: e.target.value as 'admin' | 'manager' })}
            >
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMgrDialog(false)} color="inherit">Cancel</Button>
          <Button
            onClick={() => { handleSaveMgr(); setShowPassword(false); }}
            variant="contained"
            disabled={!mgrForm.name.trim() || !mgrForm.email.trim() || !mgrForm.password.trim()}
          >
            {editingMgr ? 'Update' : 'Add'}
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
            onClick={() => {
              if (deleteDialog?.type === 'rule') handleDeleteRule();
              else if (deleteDialog?.type === 'grace') handleDeleteGrace();
              else if (deleteDialog?.type === 'manager') handleDeleteMgr();
              else handleDeleteDep();
            }}
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
