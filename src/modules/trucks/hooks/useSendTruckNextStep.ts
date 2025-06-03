import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { queryClient } from '../../../query';
import { sendTrucktoNextStep } from '../api/border';
import { SendTransitType } from '../libs/sendTransit';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useSendTruckNextStep = (
  id: string,
  status: string,
  trucks: string[],
  query: string
) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      if (trucks.length > 0) {
        return Promise.all(trucks.map((truck) => sendTrucktoNextStep.send(truck, status)));
      }
      return sendTrucktoNextStep.send(id, status);
    },
    onSuccess: async () => {
      enqueueSnackbar(t('mutate.truckSended'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: [query],
      });
      queryClient.invalidateQueries({
        queryKey: ['truckCount'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { onSending: mutateAsync, isSending: isPending };
};

export const useSendTruckNextStepWithTransit = (
  id: string,
  status: string,
  trucks: string[],
  query: string
) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (value: SendTransitType) => {
      if (trucks.length > 0) {
        return Promise.all(trucks.map((truck) => sendTrucktoNextStep.send(truck, status, value)));
      }
      return sendTrucktoNextStep.send(id, status, value);
    },
    onSuccess: async () => {
      enqueueSnackbar(t('mutate.truckSended'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: [query],
      });
      queryClient.invalidateQueries({
        queryKey: ['truckCount'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { onSendingTransit: mutateAsync, isSendingTransit: isPending };
};
