import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export const useGetArchivedMessages = (roomId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['archived-messages', roomId],
    queryFn: () => axiosInstance.get(`chat/${roomId}/messages`).then((res) => res.data),
  });

  return { data, isLoading, error };
};
