import { useMutation } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { queryClient } from 'src/query';

export const useCreateRoom = () => {
  const { mutateAsync: createAsync, isPending } = useMutation({
    mutationFn: (id: string) => axiosInstance.post(`/chat`, { user: id }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['chatLists'],
      });
      queryClient.invalidateQueries({
        queryKey: ['messages'],
      });
    },
  });

  return { createAsync, isPending };
};
