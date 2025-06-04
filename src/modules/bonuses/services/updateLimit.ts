import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IUpdateLimit } from '../types/Limit';
import { bonusesAPI } from '../api/bonusesAPi';

export const useUpdateLimit = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (limit: IUpdateLimit) => bonusesAPI.changeLimit(limit),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['limit'],
      });
      toast.success('Updated', { position: 'top-center' });
    },
    onError: (err) => {
      toast.error(err.message, { position: 'top-center' });
    },
  });
  return {
    updateBunusLimit: mutateAsync,
    isPending,
  };
};
