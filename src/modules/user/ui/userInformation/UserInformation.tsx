import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Grid, CardHeader, CardContent } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider, { RHFTextField, RHFPhoneField } from 'src/components/hook-form';

import Iconify from '../../../../components/iconify';
import { useBoolean } from '../../../../hooks/use-boolean';
import { userScheme, UserFormType } from '../../libs/userScheme';
import { useGetProfileMe, useUpdateProfile } from '../../hook/profile';
import RHFDatePicker from '../../../../components/hook-form/rhf-datepicker';

const UserInformation = () => {
  const { t } = useTranslate('lang');
  const params = useParams() as { id: string };
  const { profile } = useGetProfileMe(params.id);
  const { updateProfile, isPending } = useUpdateProfile(params.id);

  const editUser = useBoolean(true);
  const form = useForm<UserFormType>({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      company_name: '',
      birth_date: new Date(),
      avatar: '',
      user_id: '',
    },
    resolver: yupResolver(userScheme),
  });
  useEffect(() => {
    if (profile) {
      form.setValue('first_name', profile.firstName, { shouldDirty: true });
      form.setValue('last_name', profile.lastName, { shouldDirty: true });
      form.setValue('phone_number', profile.phone, { shouldDirty: true });
      form.setValue('company_name', profile.companyName, { shouldDirty: true });
      form.setValue('birth_date', new Date(profile.birthDate), {
        shouldDirty: true,
      });
      form.setValue('user_id', profile.userUniqueId, {
        shouldDirty: true,
      });
    }
  }, [form, profile]);

  const formSubmit = async (values: UserFormType) => {
    await updateProfile(values);
    editUser.onTrue();
  };

  return (
    <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
      <Card>
        <CardHeader
          title={t('profile.profileTab.title')}
          action={
            editUser.value ? (
              <Button
                color="primary"
                size="small"
                variant="contained"
                endIcon={<Iconify icon="mage:edit" />}
                onClick={editUser.onToggle}
              >
                {t('actions.edit')}
              </Button>
            ) : (
              <LoadingButton
                endIcon={<Iconify icon="mage:edit" />}
                color="primary"
                size="medium"
                variant="contained"
                type="submit"
                loading={isPending}
              >
                {t('actions.save')}
              </LoadingButton>
            )
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <RHFTextField
                fullWidth
                name="first_name"
                label={t('profile.profileTab.firstName')}
                InputLabelProps={{ shrink: true }}
                disabled={editUser.value}
              />
            </Grid>
            <Grid item xs={4}>
              <RHFTextField
                fullWidth
                name="last_name"
                label={t('profile.profileTab.lastName')}
                InputLabelProps={{ shrink: true }}
                disabled={editUser.value}
              />
            </Grid>
            <Grid item xs={4}>
              <RHFDatePicker
                name="birth_date"
                label={t('profile.profileTab.dob')}
                disabled={editUser.value}
              />
            </Grid>
            <Grid item xs={4}>
              <RHFPhoneField
                fullWidth
                name="phone_number"
                label={t('profile.profileTab.phone')}
                InputLabelProps={{ shrink: true }}
                disabled={editUser.value}
              />
            </Grid>
            <Grid item xs={4}>
              <RHFTextField
                fullWidth
                name="company_name"
                label={t('profile.profileTab.company')}
                InputLabelProps={{ shrink: true }}
                disabled={editUser.value}
              />
            </Grid>
            <Grid item xs={4}>
              <RHFTextField
                fullWidth
                name="user_id"
                label={t('profile.profileTab.userID')}
                type="id"
                InputLabelProps={{ shrink: true }}
                disabled={editUser.value}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </FormProvider>
  );
};

export default UserInformation;
