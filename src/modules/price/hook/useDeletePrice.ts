import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import { price } from '../api/price';

export const useDeletePrice = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) => price.delete(id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.deleted'), {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['prices'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    onDelete: mutateAsync,
    isDeleting: isPending,
  };
};
