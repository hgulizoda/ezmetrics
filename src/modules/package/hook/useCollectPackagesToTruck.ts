import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { queryClient } from '../../../query';
import { collectPackage } from '../api/packageApis';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useCollectPackagesToTruck = (id: string, query: string, selectedOrder: string[]) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (truckID: string) => {
      if (selectedOrder.length > 0) {
        return Promise.all(selectedOrder.map((item) => collectPackage.add(item, truckID)));
      }
      return collectPackage.add(id, truckID);
    },
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageAdded'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: [query],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    onCollect: mutateAsync,
    isCollecting: isPending,
  };
};
