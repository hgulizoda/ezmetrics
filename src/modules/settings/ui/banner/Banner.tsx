import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Card, Grid, CardHeader, Typography, CardActions, CardContent } from '@mui/material';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import { RHFUpload } from 'src/components/hook-form/rhf-upload-preview';

import { BannerDND } from './BannerDND/BannerDND';
import Iconify from '../../../../components/iconify';
import { useCreateBanner } from '../../hooks/useBanner';
import FormProvider from '../../../../components/hook-form';
import { useUploadImage } from '../../../package/hook/useUploadImage';
import { bannerScheme, BannerSchemeType } from '../../libs/bannerScheme';

const Banner = () => {
  const { t } = useTranslate('lang');
  const { uploadAsync, isPending: uploading } = useUploadImage();
  const { isPosting, creatingBanner } = useCreateBanner();
  const form = useForm<BannerSchemeType>({
    defaultValues: {
      image_url: {
        uz: '',
        ru: '',
      },
    },
    resolver: yupResolver(bannerScheme),
  });

  const handleRemove = {
    imageUZ: () => form.setValue('image_url.uz', ''),
    imageRu: () => form.setValue('image_url.ru', ''),
  };

  const formSubmit = async (value: BannerSchemeType) => {
    const imageUrlUz =
      value.image_url.uz instanceof File
        ? await uploadAsync({ file: value.image_url.uz as File })
        : { url: value.image_url.uz };

    const imageUrlRu =
      value.image_url.ru instanceof File
        ? await uploadAsync({ file: value.image_url.ru as File })
        : { url: value.image_url.ru };

    await creatingBanner({
      image_url: {
        uz: imageUrlUz.url,
        ru: imageUrlRu.url,
      },
    });

    form.reset();
  };

  return (
    <Container maxWidth={false} sx={{ height: '100%' }}>
      <Box display="flex" ml={1} gap={1} justifyContent="flex-end" width="100%" mb={2}>
        <LanguagePopover data={allLangs} />
        <SettingsButton />
        <AccountPopover />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Card>
            <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
              <CardHeader sx={{ pb: 2, pt: 2 }} title={t('banner.extraTitle')} />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">{t('banner.imageUZ')}</Typography>
                    <RHFUpload
                      multiple
                      name="image_url.uz"
                      thumbnail
                      onDelete={handleRemove.imageUZ}
                      sx={{
                        '.css-1te7qta-MuiStack-root': {
                          display: 'none',
                        },
                        '.css-5vb4lz': {
                          mb: 0,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">{t('banner.imageRU')}</Typography>
                    <RHFUpload
                      thumbnail
                      multiple
                      name="image_url.ru"
                      onDelete={handleRemove.imageUZ}
                      sx={{
                        '.css-1te7qta-MuiStack-root': {
                          display: 'none',
                        },
                        '.css-5vb4lz': {
                          mb: 0,
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', py: 2, pr: 3 }}>
                <LoadingButton
                  variant="contained"
                  color="inherit"
                  endIcon={<Iconify icon="iconamoon:send-fill" />}
                  type="submit"
                  loading={isPosting || uploading}
                >
                  {t('actions.send')}
                </LoadingButton>
              </CardActions>
            </FormProvider>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card>
            <CardHeader sx={{ pb: 2, pt: 2 }} title={t('banner.imageTitle')} />
            <Divider />
            <CardContent>
              <BannerDND />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Banner;
