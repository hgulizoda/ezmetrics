import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import { Grid, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useTranslate } from 'src/locales';

import { useCreateUser } from '../../hook/user';
import RHFDatePicker from '../../../../components/hook-form/rhf-datepicker';
import { userSchemeRequried, UserFormTypeRequired } from '../../libs/useSchemeRequired';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFPhoneField,
} from '../../../../components/hook-form';

interface IProps {
  open: boolean;
  onClose: () => void;
}

export const CreateUser = ({ open, onClose }: IProps) => {
  const { t } = useTranslate('lang');
  const { createUser, isPending } = useCreateUser();
  const form = useForm<UserFormTypeRequired>({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      company_name: '',
      birth_date: new Date(),
      avatar: '',
      isBonusEnabled: false,
    },
    resolver: yupResolver(userSchemeRequried),
  });
  const formSubmit = async (values: UserFormTypeRequired) => {
    await createUser({ ...values, phone_number: values.phone_number.replace(/ /g, '') });
    onClose();
    form.reset();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
        <DialogTitle sx={{ py: 2 }}>{t('users.formTitle')}</DialogTitle>
        <Divider />
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <RHFTextField fullWidth name="first_name" label={t('users.firstName')} />
            </Grid>
            <Grid item xs={6}>
              <RHFTextField fullWidth name="last_name" label={t('users.lastName')} />
            </Grid>
            <Grid item xs={6}>
              <RHFDatePicker name="birth_date" label={t('users.dob')} />
            </Grid>
            <Grid item xs={6}>
              <RHFPhoneField fullWidth name="phone_number" label={t('users.phone')} />
            </Grid>
            <Grid item xs={6}>
              <RHFTextField fullWidth name="company_name" label={t('users.company')} />
            </Grid>
            <Grid item xs={6}>
              <RHFSwitch name="isBonusEnabled" label={t('users.table.isBonusEnabled')} />
            </Grid>
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions
          sx={{
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button variant="contained" color="error" type="button" onClick={onClose}>
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
