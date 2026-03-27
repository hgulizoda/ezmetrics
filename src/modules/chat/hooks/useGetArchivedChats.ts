import { useQuery } from '@tanstack/react-query';

interface Props {
  params: { page: number; limit: number };
}

export const useGetArchivedChats = ({ params }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['archived-chats', params],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300));
      return {
        data: [] as any[],
        pagination: { total_records: 0, current_page: params.page, total_pages: 0, next_page: null, prev_page: null },
      };
    },
  });
  return { data, isLoading };
};
