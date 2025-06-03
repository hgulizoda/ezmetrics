import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Grid, Button, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider, { RHFAreaField, RHFTextField } from 'src/components/hook-form';

import { IPrice } from '../../types/Price';
import { useUpdatePrice } from '../../hook/useUpdatePrice';
import { useCreatePrice } from '../../hook/useCreatePrice';
import { priceResSchema, PriceSchemeType } from '../../libs/priceScheme';

interface Props {
  data?: IPrice;
}

export const AirPrice = ({ data }: Props) => {
  const { t } = useTranslate('lang');
  const { isUpdating, onUpdate } = useUpdatePrice(data?.id ?? '');
  const { isCreating, onCreate } = useCreatePrice();
  const form = useForm<PriceSchemeType>({
    defaultValues: {
      description_uz: data?.descriptionUz || '',
      description_ru: data?.descriptionRu || '',
      description_en: data?.descriptionEn || '',
      description_cn: data?.descriptionCn || '',
      name_uz: data?.nameUz || '',
      name_ru: data?.nameRu || '',
      name_en: data?.nameEn || '',
      name_cn: data?.nameCn || '',
      transport_type: 'air',
      documentation_price: data?.documentationPrice || 0,
      kg_in_1m3: data?.kgIn1M3 || 0,
      price_per_kg: data?.pricePerKg || 0,
      pricing: [],
    },
    resolver: yupResolver(priceResSchema),
  });

  const formSubmit = async (values: PriceSchemeType) => {
    if (data) {
      return onUpdate(values);
    }
    return onCreate(values);
  };

  return (
    <Box>
      <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{t('prices.formTable.air.shortDescFirst')}</Typography>
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="name_uz" label={t('prices.formTable.air.nameUZ')} />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="name_ru" label={t('prices.formTable.air.nameRU')} />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="name_en" label={t('prices.formTable.air.nameEN')} />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="name_cn" label={t('prices.formTable.air.nameCN')} />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_uz"
              label={t('prices.formTable.air.descriptionUZ')}
              rows={4}
            />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_ru"
              label={t('prices.formTable.air.descriptionRU')}
              rows={4}
            />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_en"
              label={t('prices.formTable.air.descriptionEN')}
              rows={4}
            />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_cn"
              label={t('prices.formTable.air.descriptionCN')}
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{t('prices.formTable.air.shortDescSecond')}</Typography>
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="kg_in_1m3" type="number" label={t('prices.formTable.air.1mkub')} />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField
              name="price_per_kg"
              type="number"
              label={t('prices.formTable.air.1kgprice')}
            />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField
              name="documentation_price"
              type="number"
              label={t('prices.formTable.air.normalizePrice')}
            />
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="contained" color="inherit" type="button">
              {t('actions.cancel')}
            </Button>
            <LoadingButton
              loading={isCreating || isUpdating}
              variant="contained"
              color="primary"
              type="submit"
            >
              {t('actions.save')}
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
};
