import { useForm } from 'react-hook-form';
import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Box, Button, CardActions, CardContent } from '@mui/material';

import { useTranslate } from 'src/locales';
import { IUser } from 'src/modules/user/types/User';
import { useGetUsersList } from 'src/modules/user/hook/user';

import Iconify from 'src/components/iconify';
import FormProvider, {
  RHFEditor,
  RHFUpload,
  RHFTextField,
  RHFAutocomplete,
  RHFSwitch,
} from 'src/components/hook-form';

import { useCreatePackage } from '../../hook/newPackage';
import { useUploadImage } from '../../hook/useUploadImage';
import { createPackageScheme, CreatePackageFormType } from '../../libs/createPackageScheme';
import { useActionSingleOrder, useUpdateSingleOrder } from '../../hook/useActionSingleOrder';

function removeHtmlTags(text: string): string {
  const regex = /<.*?>/g;
  return text.replace(regex, '');
}

const CreatePackageForm = () => {
  const { t } = useTranslate('lang');
  const params = useParams() as { id: string };
  const { updateSinglePackage, isUpdating } = useUpdateSingleOrder(params.id);
  const { singleOrderData } = useActionSingleOrder(params.id);
  const navigate = useNavigate();
  const { data } = useGetUsersList({ page: 1, limit: 10000 });
  const { uploadAsync, isPending: uploading } = useUploadImage();
  const { createPackage, isPending } = useCreatePackage();
  const form = useForm<CreatePackageFormType>({
    defaultValues: {
      user: {
        label: '',
        value: '',
      },
      description: '',
      note: '',
      images: [],
      order_capacity: '',
      order_weight: '',
      total_count: '',
      total_places: '',
      isCustomsByUser: false,
    },
    resolver: yupResolver(createPackageScheme),
  });

  useEffect(() => {
    if (singleOrderData && params.id) {
      form.setValue('description', singleOrderData.description ?? '');
      form.setValue('images', singleOrderData.images ?? []);
      form.setValue('note', singleOrderData.note ?? '');
      form.setValue('order_capacity', singleOrderData.orderCapacity ?? '');
      form.setValue('total_count', singleOrderData.totalCount ?? '');
      form.setValue('total_places', singleOrderData.totalPlaces ?? '');
      form.setValue('order_weight', singleOrderData.orderWeight ?? '');
      form.setValue('user.label', singleOrderData.user.userId ?? '');
      form.setValue('user.value', singleOrderData.user.id ?? '');
      form.setValue('isCustomsByUser', singleOrderData.isCustomsByUser ?? false);
    }
  }, [form, params.id, singleOrderData]);

  const imagesValue = form.watch();
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = imagesValue.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      form.setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [form, imagesValue.images]
  );
  const handleRemoveAllFiles = useCallback(() => {
    form.setValue('images', []);
  }, [form]);

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered =
        imagesValue.images && imagesValue.images?.filter((file) => file !== inputFile);
      form.setValue('images', filtered);
    },
    [form, imagesValue.images]
  );
  const formSubmit = async (value: CreatePackageFormType) => {
    const images = value.images || [];
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        if (image instanceof File) {
          const newImage = await uploadAsync({ file: image });
          return newImage.url;
        }
        return image || '';
      })
    );
    if (params.id && singleOrderData) {
      // @ts-ignore
      delete value.user;
      await updateSinglePackage({
        ...value,
        description: removeHtmlTags(value.description ?? ''),
        note: removeHtmlTags(value.note ?? ''),
        images: uploadedImages,
        order_capacity: Number(value.order_capacity),
        order_weight: Number(value.order_weight),
        total_places: Number(value.total_places),
        total_count: Number(value.total_count),
      });
    } else {
      await createPackage({
        ...value,
        description: removeHtmlTags(value.description ?? ''),
        note: removeHtmlTags(value.note ?? ''),
        images: uploadedImages,
        order_capacity: Number(value.order_capacity),
        order_weight: Number(value.order_weight),
        total_places: Number(value.total_places),
        total_count: Number(value.total_count),
      });
    }
    navigate(-1);
  };
  return (
    <Container maxWidth={false}>
      <Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton sx={{ transform: 'rotate(180deg)' }} onClick={() => navigate(-1)}>
            <Iconify icon="oui:arrow-right" />
          </IconButton>
          <Typography variant="h4">
            {params.id
              ? `${t('packages.createPackageForm.titleSecond')}`
              : `${t('packages.createPackageForm.title')}`}
          </Typography>
        </Box>
        <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} display="" direction="row" spacing={2}>
                  <RHFAutocomplete
                    name="user"
                    disabled={!!params.id}
                    placeholder="SJ-0001"
                    label={t('packages.createPackageForm.userID')}
                    options={data.users.map((i: IUser) => ({
                      label: `${i.customerId}`,
                      value: i.id,
                    }))}
                    isOptionEqualToValue={(a, b) => a.value === b.value}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RHFTextField
                    name="total_places"
                    label={t('packages.createPackageForm.packageNumber')}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <RHFTextField
                    name="total_count"
                    label={t('packages.createPackageForm.stockNumber')}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                  />
                </Grid>
                <Grid item xs={6}>
                  <RHFTextField
                    name="order_capacity"
                    label={`${t('packages.createPackageForm.capacity')} ( m³ )`}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            m³
                          </Box>
                        </InputAdornment>
                      ),
                      inputMode: 'decimal',
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RHFTextField
                    name="order_weight"
                    label={`${t('packages.createPackageForm.weight')} ( kg )`}
                    InputLabelProps={{ shrink: true }}
                    type="number"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ color: 'text.disabled' }}>
                            kg
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <RHFTextField
                    name="description"
                    InputLabelProps={{ shrink: true }}
                    label={t('packages.createPackageForm.description')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RHFSwitch name="isCustomsByUser" label={t('packages.createPackageForm.isCustomsByUser')} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" mb={1}>
                    {t('packages.createPackageForm.short')}
                  </Typography>
                  <RHFEditor name="note" placeholder={t('packages.createPackageForm.short')} />
                </Grid>
                
                <Grid item xs={12}>
                  <RHFUpload
                    multiple
                    name="images"
                    onDrop={handleDrop}
                    onRemove={handleRemoveFile}
                    onRemoveAll={handleRemoveAllFiles}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <Divider />
            <CardActions sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" size="medium" color="error" onClick={() => navigate(-1)}>
                {t('actions.cancel')}
              </Button>
              <LoadingButton
                loading={isPending || uploading || isUpdating}
                color="primary"
                variant="contained"
                size="medium"
                type="submit"
              >
                {t('actions.save')}
              </LoadingButton>
            </CardActions>
          </Card>
        </FormProvider>
      </Box>
    </Container>
  );
};
export default CreatePackageForm;
