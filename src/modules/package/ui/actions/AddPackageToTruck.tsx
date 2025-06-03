import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import { DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import Label from '../../../../components/label';
import { useGetTrucks } from '../../../settings/hooks/trucks';
import FormProvider, { RHFSelect } from '../../../../components/hook-form';
import { useCollectPackagesToTruck } from '../../hook/useCollectPackagesToTruck';
import { TruckStatus, TruckTypeIcons, useTruckEnumLabels } from '../../../settings/libs/truckEnum';

interface IProps {
  open: boolean;
  onClose: () => void;
  selectedOrders: string[];
  singleOrder: string;
}

export const AddPackageToTruck = ({ open, onClose, selectedOrders, singleOrder }: IProps) => {
  const truckLabels = useTruckEnumLabels();
  const { t } = useTranslate('lang');
  const location = useLocation();
  const { onCollect, isCollecting } = useCollectPackagesToTruck(
    singleOrder,
    'residuePackages',
    selectedOrders
  );
  const { data } = useGetTrucks();
  const form = useForm({
    defaultValues: {
      truck: '',
    },
  });
  const addToTruck = async (value: { truck: string }) => {
    await onCollect(value.truck);
    onClose();
  };

  const filteredTrucks = useMemo(() => {
    if (!data?.trucks || data.trucks.length === 0) return [];

    switch (true) {
      case location.pathname.includes('china-warehouse'):
        return data.trucks.filter(
          (el) => el.status === TruckStatus.NEW || el.status === TruckStatus.TO_CHINA_BORDER
        );

      case location.pathname.includes('china-border'):
        return data.trucks.filter(
          (el) => el.status === TruckStatus.NEW || el.status === TruckStatus.TO_CHINA_BORDER
        );

      case location.pathname.includes('tranzit-zone'):
        return data.trucks.filter(
          (el) =>
            el.status === TruckStatus.NEW ||
            el.status === TruckStatus.TO_CHINA_BORDER ||
            el.status === TruckStatus.IN_TRANSIT
        );

      case location.pathname.includes('uzb-customs'):
        return data.trucks.filter((el) => el.status === TruckStatus.TO_UZB_CUSTOMS);

      case location.pathname.includes('customs'):
        return data.trucks.filter((el) => el.status === TruckStatus.IN_CUSTOMS);

      default:
        return data.trucks;
    }
  }, [data?.trucks, location.pathname]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <FormProvider methods={form} onSubmit={form.handleSubmit(addToTruck)}>
        <DialogTitle sx={{ pb: 0 }}>{t('packages.actions.truck')}</DialogTitle>
        <DialogContent>
          <RHFSelect name="truck" label={t('packages.actions.truckLabel')} sx={{ mt: 2 }}>
            {filteredTrucks.map((el) => (
              <MenuItem
                key={el.id}
                value={el.id}
                sx={{ display: 'flex', gap: 2, alignItems: 'center' }}
              >
                {el.truckName}{' '}
                {TruckTypeIcons[el.status] === '' ? (
                  <Label>{truckLabels[el.status as TruckStatus]}</Label>
                ) : (
                  <Label endIcon={<Iconify icon={TruckTypeIcons[el.status]} />}>
                    {truckLabels[el.status as TruckStatus]}
                  </Label>
                )}
                {el.containerNumber}
              </MenuItem>
            ))}
          </RHFSelect>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={onClose} type="button">
            {t('actions.cancel')}
          </Button>
          <LoadingButton loading={isCollecting} variant="contained" color="primary" type="submit">
            {t('actions.save')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};
