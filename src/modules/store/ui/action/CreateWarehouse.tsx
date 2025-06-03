import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Grid, Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider, { RHFTextField } from 'src/components/hook-form';
import RHFPhoneFieldChina from 'src/components/hook-form/rhf-phone-china';

import { useCreateStore } from '../../hooks/useCreateStore';
import { createStoreSchema, CreateStoreSchemaType } from '../../libs/createStoreScheme';

interface IProps {
  open: boolean;
  onClose: () => void;
}

export const CreateWarehouse = ({ open, onClose }: IProps) => {
  const { t } = useTranslate('lang');
  const { isPending, mutateAsync } = useCreateStore();
  const form = useForm<CreateStoreSchemaType>({
    defaultValues: {
      phone_number: '',
      receiver: '',
      recieving_date: '',
      store_address: '',
      wechat_id: '',
    },
    resolver: yupResolver(createStoreSchema),
  });
  const formSubmit = async (values: CreateStoreSchemaType) => {
    await mutateAsync(values);
    onClose();
    form.reset();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
        <DialogTitle sx={{ pb: 0 }}>{t('store.form.title')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <RHFTextField name="receiver" label={t('store.form.reciver')} />
            </Grid>
            <Grid item xs={6}>
              <RHFPhoneFieldChina name="phone_number" label={t('store.form.phone')} />
            </Grid>
            <Grid item xs={6}>
              <RHFTextField
                name="recieving_date"
                label={t('store.form.date')}
                placeholder="10:00-16:30"
              />
            </Grid>
            <Grid item xs={6}>
              <RHFTextField name="wechat_id" label={t('store.form.chatID')} />
            </Grid>

            <Grid item xs={6}>
              <RHFTextField name="store_address" label={t('store.form.address')} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} variant="contained" color="error" type="button">
            {t('actions.cancel')}
          </Button>
          <LoadingButton loading={isPending} variant="contained" color="primary" type="submit">
            {t('actions.save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};
