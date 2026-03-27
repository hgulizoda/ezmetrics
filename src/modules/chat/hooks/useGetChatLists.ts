import { useQuery } from '@tanstack/react-query';

import { MOCK_CHAT_ROOMS } from 'src/_mock/fake-backend';

export const useGetChatLists = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['chat_lists'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { data: MOCK_CHAT_ROOMS };
    },
  });
  return { data, isLoading };
};
