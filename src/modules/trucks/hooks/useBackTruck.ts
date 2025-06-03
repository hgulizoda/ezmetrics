import { enqueueSnackbar } from 'notistack';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query';

import { sendTrucktoNextStep } from '../api/border';

export const useBackTruck = (status: string) => {
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (id: string) => sendTrucktoNextStep.back(id, status),
    onSuccess: () => {
      enqueueSnackbar("Jo'natma ortga qaytarildi", {
        variant: 'success',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
      queryClient.invalidateQueries({
        queryKey: ['truckDetails'],
      });
      queryClient.invalidateQueries({
        queryKey: ['truckCount'],
      });
    },
    onError: () => {
      enqueueSnackbar('Xatolik yuz berdi', {
        variant: 'error',
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'top',
        },
      });
    },
  });
  return { isPending, mutateAsync };
};
