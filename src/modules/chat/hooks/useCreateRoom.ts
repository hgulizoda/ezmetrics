import { useMutation } from '@tanstack/react-query';

import { queryClient } from 'src/query';

export const useCreateRoom = () => {
  const { mutateAsync: createAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      await new Promise((r) => setTimeout(r, 300));
      return { _id: `chat_new_${Date.now()}`, user: id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatLists'] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
  return { createAsync, isPending };
};
