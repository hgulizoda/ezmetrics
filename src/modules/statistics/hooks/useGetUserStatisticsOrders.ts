import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { statistics } from '../api/statis';
import { getProfileOrdersAdapter } from '../../package/libs/userProfileOrdersAdapter';

interface UseGetUserStatisticsOrdersParams {
  userId: string;
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export const useGetUserStatisticsOrders = ({
  userId,
  page,
  limit,
  status,
  search,
}: UseGetUserStatisticsOrdersParams) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userStatisticsOrders', userId, page, limit, status, search],
    queryFn: () => statistics.getUserOrders(userId, { page, limit, status, search }),
    select: (res) => ({
      orders: getProfileOrdersAdapter(get(res, 'data', [])),
      pagination: get(res, 'pagination', {
        total_records: 0,
        current_page: page,
        total_pages: 1,
        next_page: null,
        prev_page: null,
      }),
    }),
    enabled: !!userId,
  });

  return {
    data,
    isLoading,
    error,
  };
};
