import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Dialog,
  Button,
  Divider,
  useTheme,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { baseColumns } from './col';
import { useBonusesFilter } from './useFilter';
import { useTranslate } from '../../../locales';
import Iconify from '../../../components/iconify';
import { IBonusesList } from '../types/BunusesList';
import { useGetAllBonuses } from '../services/getAll';
import { useGetBonusLimit } from '../services/getLimit';
import { useBoolean } from '../../../hooks/use-boolean';
import { useUpdateLimit } from '../services/updateLimit';
import { RHFTextField } from '../../../components/hook-form';
import { limitSchema, LimitSchemaForm } from '../libs/limitsForm';
import { ErrorData } from '../../../components/error-data/error-data';
import FormProvider from '../../../components/hook-form/form-provider';
import DataGridCustom from '../../../components/data-grid-view/data-grid-custom';

const BonusesView = () => {
  const { t } = useTranslate('lang');
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const open = useBoolean();

  const { updateBunusLimit, isPending: isLimitPending } = useUpdateLimit();

  const {
    onPaginationChange,
    pagination: paginationInfo,
    onSearchChange,
    search,
  } = useBonusesFilter();

  const { limits, isLoading: isLimitLoading } = useGetBonusLimit();

  const { bonuses, pagination, isLoading } = useGetAllBonuses({
    page: paginationInfo.page + 1,
    limit: paginationInfo.pageSize,
    search,
    status: searchParams.get('status'),
  });

  const methods = useForm<LimitSchemaForm>({
    resolver: yupResolver(limitSchema),
  });
  useEffect(() => {
    if (!isLimitLoading) {
      methods.reset({
        volume_limit: limits.volume_limit,
      });
    }
  }, [isLimitLoading, methods, limits.volume_limit]);

  const onSubmit = async (data: LimitSchemaForm) => {
    await updateBunusLimit({
      volume_limit: data.volume_limit!,
    });
    open.setValue(false);
  };

  if (!bonuses) return <ErrorData />;

  return (
    <Box sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          gap: 3,
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" component="h2" display="flex" gap={1}>
          {t('bonus.title')}
          <Typography variant="h4" color={theme.palette.grey[400]}>
            ({bonuses.length})
          </Typography>
        </Typography>
        <Box display="flex" ml={1} gap={1}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="ic:round-add" />}
            onClick={open.onTrue}
          >
            {t('bonus.limitAdd')}
          </Button>
        </Box>
      </Box>
      <Dialog open={open.value} onClose={open.onFalse} fullWidth maxWidth="xs">
        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <DialogTitle sx={{ py: 2 }}>{t('bonus.limitAdd')}</DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <RHFTextField
                  fullWidth
                  type="number"
                  name="volume_limit"
                  label={t('bonus.volumeLimit')}
                  placeholder={t('bonus.volumeLimit')}
                />
              </Grid>
            </Grid>
            <DialogActions
              sx={{
                py: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Button variant="contained" color="error" type="button" onClick={open.onFalse}>
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                loading={isLimitPending}
                variant="contained"
                color="primary"
                type="submit"
              >
                {t('actions.save')}
              </LoadingButton>
            </DialogActions>
          </DialogContent>
        </FormProvider>
      </Dialog>
      <Box position="relative">
        <Box
          position="absolute"
          left={300}
          top={25}
          zIndex={999}
          maxWidth={480}
          gap={2}
          display="flex"
        >
          <Button
            variant={searchParams.get('status') === null ? 'contained' : 'outlined'}
            onClick={() =>
              setSearchParams((prev) => {
                const parns = new URLSearchParams(prev);
                parns.delete('status');
                return parns;
              })
            }
          >
            {t('bonus.all')}
          </Button>
          <Button
            variant={searchParams.get('status') === 'used' ? 'contained' : 'outlined'}
            onClick={() => setSearchParams((prev) => ({ ...prev, status: 'used' }))}
          >
            {t('bonus.enum.used')}
          </Button>
          <Button
            variant={searchParams.get('status') === 'not_used' ? 'contained' : 'outlined'}
            onClick={() => setSearchParams((prev) => ({ ...prev, status: 'not_used' }))}
          >
            {t('bonus.enum.not_used')}
          </Button>
          <Button
            variant={searchParams.get('status') === 'inprogress' ? 'contained' : 'outlined'}
            onClick={() => setSearchParams((prev) => ({ ...prev, status: 'inprogress' }))}
          >
            {t('bonus.enum.in_progress')}
          </Button>
        </Box>
        <Box
          sx={{
            borderRadius: '16px',
            border: '1px solid #919EAB1F',
            boxShadow: '0px 12px 24px -4px #919EAB1F',
            overflow: 'hidden',
            width: '100%',
          }}
        >
          <Box height={700} p={1} sx={{ width: '100%' }}>
            <DataGridCustom<IBonusesList>
              data={bonuses}
              col={baseColumns({
                t,
                handleUpdateStatus,
                handleUnuseBonuse,
              })}
              loading={isLoading}
              rowCount={pagination.total_records}
              onPaginationModelChange={onPaginationChange}
              initialState={{ pagination: { paginationModel: paginationInfo } }}
              onSearchChange={onSearchChange}
              search={search}
              hasTotal={false}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BonusesView;
