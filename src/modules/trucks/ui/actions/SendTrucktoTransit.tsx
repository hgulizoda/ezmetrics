import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { useTranslate } from 'src/locales';

import { ConfirmDialog } from 'src/components/custome-dialog';

import { useSendTruckNextStep } from '../../hooks/useSendTruckNextStep';

interface IProps {
  open: boolean;
  onClose: () => void;
  trucks: string[];
  id: string;
  status: string;
}

export const SendTrucktoTransit = ({ open, onClose, trucks, id, status }: IProps) => {
  const { t } = useTranslate('lang');
  const { onSending, isSending } = useSendTruckNextStep(id, status, trucks, 'truckDetails');
  const sendTruck = async () => {
    await onSending();
    onClose();
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t('packages.actions.sendTransit')}
      content={t('packages.actions.sendTransitDescription')}
      action={
        <>
          <Button variant="contained" color="error" onClick={onClose}>
            {t('actions.not')}
          </Button>
          <LoadingButton variant="contained" color="primary" loading={isSending} onClick={sendTruck}>
            {t('actions.yes')}
          </LoadingButton>
        </>
      }
    />
  );
};
