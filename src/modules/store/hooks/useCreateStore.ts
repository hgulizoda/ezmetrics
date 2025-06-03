import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';
import { useTranslate } from 'src/locales';

import { store } from '../api/store';
import { CreateStoreSchemaType } from '../libs/createStoreScheme';

export const useCreateStore = () => {
  const { t } = useTranslate('lang');
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: CreateStoreSchemaType) => store.create(values),
    onSuccess: () => {
      enqueueSnackbar(t('mutate.storeCreated'), {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['stores'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });
  return { mutateAsync, isPending };
};
