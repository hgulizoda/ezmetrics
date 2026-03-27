import { useQuery } from '@tanstack/react-query';

import { MOCK_MESSAGES } from 'src/_mock/fake-backend';

export const useGetMessages = (chatId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { data: MOCK_MESSAGES[chatId] || [] };
    },
  });
  return { data, isLoading };
};
