import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Grid,
  Button,
  Dialog,
  Divider,
  MenuItem,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';
import { CreateNewTruck } from 'src/modules/settings/ui/actions/CreateNewTruck';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect } from 'src/components/hook-form';

import { IUserId } from 'src/types/UserId';

import Label from '../../../../components/label';
import { useGetTrucks } from '../../../settings/hooks/trucks';
import { TruckStatus, useTruckEnumLabels } from '../../../settings/libs/truckEnum';
import { chinaBorderscheme, ChinaBorderFormType } from '../../libs/changeToChinaBorderScheme';
import { useChangeToChinaBorder, useChangeToChinaBorderMultiple } from '../../hook/chinaWarehouse';

interface Props {
  open: boolean;
  onClose: () => void;
  packageId: { id: string; userId: string; clientId: string };
  rowIDs?: IUserId[];
}

export const ChangeToChinaBorder = ({ open, onClose, packageId, rowIDs }: Props) => {
  const truckLabels = useTruckEnumLabels();
  const { t } = useTranslate('lang');
  const { updateStatus, isPending } = useChangeToChinaBorder(packageId.id, packageId.userId);
  const { updateMultiStatus, isPending: isPendingMulti } = useChangeToChinaBorderMultiple();
  const { data } = useGetTrucks({
    page: 1,
    limit: 10000,
  });
  const form = useForm<ChinaBorderFormType>({
    defaultValues: {
      status: 'to_china_border',
      truck: '',
      transit_zone: '',
    },
    resolver: yupResolver(chinaBorderscheme),
  });

  const openAddTruck = useBoolean();

  const formSubmit = async (formValues: ChinaBorderFormType) => {
    if (rowIDs?.length) {
      await updateMultiStatus({
        data: formValues,
        ids: rowIDs,
      });
    } else {
      await updateStatus(formValues);
    }
    onClose();
  };

  return (
    <Box>
      <Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
        <FormProvider methods={form} onSubmit={form.handleSubmit(formSubmit)}>
          <DialogTitle
            sx={{
              fontWeight: 'medium',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1,
            }}
          >
            {t('packages.actions.client')}
            <IconButton onClick={openAddTruck.onTrue}>
              <Iconify icon="fluent:add-12-filled" />
            </IconButton>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ py: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <RHFSelect name="truck" label={t('packages.actions.truck')}>
                  {data.trucks
                    .filter(
                      (el) =>
                        el.status === TruckStatus.TO_CHINA_BORDER || el.status === TruckStatus.NEW
                    )
                    .map((el) => (
                      <MenuItem
                        key={el.id}
                        value={el.id}
                        sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
                      >
                        {el.truckName} <Label>{truckLabels[el.status as TruckStatus]}</Label>
                        {el.containerNumber}
                      </MenuItem>
                    ))}
                </RHFSelect>
              </Grid>
              <Grid item xs={12}>
                <RHFSelect name="transit_zone" label={t('packages.actions.selectTransit')}>
                  <MenuItem value="kg">{t('country.kg')}</MenuItem>
                  <MenuItem value="kz">{t('country.kz')}</MenuItem>
                </RHFSelect>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button variant="contained" type="button" color="error" onClick={onClose}>
              {t('actions.cancel')}
            </Button>
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              loading={isPending || isPendingMulti}
            >
              {t('actions.save')}
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <CreateNewTruck open={openAddTruck.value} onClose={openAddTruck.onFalse} />
    </Box>
  );
};
