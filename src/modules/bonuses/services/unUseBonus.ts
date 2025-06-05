import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { bonusesAPI } from '../api/bonusesAPi';

type IProps = {
  bonus_id: string;
  user_id: string;
};
export const useUnuseBouns = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ bonus_id, user_id }: IProps) => bonusesAPI.unUseBonus(bonus_id, user_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bonuses'] });
      queryClient.invalidateQueries({ queryKey: ['bonuses_user'] });
      toast.success('Updated', { position: 'top-center' });
    },
    onError: (err) => {
      toast.error(err.message, { position: 'top-center' });
    },
  });
  return {
    unuseBouns: mutateAsync,
    isPending,
  };
};
