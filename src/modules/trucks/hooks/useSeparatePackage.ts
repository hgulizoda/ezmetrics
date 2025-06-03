import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { useTranslate } from 'src/locales';

import { truckPackage } from '../api/border';
import { queryClient } from '../../../query';
import { SeparateFormType } from '../libs/separateScheme';
import { showErrorSnackbar } from '../../../utils/showErrorSnackbar';

export const useSeparatePackage = (id: string, query: string) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: SeparateFormType) => truckPackage.separate(value, id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.packagePartial'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: [query],
      });
      queryClient.invalidateQueries({
        queryKey: ['counts'],
      });
    },
    onError: (error) => {
      showErrorSnackbar(error);
    },
  });

  return {
    onSeparate: mutateAsync,
    isSeparating: isPending,
  };
};

export const useFullSeparatePackage = (truckID: string) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => truckPackage.takeDown(truckID, id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.takeFromTruck'), {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      queryClient.invalidateQueries({
        queryKey: ['truckDetails'],
      });
    },
    onError: (error) => {
      showErrorSnackbar(error);
    },
  });
  return {
    onTakeDown: mutateAsync,
    isTaking: isPending,
  };
};
