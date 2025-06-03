import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import { DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useTranslate } from 'src/locales';

import { generateRandomId } from '../../../../utils/randomId';
import FormProvider, { RHFSelect } from '../../../../components/hook-form';
import { SendTransitType, sendTransitScheme } from '../../libs/sendTransit';
import { useSendTruckNextStepWithTransit } from '../../hooks/useSendTruckNextStep';

interface IProps {
  open: boolean;
  onClose: () => void;
  trucks: string[];
  id: string;
  status: string;
}

export const SendTrucktoTransit = ({ open, onClose, trucks, id, status }: IProps) => {
  const { t } = useTranslate('lang');
  const { onSendingTransit, isSendingTransit } = useSendTruckNextStepWithTransit(
    id,
    status,
    trucks,
    'truckDetails'
  );
  const form = useForm<SendTransitType>({
    defaultValues: {
      transit_zone: '',
    },
    resolver: yupResolver(sendTransitScheme),
  });
  const sendTruck = async (value: SendTransitType) => {
    await onSendingTransit(value);
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ pt: 2, pb: 1 }}>{t('packages.actions.sendTransit')}</DialogTitle>
      <FormProvider methods={form} onSubmit={form.handleSubmit(sendTruck)}>
        <DialogContent>
          <RHFSelect name="transit_zone" sx={{ mt: 2 }} label={t('packages.actions.selectTransit')}>
            <MenuItem key={generateRandomId(12)} value="kg">
              {t('country.kg')}
            </MenuItem>
            <MenuItem key={generateRandomId(12)} value="kz">
              {t('country.kz')}
            </MenuItem>
          </RHFSelect>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="error" onClick={onClose} type="button">
            {t('actions.not')}
          </Button>
          <LoadingButton
            variant="contained"
            color="primary"
            loading={isSendingTransit}
            type="submit"
          >
            {t('actions.yes')}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};
