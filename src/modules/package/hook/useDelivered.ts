import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import { witoutTruckPackages } from '../api/packageApis';

export const useDelivered = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, userID }: { id: string; userID: string }) =>
      witoutTruckPackages.delivered(id, userID),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageDelivered'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['residuePackages'],
      });
    },
    onError: (err) => showErrorSnackbar(err),
  });

  return { onDelivered: mutateAsync, isDelevered: isPending };
};
