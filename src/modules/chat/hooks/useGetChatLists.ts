import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

export const useGetChatLists = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat_lists'],
    queryFn: () => axiosInstance.get('/chat').then((res) => res.data),
  });

  return { data, isLoading };
};
