import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';

import { feedbacks } from '../api/fs';

export const useDeleteFeedback = (id: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => feedbacks.delete(id),
    onSuccess: () => {
      enqueueSnackbar("Muvaffaqiyatli o'chirildi", {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['feedbacks'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { isPending, mutateAsync };
};
