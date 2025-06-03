import { get } from 'lodash';
import { useQuery } from '@tanstack/react-query';

import { userOrderCountAdapter } from '../libs/userOrderCountAdapter';
import { getTableCount, getUserOrderCount } from '../api/packagesCount';

export const useGetCount = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['counts'],
    queryFn: getTableCount,
  });

  return { data, isLoading, error };
};

export const useGetUserOrderCount = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userOrderCount'],
    queryFn: () => getUserOrderCount(id),
    select: (res) => userOrderCountAdapter(get(res, 'data')),
  });

  return {
    orderCount: data,
    isLoading,
    error,
  };
};
