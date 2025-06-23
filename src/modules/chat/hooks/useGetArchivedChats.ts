import { useQuery } from '@tanstack/react-query';

import axiosInstance from 'src/utils/axios';

interface Props {
  params: {
    page: number;
    limit: number;
  };
}

export const useGetArchivedChats = ({ params }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ['archived-chats', params],
    queryFn: () => axiosInstance.get('/chat?status=archived', { params }).then((res) => res.data),
  });

  return { data, isLoading };
};
