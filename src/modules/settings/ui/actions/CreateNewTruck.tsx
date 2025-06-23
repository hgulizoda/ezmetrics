import { memo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem';
import {
  Grid,
  Button,
  Dialog,
  Divider,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';
import FormProvider, { RHFSelect, RHFTextField, RHFTruckField } from 'src/components/hook-form';

import { ITruckRes } from '../../types/truck';
import { generateRandomId } from '../../../../utils/randomId';
import { useGetTrucks, useCreateNewTruck } from '../../hooks/trucks';
import {
  TruckType,
  truckScheme,
  TruckFormType,
  ContainerType,
  ContainerTypeLabels,
} from '../../libs/createNewTruckScheme';

interface IDialogProps {
  open: boolean;
  onClose: () => void;
  onTruckCreate?: (e: ITruckRes) => void;
}

export const CreateNewTruck = memo(({ open, onClose, onTruckCreate }: IDialogProps) => {
  const { t } = useTranslate('lang');
  const { createTruck, isPending } = useCreateNewTruck(onTruckCreate);
  const { data } = useGetTrucks({ page: 1, limit: 100000 });
  const form = useForm<TruckFormType>({
    defaultValues: { id: '', type: '', created_at: new Date(), number: '', container_number: '' },
    resolver: yupResolver(truckScheme),
  });
  const formSubmit = async (formValues: TruckFormType) => {
    await createTruck({
      name: `${formValues.id}-${formValues.type}-${formValues.number}`,
      created_at: formValues.created_at,
      estimated_arrival_date: formValues.estimated_arrival_date,
      container_number: formValues.container_number,
    });
    onClose();
    form.reset();
  };
  const isChange = form.watch('id');

  useEffect(() => {
    if (!data?.trucks?.length) return; // Guard clause for empty/null data

    const currentYear = new Date().getFullYear().toString().slice(-2);
    const lastTruckName = data.trucks[0]?.truckName ?? `${currentYear}000`;
    const lastTruckNumber = parseInt(lastTruckName.slice(-3), 10) || 0; // Ensure it's a number
    const generatedNumber = String(lastTruckNumber + 1).padStart(3, '0'); // Ensures 3-digit format

    form.setValue('number', `${currentYear}${generatedNumber}`);
  }, [data, form, isChange]); // Removed redundant dependency

  const createdAt = form.watch('created_at');
  useEffect(() => {
    if (createdAt) {
      const estimatedDate = new Date(createdAt);
      estimatedDate.setDate(estimatedDate.getDate() + 14); // 14 kun qo‘shish
      form.setValue('estimated_arrival_date', estimatedDate);
    }
  }, [createdAt, form]);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
        <DialogTitle>{t('transport.form.title')}</DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <RHFDatePicker name="created_at" label={t('transport.form.truckCreatedDate')} />
            </Grid>
            <Grid item xs={6}>
              <RHFDatePicker
                name="estimated_arrival_date"
                label={t('transport.form.truckEstimatedDate')}
              />
            </Grid>
            <Grid item xs={3}>
              <RHFSelect name="id" label={t('transport.form.containerType')}>
                {Object.entries(ContainerType).map(([_, value]) => (
                  <MenuItem value={value} key={generateRandomId(12)}>
                    {ContainerTypeLabels[value]}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={3}>
              <RHFSelect name="type" label={t('transport.form.truckType')}>
                {Object.keys(TruckType).map((item) => (
                  <MenuItem value={item} key={generateRandomId(12)}>
                    {item}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item xs={6}>
              <RHFTruckField name="number" type="truck" label={t('transport.form.truckNumber')} />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="container_number"
                type="text"
                label={t('transport.form.containerNumber')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" color="error" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <LoadingButton loading={isPending} variant="contained" color="primary" type="submit">
            {t('actions.save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
});
