import { useNavigate } from 'react-router';
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
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  TableContainer,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSwitch, RHFAreaField, RHFTextField } from 'src/components/hook-form';

import { columns } from './col';
import { PriceSchemeType } from '../../libs/priceScheme';
import { useCreatePrice } from '../../hook/useCreatePrice';

export default function CreateAutoPrice() {
  const { t } = useTranslate('lang');
  const { isCreating, onCreate } = useCreatePrice();

  const navigate = useNavigate();
  const form = useForm<PriceSchemeType>({
    defaultValues: {
      description_uz: '',
      description_ru: '',
      description_en: '',
      description_cn: '',
      name_uz: '',
      name_ru: '',
      name_en: '',
      name_cn: '',
      transport_type: 'auto',
      is_dangerous_goods: false,
      with_customs_clearance: false,
      pricing: [
        {
          dangerous_goods_price: 0,
          price: 0,
          price_with_customs: 0,
          unit: '',
          weight_range: '',
        },
      ],
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

  const isDangerous = form.watch('is_dangerous_goods') || false;
  const isCustome = form.watch('with_customs_clearance') || false;

  const formSubmit = async (value: PriceSchemeType) => {
    delete value.kg_in_1m3;
    delete value.price_per_kg;
    delete value.documentation_price;
    await onCreate({
      ...value,
      pricing: value.pricing.map((el) => ({
        ...el,
        dangerous_goods_price: Number(el.dangerous_goods_price),
        price_with_customs: Number(el.price_with_customs),
        price: Number(el.price),
      })),
    });
    navigate('/dashboard/prices/auto');
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5">{t('prices.formTable.auto.actions.addPrice')}</Typography>
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
        <Box mb={2} display="flex" justifyContent="flex-end">
          <RHFSwitch
            name="is_dangerous_goods"
            label={t('prices.formTable.auto.actions.dangerCargo')}
          />
          <RHFSwitch
            name="with_customs_clearance"
            label={t('prices.formTable.auto.actions.customsClearance')}
          />
        </Box>
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
                        <RHFTextField name={`pricing.${index}.price`} size="small" type="number" />
                      </TableCell>
                      {isDangerous && (
                        <TableCell>
                          <RHFTextField
                            name={`pricing.${index}.dangerous_goods_price`}
                            size="small"
                            type="number"
                          />
                        </TableCell>
                      )}
                      {isCustome && (
                        <TableCell>
                          <RHFTextField
                            name={`pricing.${index}.price_with_customs`}
                            size="small"
                            type="number"
                          />
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
              <LoadingButton color="primary" loading={isCreating} variant="contained" type="submit">
                {t('prices.formTable.auto.actions.save')}
              </LoadingButton>
            </Box>
          </Box>
        </Box>
      </FormProvider>
    </Container>
  );
}
