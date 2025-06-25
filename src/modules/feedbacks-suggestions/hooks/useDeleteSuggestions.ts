import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';

import { suggestions } from '../api/fs';

export const useDeleteSuggestions = (id: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => suggestions.delete(id),
    onSuccess: () => {
      enqueueSnackbar("Muvaffaqiyatli o'chirildi", {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['suggestions'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { isPending, mutateAsync };
};
