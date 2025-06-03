import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Grid, Button, Container, Typography, IconButton } from '@mui/material';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';
import { useUploadImage } from 'src/modules/package/hook/useUploadImage';

import Iconify from 'src/components/iconify';
import { RHFUpload } from 'src/components/hook-form/rhf-upload-preview';
import FormProvider, { RHFEditor, RHFTextField } from 'src/components/hook-form';

import { INotification } from '../types/Notification';
import { notificationScheme, NotificationFormType } from '../libs/notificationScheme';
import { useSendNotifications, useUpdateNotifications } from '../hooks/useNotification';

interface Props {
  notification?: INotification;
}

export const NotificationsForm = ({ notification }: Props) => {
  const { t } = useTranslate('lang');
  const { uploadAsync, isPending: isUploading } = useUploadImage();
  const navigate = useNavigate();
  const { isPending, sendNotification } = useSendNotifications();
  const { isPending: isUpdating, updateNotification } = useUpdateNotifications(
    notification?.id ?? ''
  );
  const form = useForm<NotificationFormType>({
    defaultValues: {
      title: {
        uz: '',
        ru: '',
      },
      body: {
        uz: '',
        ru: '',
      },
      image: {
        uz: '',
        ru: '',
      },
      type: 'main',
    },
    resolver: yupResolver(notificationScheme),
  });

  useEffect(() => {
    if (notification) {
      form.setValue('title.uz', notification.title.uz ?? '');
      form.setValue('title.ru', notification.title.ru ?? '');
      form.setValue('body.uz', notification.body.uz ?? '');
      form.setValue('body.ru', notification.body.ru ?? '');
      form.setValue('image.uz', notification.image.uz ?? '');
      form.setValue('image.ru', notification.image.ru ?? '');
    }
  }, [form, notification]);

  const handleRemove = {
    imageUZ: () => form.setValue('image.uz', ''),
    imageRu: () => form.setValue('image.ru', ''),
  };
  const formSubmit = async (value: NotificationFormType) => {
    const imageUrlUz =
      value.image.uz instanceof File
        ? await uploadAsync({ file: value.image.uz as File })
        : { url: value.image.uz };
    const imageUrlRu =
      value.image.ru instanceof File
        ? await uploadAsync({ file: value.image.ru as File })
        : { url: value.image.ru };
    if (notification) {
      await updateNotification({ ...value, image: { uz: imageUrlUz.url, ru: imageUrlRu.url } });
    } else {
      await sendNotification({ ...value, image: { uz: imageUrlUz.url, ru: imageUrlRu.url } });
    }
    return form.reset();
  };
  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          mb: 2,
          gap: 3,
          justifyContent: 'space-between',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton size="small" onClick={() => navigate(-1)}>
            <Iconify icon="weui:back-filled" />
          </IconButton>
          <Typography variant="h6" color="textSecondary">
            {notification ? t('notification.form.titleSecond') : t('notification.form.titleFirst')}
          </Typography>
        </Box>

        <Box display="flex" ml={1} gap={1} alignItems="center">
          <LanguagePopover data={allLangs} />
          <SettingsButton />
          <AccountPopover />
        </Box>
      </Box>
      <Box>
        <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <RHFTextField name="title.uz" label={t('notification.form.titleUZ')} />
            </Grid>
            <Grid item xs={6}>
              <RHFTextField name="title.ru" label={t('notification.form.titleRU')} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">{t('notification.form.contentUZ')}</Typography>
              <RHFEditor name="body.uz" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">{t('notification.form.contentRU')}</Typography>
              <RHFEditor name="body.ru" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">{t('notification.form.imageUZ')}</Typography>
              <RHFUpload thumbnail name="image.uz" onDelete={handleRemove.imageUZ} />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">{t('notification.form.imageRU')}</Typography>
              <RHFUpload thumbnail name="image.ru" onDelete={handleRemove.imageRu} />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                onClick={() => {
                  form.reset();
                }}
                type="button"
                variant="contained"
                color="inherit"
              >
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                loading={isPending || isUploading || isUpdating}
                type="submit"
                variant="contained"
                color="primary"
              >
                {t('actions.save')}
              </LoadingButton>
            </Grid>
          </Grid>
        </FormProvider>
      </Box>
    </Container>
  );
};
