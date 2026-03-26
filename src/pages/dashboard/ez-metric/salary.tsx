import { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { useSalary, useLoans, useCreateLoan } from 'src/modules/ez-metric/api';

function getEfficiencyChipColor(efficiency: string): 'success' | 'info' | 'warning' {
  const val = parseInt(efficiency, 10);
  if (val >= 100) return 'success';
  if (val >= 80) return 'info';
  return 'warning';
}

export default function SalaryPage() {
  const [tab, setTab] = useState(0);
  const [loanDialog, setLoanDialog] = useState(false);
  const [loanForm, setLoanForm] = useState({ worker: '', type: 'loan', amount: '', notes: '' });

  const { data: salaryData = [], isLoading: salaryLoading } = useSalary();
  const { data: loansData = [], isLoading: loansLoading } = useLoans();
  const createLoan = useCreateLoan();

  const totalPayroll = salaryData.reduce((s: number, w: any) => s + (w.totalPayroll || 0), 0);
  const totalBonuses = salaryData.reduce((s: number, w: any) => s + Math.max(w.bonus || 0, 0), 0);
  const totalCharges = salaryData.reduce((s: number, w: any) => s + (w.charge || 0), 0);
  const totalDebt = salaryData.reduce((s: number, w: any) => s + (w.debtLeft || 0), 0);

  const handleAddLoan = async () => {
    try {
      await createLoan.mutateAsync({
        worker: loanForm.worker,
        type: loanForm.type,
        amount: Number(loanForm.amount),
        notes: loanForm.notes,
      });
      setLoanDialog(false);
      setLoanForm({ worker: '', type: 'loan', amount: '', notes: '' });
    } catch (error) {
      console.error('Failed to create loan:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4">Salary Calculation</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Manage payroll, rates, deductions, and loans
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="soft"
            startIcon={<Iconify icon="solar:money-bag-bold-duotone" />}
            onClick={() => setLoanDialog(true)}
          >
            Add Loan
          </Button>
          <Button
            variant="soft"
            color="info"
            startIcon={<Iconify icon="solar:download-minimalistic-bold-duotone" />}
          >
            Export Excel
          </Button>
        </Stack>
      </Stack>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total Payroll', value: `$${totalPayroll.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, color: '#2065D1', icon: 'solar:wallet-money-bold-duotone' },
          { label: 'Total Bonuses', value: `$${totalBonuses.toLocaleString()}`, color: '#22C55E', icon: 'solar:gift-bold-duotone' },
          { label: 'Total Charges', value: `$${totalCharges.toLocaleString()}`, color: '#FF5630', icon: 'solar:bill-list-bold-duotone' },
          { label: 'Outstanding Debt', value: `$${totalDebt.toLocaleString()}`, color: '#FFAB00', icon: 'solar:banknote-2-bold-duotone' },
        ].map((s) => (
          <Grid item xs={6} md={3} key={s.label}>
            <Card sx={{ p: 2.5, borderRadius: 2, border: `1px solid ${alpha(s.color, 0.2)}` }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(s.color, 0.1) }}>
                  <Iconify icon={s.icon} width={24} sx={{ color: s.color }} />
                </Box>
                <Box>
                  <Typography variant="h5">{s.value}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                </Box>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ borderRadius: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2.5, pt: 1 }}>
          <Tab label="Salary Overview" />
          <Tab label="Rate Configuration" />
          <Tab label="Loans & Deductions" />
        </Tabs>

        {/* Salary Overview Tab */}
        {tab === 0 && (
          salaryLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Worker</TableCell>
                    <TableCell align="right">Actual Hrs</TableCell>
                    <TableCell align="right">Billed Hrs</TableCell>
                    <TableCell align="center">Efficiency</TableCell>
                    <TableCell align="right">Bonus</TableCell>
                    <TableCell align="right">Salary</TableCell>
                    <TableCell align="right">Rate</TableCell>
                    <TableCell align="right">Overtime</TableCell>
                    <TableCell align="right">Charge</TableCell>
                    <TableCell align="right">Total Payroll</TableCell>
                    <TableCell align="right">Debt Left</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {salaryData.map((w: any) => (
                    <TableRow
                      key={w._id}
                      hover
                      sx={{
                        bgcolor: (w.bonus || 0) < 0 ? alpha('#FF5630', 0.04) : 'transparent',
                      }}
                    >
                      <TableCell><Typography variant="subtitle2">{w.name}</Typography></TableCell>
                      <TableCell align="right">{w.actualHours}</TableCell>
                      <TableCell align="right">{w.billedHours}</TableCell>
                      <TableCell align="center">
                        {w.efficiency && w.efficiency !== 'N/A' ? (
                          <Chip label={w.efficiency} size="small" variant="soft" color={getEfficiencyChipColor(w.efficiency)} />
                        ) : (
                          <Chip label="N/A" size="small" variant="soft" />
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="subtitle2"
                          sx={{ color: (w.bonus || 0) >= 0 ? '#22C55E' : '#FF5630' }}
                        >
                          {(w.bonus || 0) >= 0 ? '' : '-'}${Math.abs(w.bonus || 0).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">${(w.baseSalary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell align="right">${w.rate}</TableCell>
                      <TableCell align="right">
                        {(w.overtime || 0) > 0 ? (
                          <Chip label={`$${w.overtime}`} size="small" color="warning" variant="soft" />
                        ) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {(w.charge || 0) > 0 ? (
                          <Typography variant="subtitle2" sx={{ color: '#FF5630' }}>${w.charge}</Typography>
                        ) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          ${(w.totalPayroll || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {(w.debtLeft || 0) > 0 ? (
                          <Typography variant="subtitle2" sx={{ color: '#FFAB00' }}>${(w.debtLeft || 0).toLocaleString()}</Typography>
                        ) : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Salary">
                          <IconButton size="small"><Iconify icon="solar:pen-bold-duotone" width={18} /></IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )
        )}

        {/* Rate Configuration Tab */}
        {tab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {[
                { type: 'Hourly Rate', desc: 'Pay per hour worked', icon: 'solar:clock-circle-bold-duotone', color: '#2065D1', workers: 10, example: '$25 - $30/hr' },
                { type: 'Percentage Rate', desc: 'Percentage of billed revenue', icon: 'solar:graph-up-bold-duotone', color: '#7635DC', workers: 1, example: '35% of revenue' },
                { type: 'Flat Rate', desc: 'Fixed monthly salary', icon: 'solar:wallet-money-bold-duotone', color: '#22C55E', workers: 1, example: '$2,400/month' },
              ].map((rt) => (
                <Grid item xs={12} md={4} key={rt.type}>
                  <Card
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: `1px solid ${alpha(rt.color, 0.2)}`,
                      '&:hover': { borderColor: rt.color, boxShadow: `0 0 0 1px ${alpha(rt.color, 0.3)}` },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(rt.color, 0.1), width: 'fit-content', mb: 2 }}>
                      <Iconify icon={rt.icon} width={28} sx={{ color: rt.color }} />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>{rt.type}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>{rt.desc}</Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Chip label={`${rt.workers} workers`} size="small" variant="soft" />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{rt.example}</Typography>
                    </Stack>
                    <Button fullWidth variant="soft" sx={{ mt: 2 }} startIcon={<Iconify icon="solar:settings-bold" />}>
                      Configure
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Card sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: alpha('#FFAB00', 0.04), border: `1px solid ${alpha('#FFAB00', 0.2)}` }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Iconify icon="solar:alarm-bold-duotone" width={20} sx={{ color: '#FFAB00' }} />
                <Typography variant="subtitle1">Late Penalty Configuration</Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Charge $1 per minute for late arrivals. This is deducted from the worker&apos;s salary.
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField size="small" label="Penalty per minute ($)" defaultValue="1.00" sx={{ width: 200 }} />
                <TextField size="small" label="Grace period (min)" defaultValue="5" sx={{ width: 200 }} />
                <Button variant="contained" size="small">Update</Button>
              </Stack>
            </Card>
          </Box>
        )}

        {/* Loans Tab */}
        {tab === 2 && (
          <Box sx={{ p: 3 }}>
            {loansLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Worker</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Paid</TableCell>
                      <TableCell align="right">Remaining</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="center">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loansData.map((loan: any) => (
                      <TableRow key={loan._id} hover>
                        <TableCell><Typography variant="subtitle2">{loan.worker?.name}</Typography></TableCell>
                        <TableCell><Chip label={loan.type} size="small" variant="soft" color={loan.type === 'Loan' ? 'error' : 'warning'} /></TableCell>
                        <TableCell align="right">${(loan.amount || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">${(loan.paid || 0).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Typography variant="subtitle2" sx={{ color: (loan.remaining || 0) > 0 ? '#FF5630' : '#22C55E' }}>
                            ${(loan.remaining || 0).toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>{loan.date}</TableCell>
                        <TableCell align="center">
                          <Chip label={loan.status === 'active' ? 'Active' : 'Paid'} size="small" color={loan.status === 'active' ? 'warning' : 'success'} variant="soft" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Card>

      {/* Loan Dialog */}
      <Dialog open={loanDialog} onClose={() => setLoanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Loan / Pre-payment</DialogTitle>
        <DialogContent sx={{ pt: '20px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Worker"
                value={loanForm.worker}
                onChange={(e) => setLoanForm((prev) => ({ ...prev, worker: e.target.value }))}
              >
                {salaryData.map((w: any) => <MenuItem key={w._id} value={w._id}>{w.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                select
                label="Type"
                value={loanForm.type}
                onChange={(e) => setLoanForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                <MenuItem value="loan">Loan</MenuItem>
                <MenuItem value="prepayment">Pre-payment</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Amount ($)"
                type="number"
                value={loanForm.amount}
                onChange={(e) => setLoanForm((prev) => ({ ...prev, amount: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Notes"
                value={loanForm.notes}
                onChange={(e) => setLoanForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoanDialog(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddLoan}
            disabled={createLoan.isPending || !loanForm.worker || !loanForm.amount}
          >
            {createLoan.isPending ? 'Adding...' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
