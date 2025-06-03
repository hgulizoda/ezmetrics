import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { queryClient } from '../../../query';
import { singleOrder } from '../api/packageApis';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useArchivePackage = (selectedPackages: string[], query: string) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      if (selectedPackages.length > 0) {
        return Promise.all(selectedPackages.map((p) => singleOrder.archive(p)));
      }
      return singleOrder.archive(id);
    },
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packageArchived'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      queryClient.invalidateQueries({
        queryKey: [query],
      });
      queryClient.invalidateQueries({
        queryKey: ['allPackages'],
      });
      queryClient.invalidateQueries({
        queryKey: ['counts'],
      });
    },
    onError: (error) => {
      showErrorSnackbar(error);
    },
  });
  return { mutateAsync, isPending };
};
