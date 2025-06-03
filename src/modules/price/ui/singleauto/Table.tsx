import { useParams, useNavigate } from 'react-router';
import { useForm, useFieldArray } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Table,
  Button,
  Divider,
  TableRow,
  Container,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { allLangs, useTranslate } from 'src/locales';
import SettingsButton from 'src/layouts/common/settings-button';
import AccountPopover from 'src/layouts/common/account-popover';
import { LanguagePopover } from 'src/layouts/common/language-popover';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFAreaField, RHFTextField } from 'src/components/hook-form';

import { columns } from './col';
import { IPrice } from '../../types/Price';
import { PriceSchemeType } from '../../libs/priceScheme';
import { useUpdatePrice } from '../../hook/useUpdatePrice';

interface Props {
  data: IPrice;
}

export default function SingleAutoPrices({ data }: Props) {
  const { t } = useTranslate('lang');
  const navigate = useNavigate();
  const params = useParams() as { id: string };
  const { onUpdate, isUpdating } = useUpdatePrice(params.id);
  const form = useForm<PriceSchemeType>({
    defaultValues: {
      description_uz: data?.descriptionUz ?? '',
      description_ru: data?.descriptionRu ?? '',
      description_en: data?.descriptionEn ?? '',
      description_cn: data?.descriptionCn ?? '',
      name_uz: data?.nameUz ?? '',
      name_ru: data?.nameRu ?? '',
      name_en: data?.nameEn ?? '',
      name_cn: data?.nameCn ?? '',
      transport_type: 'auto',
      is_dangerous_goods: data.isDangerousGoods ?? false,
      with_customs_clearance: data.withCustomsClearance ?? false,
      pricing: data?.pricing.map((el) => ({
        dangerous_goods_price: el.dangerousGoodsPrice ?? 0,
        price: el.price ?? 0,
        price_with_customs: el.priceWithCustoms ?? 0,
        unit: el.unit ?? 0,
        weight_range: el.weightRange ?? 0,
      })),
    },
  });
  const { append, fields, remove } = useFieldArray<PriceSchemeType>({
    name: 'pricing',
    control: form.control,
  });
  const addNewPrice = () => {
    append({
      dangerous_goods_price: 0,
      price: 0,
      price_with_customs: 0,
      unit: '',
      weight_range: '',
    });
  };
  const isDangerous = form.getValues('is_dangerous_goods') || false;
  const isCustome = form.getValues('with_customs_clearance') || false;

  const formSubmit = async (value: PriceSchemeType) => {
    await onUpdate({
      ...value,
      pricing: value.pricing.map((el) => ({
        ...el,
        dangerous_goods_price: Number(el.dangerous_goods_price),
        price_with_customs: Number(el.price_with_customs),
        price: Number(el.price),
      })),
    });
  };

  return (
    <Container maxWidth={false}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate(-1)}>
            <Iconify icon="weui:back-filled" />
          </IconButton>
          <Typography variant="h5">{t('prices.formTable.auto.title')}</Typography>
        </Box>
        <Box display="flex" ml={1} gap={1}>
          <LanguagePopover data={allLangs} />
          <SettingsButton />
          <AccountPopover />
        </Box>
      </Box>

      <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
        <Grid container spacing={2} mb={3}>
          <Grid item xs={3}>
            <RHFTextField name="name_uz" label={t('prices.formTable.auto.nameUZ')} />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="name_ru" label={t('prices.formTable.auto.nameRU')} />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="name_en" label={t('prices.formTable.auto.nameEN')} />
          </Grid>
          <Grid item xs={3}>
            <RHFTextField name="name_cn" label={t('prices.formTable.auto.nameCN')} />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_uz"
              label={t('prices.formTable.auto.descriptionUZ')}
              rows={4}
            />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_ru"
              label={t('prices.formTable.auto.descriptionRU')}
              rows={4}
            />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_en"
              label={t('prices.formTable.auto.descriptionEN')}
              rows={4}
            />
          </Grid>
          <Grid item xs={3}>
            <RHFAreaField
              name="description_cn"
              label={t('prices.formTable.auto.descriptionCN')}
              rows={4}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            borderRadius: '16px',
            border: '1px solid #919EAB1F',
            boxShadow: '0px 12px 24px -4px #919EAB1F',
            overflow: 'hidden',
          }}
        >
          <Box>
            <TableContainer
              sx={{ scrollbarWidth: 'thin', scrollbarColor: 'currentColor', maxHeight: '332px' }}
            >
              <Table stickyHeader aria-label="sticky table" size="small">
                <TableHead>
                  <TableRow>
                    {columns({ isDangerous, isCustome, t }).map((el) => (
                      <TableCell key={1}>{el?.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody sx={{ borderBottom: '1px solid #919EAB1F' }}>
                  {fields.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <RHFTextField name={`pricing.${index}.weight_range`} size="small" />
                      </TableCell>
                      <TableCell>
                        <RHFTextField name={`pricing.${index}.unit`} size="small" />
                      </TableCell>
                      <TableCell>
                        <RHFTextField name={`pricing.${index}.price`} size="small" />
                      </TableCell>
                      {isDangerous && (
                        <TableCell>
                          <RHFTextField
                            name={`pricing.${index}.dangerous_goods_price`}
                            size="small"
                          />
                        </TableCell>
                      )}
                      {isCustome && (
                        <TableCell>
                          <RHFTextField name={`pricing.${index}.price_with_customs`} size="small" />
                        </TableCell>
                      )}
                      <TableCell>
                        <Box display="flex">
                          <IconButton onClick={() => remove(index)}>
                            <Iconify icon="hugeicons:delete-01" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Divider />
            <Box mt={2} pb={2} display="flex" justifyContent="flex-end" pr={2} gap={2}>
              <Button variant="contained" type="button" onClick={addNewPrice}>
                {t('prices.formTable.auto.actions.add')}
              </Button>
              <LoadingButton color="primary" loading={isUpdating} variant="contained" type="submit">
                {t('actions.save')}
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Container>
  );
}
