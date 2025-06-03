import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { useTranslate } from 'src/locales';

import { price } from '../api/price';
import { PriceSchemeType } from '../libs/priceScheme';

export const useCreatePrice = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: PriceSchemeType) => price.create(values),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.priceCreated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return {
    onCreate: mutateAsync,
    isCreating: isPending,
  };
};
