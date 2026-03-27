import { useQuery } from '@tanstack/react-query';

export const useGetArchivedMessages = (roomId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['archived-messages', roomId],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return { data: [] as any[] };
    },
  });
  return { data, isLoading, error };
};
