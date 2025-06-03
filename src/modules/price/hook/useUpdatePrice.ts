import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import { price } from '../api/price';
import { PriceSchemeType } from '../libs/priceScheme';

export const useUpdatePrice = (id: string) => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: PriceSchemeType) => price.update(values, id),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.priceUpdated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['price-id'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    onUpdate: mutateAsync,
    isUpdating: isPending,
  };
};
