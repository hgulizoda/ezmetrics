import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import {
  Grid,
  Button,
  Dialog,
  Divider,
  MenuItem,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { generateRandomId } from 'src/utils/randomId';

import { useTranslate } from 'src/locales';

import RHFDatePicker from 'src/components/hook-form/rhf-datepicker';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { ITruck } from '../../types/truck';
import { useUpdateNewTruck } from '../../hooks/trucks';
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
  initialValue: ITruck;
}

export const UpdateTruck = ({ open, onClose, initialValue }: IDialogProps) => {
  const { t } = useTranslate('lang');
  const { isPending: updating, updateTruck } = useUpdateNewTruck();
  const form = useForm<TruckFormType>({
    defaultValues: {
      id: '',
      type: TruckType.LSJ,
      created_at: new Date(),
      number: '',
    },
    resolver: yupResolver(truckScheme),
  });
  useEffect(() => {
    if (initialValue) {
      const [containerType, code, number] = initialValue.truckName.split('-');
      form.setValue('id', containerType);
      form.setValue('type', code);
      form.setValue('number', number);
      form.setValue('created_at', new Date(initialValue.createdAt));
      form.setValue('estimated_arrival_date', new Date(initialValue.estimatedArrivalDate));
      form.setValue('container_number', initialValue.containerNumber);
    }
  }, [form, initialValue]);
  const formSubmit = async (formValues: TruckFormType) => {
    console.log(formValues);
    await updateTruck({
      values: {
        name: `${formValues.id}-${formValues.type}-${formValues.number}`,
        created_at: formValues.created_at,
        estimated_arrival_date: formValues.estimated_arrival_date,
        container_number: formValues.container_number,
      },
      id: initialValue?.id,
    });
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
        <DialogTitle>{t('transport.form.titleUpdate')}</DialogTitle>
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
                {Object.entries(ContainerType).map(([key, value]) => (
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
              <RHFTextField name="number" label={t('transport.form.truckNumber')} />
            </Grid>
            <Grid item xs={12}>
              <RHFTextField name="container_number" label={t('transport.form.containerNumber')} />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="contained" color="error" onClick={onClose}>
            {t('actions.cancel')}
          </Button>
          <LoadingButton loading={updating} variant="contained" color="primary" type="submit">
            {t('actions.save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};
