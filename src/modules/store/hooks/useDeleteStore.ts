import { TFunction } from 'i18next';
import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query';

import { store } from '../api/store';

interface Props {
  t: TFunction;
}

export const useDeleteStore = ({ t }: Props) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => store.delete(id),
    onSuccess: () => {
      enqueueSnackbar(t('store.delete.deleteSuccess'), {
        variant: 'success',
        anchorOrigin: { horizontal: 'right', vertical: 'top' },
      });
      queryClient.invalidateQueries({
        queryKey: ['stores'],
      });
    },
    onError: () => {
      enqueueSnackbar('Xatolik yuz berdi', {
        variant: 'error',
        anchorOrigin: { horizontal: 'right', vertical: 'top' },
      });
    },
  });

  return { isDeleting: isPending, deleteAsync: mutateAsync };
};
