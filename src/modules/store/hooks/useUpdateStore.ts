import { TFunction } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';

import { store } from '../api/store';
import { CreateStoreSchemaType } from '../libs/createStoreScheme';

interface Props {
  id: string;
  t: TFunction;
}

export const useUpdateStore = ({ id, t }: Props) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (values: CreateStoreSchemaType) => store.update(values, id),
    onSuccess: () => {
      enqueueSnackbar(t('store.form.editSuccess'), {
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
  return { updateAsync: mutateAsync, isUpdating: isPending };
};
