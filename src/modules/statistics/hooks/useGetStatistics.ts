import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { statistics } from '../api/statis';
import { statisticsMapper } from '../libs/stats';

export const useGetStatistics = (params: { page: number; limit: number; search: string }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['statistics', params],
    queryFn: () => statistics.get(params),
    select: (res) => ({
      list: statisticsMapper(get(res, 'data.users', [])),
      totals: {
        total_capacity: get(res, 'data.total_capacity'),
        total_weight: get(res, 'data.total_weight'),
        places: get(res, 'data.total_places'),
        counts: get(res, 'data.total_orders'),
      },
      pagination: {
        totalRecords: get(res, 'data.pagination.total_records'),
        currentPage: get(res, 'data.pagination.current_page'),
        totalPages: get(res, 'data.pagination.total_pages'),
      },
    }),
  });

  return { data, isLoading, error };
};
