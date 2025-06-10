import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Grid, DialogActions, DialogContent } from '@mui/material';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { useGetTruckOrder } from '../../../settings/hooks/useTruckDetails';
import { useSeparatePackage } from '../../../trucks/hooks/useSeparatePackage';
import { separateScheme, SeparateFormType } from '../../../trucks/libs/separateScheme';

interface Props {
  id: string;
  onClose: () => void;
  open: boolean;
  query: string;
}

export const SeparateOrder = ({ id, onClose, open, query }: Props) => {
  const { t } = useTranslate('lang');
  const { onSeparate, isSeparating } = useSeparatePackage(id, query);
  const { data } = useGetTruckOrder(id);
  const form = useForm<SeparateFormType>({
    defaultValues: {
      weight: 0,
      capacity: 0,
      count: 0,
      places: 0,
    },
    resolver: yupResolver(
      separateScheme({
        weight: data?.orderWeight ?? 0,
        capacity: data?.orderCapacity ?? 0,
        count: data?.totalCount ?? 0,
        places: data?.totalPlaces ?? 0,
      })
    ),
  });
  useEffect(() => {
    if (data) {
      form.setValue('weight', data.orderWeight ?? 0);
      form.setValue('capacity', data.orderCapacity ?? 0);
      form.setValue('count', data.totalCount ?? 0);
      form.setValue('places', data.totalPlaces ?? 0);
    }
  }, [data, form, id]);

  const formSubmit = async (formValues: SeparateFormType) => {
    await onSeparate(formValues);
    form.reset();
    onClose();
    queryClient.invalidateQueries({
      queryKey: ['truckOrder', id],
    });
  };

  return (
    <Box width="100%">
      <Dialog open={open} onClose={onClose}>
        <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="warning" slotProps={{}}>
                  {t('packages.actions.alert')}
                </Alert>
              </Grid>
              <Grid item xs={6}>
                <RHFTextField
                  name="weight"
                  label={t('packages.createPackageForm.weight')}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          kg
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <RHFTextField
                  name="capacity"
                  label={t('packages.createPackageForm.capacity')}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          m³
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <RHFTextField
                  name="count"
                  label={t('packages.createPackageForm.stockNumber')}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          ta
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <RHFTextField
                  name="places"
                  label={t('packages.createPackageForm.packageNumber')}
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <Box component="span" sx={{ color: 'text.disabled' }}>
                          ta
                        </Box>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="contained" color="error" onClick={onClose}>
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                loading={isSeparating}
                variant="contained"
                color="primary"
                type="submit"
              >
                {t('actions.save')}
              </LoadingButton>
            </Box>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </Box>
  );
};
