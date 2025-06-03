import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

import { IMessageRes } from '../types/messages';

export const useGetMessages = (chatId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () =>
      axiosInstance
        .get<{ data: IMessageRes[] }>(`/chat/${chatId}/messages`)
        .then((res) => res.data),
  });

  return { data, isLoading };
};
