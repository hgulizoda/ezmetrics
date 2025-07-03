import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { showErrorSnackbar } from 'src/utils/showErrorSnackbar';

import { queryClient } from 'src/query';

import { bonusesAPI } from '../api/bonusesAPi';

export const useRemoveBonus = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: bonusesAPI.removeOrderBall,
    onSuccess: () => {
      enqueueSnackbar('Muvaffaqiyatli!', {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['single-bonuses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['removed-balls'],
      });
    },
    onError: (err) => {
      showErrorSnackbar(err);
    },
  });

  return { mutateAsync, isPending };
};
